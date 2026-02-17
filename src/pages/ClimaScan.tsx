import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { z } from "zod";

const urlSchema = z.string().trim().url("Please enter a valid URL (e.g. https://example.com)");

const countries = [
  "United States", "Germany", "United Kingdom", "France", "Netherlands",
  "Singapore", "Japan", "Australia", "Canada", "Kazakhstan", "India", "Brazil",
];

interface ScanResult { 
  co2PerView: number;
  co2PerYear: number;
  sustainabilityScore: number;
  breakdown: { images: number; css: number; javascript: number; other: number };
  recommendations: string[];
}

const ClimaScan = () => {
  const [url, setUrl] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [certLoading, setCertLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [urlError, setUrlError] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleScan = async () => {
    if (!country) return;
    const urlResult = urlSchema.safeParse(url);
    if (!urlResult.success) {
      setUrlError(urlResult.error.errors[0].message);
      return;
    }
    setUrlError("");
    setLoading(true);
    setResult(null);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/climascan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ url, country }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Scan failed");
      }

      const data = await resp.json();
      setResult(data);

      if (user) {
        await supabase.from("scan_results").insert({
          user_id: user.id,
          url,
          country,
          co2_per_view: data.co2PerView,
          co2_per_year: data.co2PerYear,
          sustainability_score: data.sustainabilityScore,
          breakdown: data.breakdown,
          recommendations: data.recommendations,
        });
      }
    } catch (e: any) {
      toast({ title: "Scan error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openHtmlInNewTab = (html: string, filename: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setReportLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ type: "report", url, ...result }),
      });

      if (!resp.ok) throw new Error("Failed to generate report");
      const data = await resp.json();
      openHtmlInNewTab(data.html, `climacode-report-${new Date().toISOString().slice(0, 10)}.html`);
    } catch (e: any) {
      toast({ title: "Report error", description: e.message, variant: "destructive" });
    } finally {
      setReportLoading(false);
    }
  };

  const handleCertificate = async () => {
    if (!result) return;
    setCertLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ type: "certificate", url, ...result }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Failed to generate certificate");
      }
      const data = await resp.json();
      openHtmlInNewTab(data.html, `climacode-certificate-${new Date().toISOString().slice(0, 10)}.html`);
    } catch (e: any) {
      toast({ title: "Certificate error", description: e.message, variant: "destructive" });
    } finally {
      setCertLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 0.8) return "text-clima-success";
    if (score >= 0.5) return "text-clima-warning";
    return "text-clima-danger";
  };

  const canGetCertificate = result && result.sustainabilityScore >= 0.7;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            ClimaScan — site audit<br />& CO₂ calculator
          </h1>
          <p className="text-muted-foreground">
            Enter a website URL to run a full audit. You'll get CO₂ per visit, year and your sustainable score.
          </p>
        </motion.div>

        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
              className={`rounded-xl border-2 h-12 ${urlError ? "border-destructive" : "border-border"}`}
            />
            {urlError && <p className="text-destructive text-xs mt-1">{urlError}</p>}
          </div>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl border-2 border-border h-12">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center mb-12">
          <Button
            onClick={handleScan}
            disabled={loading || !url || !country}
            size="lg"
            className="rounded-full px-10 text-base font-semibold"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Start Scanning
          </Button>
        </div>

        
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-12"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-accent" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <p className="text-muted-foreground font-medium">Analyzing website...</p>
            </motion.div>
          )}
        </AnimatePresence>

        
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-3xl font-black">{result.co2PerView} g</p>
                        <p className="text-sm text-muted-foreground font-medium">per view</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black">{result.co2PerYear} kg</p>
                        <p className="text-sm text-muted-foreground font-medium">per year</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6">
                    <p className={`text-4xl font-black ${scoreColor(result.sustainabilityScore)}`}>
                      {result.sustainabilityScore}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium mb-4">Sustainability Score</p>
                    <div className="space-y-3">
                      {result.recommendations.slice(0, 2).map((rec, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${i === 0 ? "bg-clima-danger" : "bg-clima-warning"}`} />
                          <div>
                            <p className="text-sm font-semibold">{rec.split(" — ")[0]}</p>
                            <p className="text-xs text-muted-foreground">{rec.split(" — ")[1]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">Breakdown</h3>
                  <div className="w-full h-6 rounded-full overflow-hidden flex">
                    <div className="bg-clima-success h-full" style={{ width: `${result.breakdown.images}%` }} />
                    <div className="bg-clima-leaf h-full" style={{ width: `${result.breakdown.css}%` }} />
                    <div className="bg-primary h-full" style={{ width: `${result.breakdown.javascript}%` }} />
                    <div className="bg-clima-green-dark h-full" style={{ width: `${result.breakdown.other}%` }} />
                  </div>
                  <div className="flex gap-6 mt-3 flex-wrap">
                    {[
                      { label: "Images", color: "bg-clima-success" },
                      { label: "CSS", color: "bg-clima-leaf" },
                      { label: "JavaScript", color: "bg-primary" },
                      { label: "Other", color: "bg-clima-green-dark" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">AI Recommendations</h3>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0 bg-primary" />
                        <div>
                          <p className="text-sm font-semibold">{rec.split(" — ")[0]}</p>
                          <p className="text-xs text-muted-foreground">{rec.split(" — ")[1]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  className="rounded-full px-8"
                  onClick={handleDownloadPDF}
                  disabled={reportLoading}
                >
                  {reportLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download Report
                </Button>
                <Button
                  size="lg"
                  variant={canGetCertificate ? "default" : "outline"}
                  disabled={!canGetCertificate || certLoading}
                  className="rounded-full px-8"
                  onClick={handleCertificate}
                >
                  {certLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                  Get Green Certificate
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default ClimaScan;
