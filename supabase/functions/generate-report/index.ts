import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let data;
    try { data = await req.json(); } catch {
      return new Response(JSON.stringify({ error: "Invalid or empty JSON body" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, url, co2PerView, co2PerYear, sustainabilityScore, breakdown, recommendations } = data;

    // Certificate Generation
    if (type === "certificate") {
      if (sustainabilityScore < 0.7) {
        return new Response(JSON.stringify({ error: "Score too low for certificate" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const certDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const certHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:800px;height:566px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center}
.cert{width:760px;height:530px;border:3px solid #16a34a;border-radius:16px;padding:40px;text-align:center;position:relative;background:white}
.cert::before{content:'';position:absolute;inset:8px;border:1px solid #bbf7d0;border-radius:12px}
h1{font-family:'Playfair Display',serif;color:#15803d;font-size:32px;margin-bottom:8px}
.subtitle{color:#16a34a;font-size:14px;margin-bottom:24px;font-weight:600}
.url{font-size:20px;font-weight:700;color:#166534;margin:16px 0}
.score{font-size:48px;font-weight:700;color:#16a34a;margin:8px 0}
.score-label{color:#6b7280;font-size:13px}
.stats{display:flex;justify-content:center;gap:40px;margin:16px 0}
.stat-val{font-size:18px;font-weight:700;color:#166534}
.stat-label{font-size:11px;color:#6b7280}
.date{color:#9ca3af;font-size:12px;margin-top:16px}
.leaf{position:absolute;font-size:24px}.leaf-1{top:16px;left:16px}.leaf-2{top:16px;right:16px}.leaf-3{bottom:16px;left:16px}.leaf-4{bottom:16px;right:16px}
</style></head><body>
<div class="cert">
<span class="leaf leaf-1">🌿</span><span class="leaf leaf-2">🌿</span><span class="leaf leaf-3">🌿</span><span class="leaf leaf-4">🌿</span>
<h1>Green Website Certificate</h1>
<p class="subtitle">CERTIFIED BY CLIMACODE</p>
<p class="url">${url}</p>
<p class="score">${sustainabilityScore}</p>
<p class="score-label">Sustainability Score</p>
<div class="stats">
<div><p class="stat-val">${co2PerView}g</p><p class="stat-label">CO₂ per view</p></div>
<div><p class="stat-val">${co2PerYear}kg</p><p class="stat-label">CO₂ per year</p></div>
</div>
<p class="date">Issued on ${certDate}</p>
</div></body></html>`;

      return new Response(JSON.stringify({ html: certHtml }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Gemini API
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

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
              parts: [
                {
                  text: `You are a sustainability expert. Generate a detailed carbon audit report for:

    Website: ${url}
    CO2 per view: ${co2PerView}g
    CO2 per year: ${co2PerYear}kg
    Sustainability Score: ${sustainabilityScore}
    Breakdown: Images ${breakdown?.images}%, CSS ${breakdown?.css}%, JS ${breakdown?.javascript}%, Other ${breakdown?.other}%
    Recommendations: ${recommendations?.join("; ")}

    Include:
    - Overview
    - Key Findings
    - Detailed Recommendations
    - Next Steps

    Keep it professional and under 500 words.
    Return plain text only.`
                }
              ]
            }
          ]
        }),
      }
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("Gemini error:", errText);
      throw new Error("Gemini API error");
    }

    const aiData = await aiResp.json();

    const analysisContent =
      aiData.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Analysis unavailable.";

    const reportDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const reportHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;padding:40px;max-width:800px;margin:auto;color:#1f2937;line-height:1.6}
h1{color:#15803d;font-size:28px;border-bottom:3px solid #16a34a;padding-bottom:8px;margin-bottom:24px}
h2{color:#166534;font-size:18px;margin:20px 0 8px}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
.logo{font-size:24px;font-weight:700;color:#15803d}
.date{color:#6b7280;font-size:13px}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0}
.stat-card{background:#f0fdf4;border-radius:12px;padding:16px;text-align:center}
.stat-val{font-size:24px;font-weight:700;color:#16a34a}
.stat-label{font-size:12px;color:#6b7280;margin-top:4px}
.bar{height:24px;border-radius:12px;display:flex;overflow:hidden;margin:8px 0}
.bar>div:nth-child(1){background:#22c55e}.bar>div:nth-child(2){background:#86efac}.bar>div:nth-child(3){background:#16a34a}.bar>div:nth-child(4){background:#166534}
.legend{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0 24px}
.legend-item{display:flex;align-items:center;gap:6px;font-size:12px;color:#6b7280}
.legend-dot{width:10px;height:10px;border-radius:50%}
.analysis{white-space:pre-wrap;font-size:14px}
.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px;text-align:center}
</style></head><body>
<div class="header"><span class="logo">🌿 ClimaCode</span><span class="date">${reportDate}</span></div>
<h1>Carbon Audit Report</h1>
<p style="font-size:16px;color:#16a34a;font-weight:600;margin-bottom:24px">${url}</p>
<div class="stats-grid">
<div class="stat-card"><p class="stat-val">${co2PerView}g</p><p class="stat-label">CO₂ per view</p></div>
<div class="stat-card"><p class="stat-val">${co2PerYear}kg</p><p class="stat-label">CO₂ per year</p></div>
<div class="stat-card"><p class="stat-val">${sustainabilityScore}</p><p class="stat-label">Sustainability Score</p></div>
</div>
<h2>Resource Breakdown</h2>
<div class="bar">
<div style="width:${breakdown?.images ?? 40}%"></div>
<div style="width:${breakdown?.css ?? 10}%"></div>
<div style="width:${breakdown?.javascript ?? 35}%"></div>
<div style="width:${breakdown?.other ?? 15}%"></div>
</div>
<div class="legend">
<div class="legend-item"><div class="legend-dot" style="background:#22c55e"></div>Images ${breakdown?.images ?? 40}%</div>
<div class="legend-item"><div class="legend-dot" style="background:#86efac"></div>CSS ${breakdown?.css ?? 10}%</div>
<div class="legend-item"><div class="legend-dot" style="background:#16a34a"></div>JS ${breakdown?.javascript ?? 35}%</div>
<div class="legend-item"><div class="legend-dot" style="background:#166534"></div>Other ${breakdown?.other ?? 15}%</div>
</div>
<h2>AI Analysis & Recommendations</h2>
<div class="analysis">${analysisContent}</div>
<div class="footer">Generated by ClimaCode — ${reportDate}</div>
</body></html>`;

    return new Response(JSON.stringify({ html: reportHtml }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
