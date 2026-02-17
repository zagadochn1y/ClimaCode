import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { co2 } from "https://esm.sh/@tgwf/co2@0.17.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url, country } = await req.json();
    if (!url || typeof url !== "string") throw new Error("URL is required");
    try { new URL(url); } catch { throw new Error("Invalid URL format"); }

    let bytes = 0;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const pageResp = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "ClimaCode Carbon Scanner/1.0" },
      });
      clearTimeout(timeout);
      const body = await pageResp.arrayBuffer();
      bytes = body.byteLength;
      const contentLength = pageResp.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > bytes) {
        bytes = parseInt(contentLength);
      }
    } catch (fetchErr) {
      console.error("Fetch page error:", fetchErr);
      bytes = 2000000;
    }

    const swd = new co2({ model: "swd" });
    const co2PerViewGrams = swd.perVisit(bytes);
    const co2PerView = parseFloat(Number(co2PerViewGrams).toFixed(2));
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text:
                        `You are a web sustainability expert. ` +
                        `Return exactly 4 recommendations as JSON array of strings. ` +
                        `Each format: "Title — Description". ` +
                        `Keep under 100 chars. No markdown.\n\n` +
                        `Website: ${url}, Country: ${country || "Unknown"}, ` +
                        `CO2 per view: ${co2PerView}g, Page size: ${(bytes / 1024).toFixed(0)}KB, ` +
                        `Sustainability score: ${sustainabilityScore}.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (aiResp.ok) {
          const aiData = await aiResp.json();
          const content =
            aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

          try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) recommendations = JSON.parse(jsonMatch[0]);
          } catch {
            recommendations = content
              .split("\n")
              .filter((l: string) => l.trim().length > 10)
              .slice(0, 4);
          }
        } else {
          console.error("Gemini error:", aiResp.status, await aiResp.text());
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

    return new Response(JSON.stringify({
      co2PerView, co2PerYear, sustainabilityScore, breakdown, recommendations, bytes,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("climascan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
