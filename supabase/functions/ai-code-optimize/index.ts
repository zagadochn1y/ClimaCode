import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
  const { code } = await req.json();
  if (!code || typeof code !== "string") {
    throw new Error("Code is required");
  }

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  let result = null;

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
                    text: `You are a code carbon optimizer.

  Return ONLY valid JSON with this exact structure:
  {
    "originalScore": number,
    "optimizedScore": number,
    "co2Reduction": number,
    "optimizedCode": string,
    "improvements": string[]
  }

  No markdown. No explanation. Only JSON.

  Code:
  ${code}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 800,
              response_mime_type: "application/json",
            },
          }),
        }
      );

      if (aiResp.ok) {
        const aiData = await aiResp.json();

        const content =
          aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        try {
          result = JSON.parse(content);
        } catch {
          const match = content.match(/\{[\s\S]*\}/);
          if (match) {
            result = JSON.parse(match[0]);
          }
        }
      } else {
        console.error("Gemini AI error:", aiResp.status, await aiResp.text());
      }
    } catch (e) {
      console.error("Gemini fetch error:", e);
    }

    if (!result || !result.optimizedCode) {
      throw new Error("Invalid AI response");
    }

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
