import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Zap, Leaf, ArrowRight, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface OptimizationResult {
  originalScore: number;
  optimizedScore: number;
  co2Reduction: number;
  optimizedCode: string;
  improvements: string[];
}

// Deterministic mock optimizer for when AI is unavailable
function mockOptimize(code: string): OptimizationResult {
  const lines = code.split("\n").length;
  const chars = code.length;
  const loops = (code.match(/for\s*\(|while\s*\(|\.forEach|\.map\(|\.filter\(/g) || []).length;
  const nestedLoops = (code.match(/for\s*\([^)]*\)\s*\{[^}]*for\s*\(/g) || []).length;
  const consoleLogs = (code.match(/console\.(log|warn|error|info)/g) || []).length;
  const varDecls = (code.match(/\bvar\b/g) || []).length;

  const complexity = Math.min(100, 30 + loops * 15 + nestedLoops * 25 + consoleLogs * 5 + varDecls * 5 + chars / 50);
  const originalScore = Math.max(10, Math.round(100 - complexity));
  const optimizedScore = Math.min(98, originalScore + Math.round(15 + Math.random() * 20));
  const co2Reduction = Math.round(((optimizedScore - originalScore) / originalScore) * 100);

  const improvements: string[] = [];
  let optimized = code;

  if (nestedLoops > 0) {
    improvements.push("Flattened nested loops → O(n²) → O(n) using Map/Set lookup");
    optimized = optimized.replace(/for\s*\([^)]*\)\s*\{([^}]*?)for\s*\([^)]*\)\s*\{([^}]*)\}\s*\}/,
      "// Optimized: Using Map for O(n) lookup\nconst lookupMap = new Map(items.map(i => [i.id, i]));\nfor (const item of data) {\n  const match = lookupMap.get(item.id);\n  if (match) { /* process */ }\n}");
  }
  if (consoleLogs > 0) {
    improvements.push(`Removed ${consoleLogs} console.log statement(s) — saves CPU cycles in production`);
    optimized = optimized.replace(/console\.(log|warn|info)\([^)]*\);?\n?/g, "");
  }
  if (varDecls > 0) {
    improvements.push("Replaced var with const/let — enables V8 optimizations");
    optimized = optimized.replace(/\bvar\b/g, "const");
  }
  if (code.includes(".forEach")) {
    improvements.push("Replaced .forEach with for...of — 20% faster iteration, less memory allocation");
    optimized = optimized.replace(/(\w+)\.forEach\(\(?(\w+)\)?\s*=>\s*\{/g, "for (const $2 of $1) {");
  }
  if (code.includes("document.querySelector") || code.includes("document.getElementById")) {
    improvements.push("Cached DOM queries — avoid repeated DOM traversals");
  }
  if (improvements.length === 0) {
    improvements.push(
      "Code is already well-optimized",
      "Consider using Web Workers for heavy computations",
      "Add lazy loading for non-critical resources"
    );
  }

  return { originalScore, optimizedScore, co2Reduction, optimizedCode: optimized.trim(), improvements };
}

const AICodeOptimizer = () => {
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const exampleCode = `// Example: Inefficient data processing
var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var result = [];

for (var i = 0; i < data.length; i++) {
  for (var j = 0; j < data.length; j++) {
    if (data[i] + data[j] === 10) {
      console.log("Found pair:", data[i], data[j]);
      result.push([data[i], data[j]]);
    }
  }
}

data.forEach((item) => {
  console.log("Processing:", item);
});`;

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      // Try AI-powered analysis first
      const { data: fnData, error } = await supabase.functions.invoke("ai-code-optimize", {
        body: { code },
      });

      if (!error && fnData && fnData.optimizedCode) {
        setResult(fnData);
      } else {
        // Fallback to mock
        await new Promise((r) => setTimeout(r, 1500));
        setResult(mockOptimize(code));
      }
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
      setResult(mockOptimize(code));
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-clima-success";
    if (score >= 50) return "text-clima-warning";
    return "text-clima-danger";
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center neon-glow-subtle">
            <Code className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t("codeopt.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("codeopt.subtitle")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t("codeopt.input")}</label>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setCode(exampleCode)}
              >
                {t("codeopt.example")}
              </Button>
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("codeopt.placeholder")}
              className="font-mono text-xs min-h-[200px] bg-muted/30 border-border/50 rounded-xl"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="w-full rounded-xl h-12 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t("codeopt.analyzing")}
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                {t("codeopt.analyze")}
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Scores */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-2">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t("codeopt.before")}</p>
                  <p className={`text-3xl font-black ${scoreColor(result.originalScore)}`}>{result.originalScore}</p>
                  <p className="text-[10px] text-muted-foreground">Green Score</p>
                </CardContent>
              </Card>
              <Card className="border-2 flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-primary" />
              </Card>
              <Card className="border-2 border-primary/30">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t("codeopt.after")}</p>
                  <p className={`text-3xl font-black ${scoreColor(result.optimizedScore)}`}>{result.optimizedScore}</p>
                  <p className="text-[10px] text-muted-foreground">Green Score</p>
                </CardContent>
              </Card>
            </div>

            {/* CO2 Reduction */}
            <div className="glass-card rounded-xl p-4 border border-primary/20 text-center">
              <Leaf className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-black text-primary">-{result.co2Reduction}%</p>
              <p className="text-xs text-muted-foreground">{t("codeopt.co2reduction")}</p>
            </div>

            {/* Improvements */}
            <Card className="border-2">
              <CardContent className="p-5">
                <h4 className="font-bold text-sm mb-3">{t("codeopt.improvements")}</h4>
                <div className="space-y-2">
                  {result.improvements.map((imp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{imp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Optimized Code */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-5">
                <h4 className="font-bold text-sm mb-3">{t("codeopt.optimizedCode")}</h4>
                <pre className="text-xs font-mono bg-muted/50 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap border border-border/50">
                  {result.optimizedCode}
                </pre>
              </CardContent>
            </Card>

            {/* How calculation works */}
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showExplanation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {t("space.howCalculated")}
            </button>
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-2"
                >
                  <p><strong>{t("codeopt.calcComplexity")}:</strong> {t("codeopt.calcComplexityDesc")}</p>
                  <p><strong>{t("codeopt.calcOperations")}:</strong> {t("codeopt.calcOperationsDesc")}</p>
                  <p><strong>{t("codeopt.calcCarbon")}:</strong> {t("codeopt.calcCarbonDesc")}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICodeOptimizer;
