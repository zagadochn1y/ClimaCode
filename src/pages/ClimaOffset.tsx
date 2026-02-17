import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingDown, Globe2, Leaf, TreePine, Droplets, Wind, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const tips = [
  { icon: Zap, title: "Quick Win", text: "Compress images on your most-visited pages to save up to 60% in emissions." },
  { icon: Leaf, title: "Daily Habit", text: "Use dark mode — OLED screens consume 60% less energy with dark backgrounds." },
  { icon: TrendingDown, title: "Long Term", text: "Switch to green hosting providers powered by renewable energy." },
];

const ClimaOffset = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCo2: 0, scanCount: 0, treesEquiv: 0, waterSaved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      if (user) {
        const { data } = await supabase
          .from("scan_results")
          .select("co2_per_view")
          .order("created_at", { ascending: false });
        const scans = data ?? [];
        const totalCo2 = scans.reduce((acc, s) => acc + (s.co2_per_view ?? 0), 0);
        setStats({
          totalCo2: parseFloat(totalCo2.toFixed(1)),
          scanCount: scans.length,
          treesEquiv: parseFloat((totalCo2 / 21000).toFixed(3)), // ~21kg CO2 per tree/year
          waterSaved: parseFloat((totalCo2 * 0.5).toFixed(1)), // rough estimate
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  const impactData = [
    { label: "CO₂ Measured", value: `${stats.totalCo2}g`, icon: Wind, color: "text-primary" },
    { label: "Sites Scanned", value: `${stats.scanCount}`, icon: Globe2, color: "text-clima-leaf" },
    { label: "Trees Equivalent", value: `${stats.treesEquiv}`, icon: TreePine, color: "text-clima-success" },
    { label: "Water Equivalent", value: `${stats.waterSaved}L`, icon: Droplets, color: "text-blue-500" },
  ];

  const milestones = [
    { target: "1kg CO₂ measured", progress: Math.min(100, (stats.totalCo2 / 1000) * 100), icon: "🌱" },
    { target: "10 sites scanned", progress: Math.min(100, (stats.scanCount / 10) * 100), icon: "🔍" },
    { target: "50 scans completed", progress: Math.min(100, (stats.scanCount / 50) * 100), icon: "🌳" },
    { target: "100 scans completed", progress: Math.min(100, (stats.scanCount / 100) * 100), icon: "🏆" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Impact Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">ClimaOffset</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Track your contribution to measuring digital carbon emissions. Every scan helps build awareness.
          </p>
        </motion.div>

        {/* Impact cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {impactData.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-2 hover:border-primary/40 transition-colors">
                <CardContent className="p-5 text-center">
                  <item.icon className={`h-8 w-8 mx-auto mb-3 ${item.color}`} />
                  <p className="text-2xl font-black">{loading ? "..." : item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Milestones */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-6">Milestones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {milestones.map((m) => (
              <Card key={m.target} className="border-2">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{m.target}</p>
                      <p className="text-xs text-muted-foreground">{Math.round(m.progress)}% complete</p>
                    </div>
                  </div>
                  <Progress value={m.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Eco Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-6">Eco Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {tips.map((tip) => (
              <Card key={tip.title} className="border-2 border-primary/20">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <tip.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-bold text-sm mb-1">{tip.title}</p>
                  <p className="text-xs text-muted-foreground">{tip.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Global impact */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="border-2 bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 text-center relative">
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 20 }).map((_, i) => (
                  <Leaf key={i} className="absolute h-6 w-6" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `rotate(${Math.random() * 360}deg)` }} />
                ))}
              </div>
              <h3 className="text-2xl font-black mb-2 relative">Your Impact Summary</h3>
              <p className="opacity-80 mb-6 relative">Every scan contributes to understanding digital carbon</p>
              <div className="flex justify-center gap-12 relative">
                <div>
                  <p className="text-3xl font-black">{loading ? "..." : `${stats.totalCo2}g`}</p>
                  <p className="text-sm opacity-70">Total CO₂ Measured</p>
                </div>
                <div>
                  <p className="text-3xl font-black">{loading ? "..." : stats.scanCount}</p>
                  <p className="text-sm opacity-70">Scans Performed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {!user && (
          <Card className="border-2 border-primary/30 bg-accent/50 mt-10">
            <CardContent className="p-6 text-center">
              <p className="font-semibold mb-2">Sign in to track your impact</p>
              <p className="text-sm text-muted-foreground mb-4">Your scan history and impact data will be saved to your account</p>
              <Button className="rounded-full" asChild>
                <a href="/login">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ClimaOffset;
