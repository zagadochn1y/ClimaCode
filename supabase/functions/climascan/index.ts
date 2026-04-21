import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { co2 } from "https://esm.sh/@tgwf/co2@0.17.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Grid carbon intensity factors (gCO2/kWh) — relative to world average
// Higher = dirtier grid, lower = cleaner grid
const gridIntensity: Record<string, number> = {
  "United States": 1.0,
  "Germany": 0.85,
  "United Kingdom": 0.55,
  "France": 0.25, // mostly nuclear
  "Netherlands": 0.9,
  "Singapore": 1.05,
  "Japan": 1.1,
  "Russia": 1.4,
  "Canada": 0.45,
  "Kazakhstan": 1.6, // coal-heavy
  "India": 1.5,
  "Brazil": 0.35, // mostly hydro
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url, country } = await req.json();
    if (!url || typeof url !== "string") throw new Error("URL is required");
    try { new URL(url); } catch { throw new Error("Invalid URL format"); }

    let bytes = 0;
    let siteReachable = true;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const pageResp = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "ClimaCode Carbon Scanner/1.0" },
      });
      clearTimeout(timeout);

      if (!pageResp.ok && pageResp.status >= 400) {
        siteReachable = false;
      } else {
        const body = await pageResp.arrayBuffer();
        bytes = body.byteLength;
        const contentLength = pageResp.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > bytes) {
          bytes = parseInt(contentLength);
        }
      }
    } catch (fetchErr) {
      console.error("Fetch page error:", fetchErr);
      siteReachable = false;
    }

    if (!siteReachable) {
      return new Response(JSON.stringify({
        error: "Website is unreachable or does not exist. Please check the URL and try again.",
      }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const swd = new co2({ model: "swd" });
    let co2PerViewGrams = Number(swd.perVisit(bytes));

    // Apply country grid intensity factor
    const countryFactor = gridIntensity[country] ?? 1.0;
    co2PerViewGrams = co2PerViewGrams * countryFactor;

    const co2PerView = parseFloat(co2PerViewGrams.toFixed(2));
    const co2PerYear = parseFloat((co2PerView * 10000 / 1000).toFixed(2));

    const breakdown = { images: 42, css: 8, javascript: 35, other: 15 };

    const medianCo2 = 0.5;
    let sustainabilityScore: number;
    if (co2PerView <= 0.1) sustainabilityScore = 0.95;
    else if (co2PerView <= medianCo2) sustainabilityScore = parseFloat((0.7 + 0.25 * (1 - co2PerView / medianCo2)).toFixed(2));
    else if (co2PerView <= 1.5) sustainabilityScore = parseFloat((0.3 + 0.4 * (1 - (co2PerView - medianCo2) / 1.0)).toFixed(2));
    else sustainabilityScore = parseFloat(Math.max(0.05, 0.3 - (co2PerView - 1.5) * 0.1).toFixed(2));

    
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    let recommendations: string[] = [];

    if (GEMINI_API_KEY) {
      try {
        const aiResp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `
    You are a web sustainability expert.

    Return EXACTLY 4 recommendations as a JSON array of strings.
    Each item format: "Title — Description"
    Each under 100 characters.
    NO markdown, NO explanations, ONLY valid JSON array.

    Website: ${url}
    Country: ${country || "Unknown"}
    Grid intensity factor: ${countryFactor}
    CO2 per view: ${co2PerView}g
    Page size: ${(bytes / 1024).toFixed(0)}KB
    Sustainability score: ${sustainabilityScore}
                      `.trim(),
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 150,
              },
            }),
          }
        );

        if (aiResp.ok) {
          const aiData = await aiResp.json();

          const content =
            aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

          try {
            
            const jsonMatch = content.match(/\[[\s\S]*\]/);

            if (jsonMatch) {
              recommendations = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("No JSON found");
            }
          } catch (err) {
            console.error("Gemini parse error:", err);

            recommendations = content
              .split("\n")
              .map((l: string) => l.replace(/^\-|\*/g, "").trim())
              .filter((l: string) => l.length > 10)
              .slice(0, 4);
          }
        } else {
          console.error("Gemini AI error:", aiResp.status, await aiResp.text());
        }
      } catch (e) {
        console.error("Gemini fetch error:", e);
      }
    }

    
    if (recommendations.length === 0) {
      recommendations = [
        "Optimize images — Convert to WebP and compress to reduce transfer size.",
        "Minify JavaScript — Remove unused code to decrease page weight.",
        "Enable lazy loading — Load resources only when needed.",
        "Use green hosting — Switch to renewable-energy powered servers.",
      ];
    }

    return new Response(
      JSON.stringify({
        co2PerView,
        co2PerYear,
        sustainabilityScore,
        breakdown,
        recommendations,
        bytes,
        countryFactor,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("climascan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
