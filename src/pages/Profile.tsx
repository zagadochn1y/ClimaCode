import { motion } from "framer-motion";
import { Mail, Calendar, Globe2, LogOut, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ScanRecord {
  id: string;
  url: string;
  country: string;
  co2_per_view: number | null;
  co2_per_year: number | null;
  sustainability_score: number | null;
  created_at: string;
}

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1️⃣ Перехват, если нет user
  if (!loading && !user) navigate("/login");

  // 2️⃣ Запрос сканов через React Query
  const { data: scans = [], isLoading: scansLoading } = useQuery(
    ["scans", user?.id],
    async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("scan_results")
        .select("id, url, country, co2_per_view, co2_per_year, sustainability_score, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
    { enabled: !!user }
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // 3️⃣ Статистика
  const totalCo2 = scans.reduce((acc, s) => acc + (s.co2_per_view ?? 0), 0);
  const avgScore =
    scans.length > 0
      ? (scans.reduce((acc, s) => acc + (s.sustainability_score ?? 0), 0) / scans.length).toFixed(2)
      : "—";

  const scoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 0.7) return "text-clima-success";
    if (score >= 0.4) return "text-clima-warning";
    return "text-clima-danger";
  };

  // 4️⃣ Достижения
  const profileAchievements = [
    { title: "First Scan", icon: "🔍", description: "Complete your first scan", earned: scans.length >= 1 },
    { title: "Carbon Tracker", icon: "🌱", description: "Complete 5 scans", earned: scans.length >= 5 },
    { title: "Green Champion", icon: "🏆", description: "Achieve avg score ≥ 0.7", earned: scans.length > 0 && parseFloat(avgScore) >= 0.7 },
    { title: "Eco Explorer", icon: "🌍", description: "Scan 10+ different sites", earned: new Set(scans.map(s => s.url)).size >= 10 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <Card className="border-2 mb-8">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-black mb-1">My Profile</h1>
                <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user.email}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                  queryClient.clear(); // очистка кэша после выхода
                }}
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="border-2">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-black text-primary">{scans.length}</p>
                <p className="text-xs text-muted-foreground">Total Scans</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-black">{totalCo2.toFixed(1)}g</p>
                <p className="text-xs text-muted-foreground">Total CO₂ Measured</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-black text-clima-success">{avgScore}</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" /> Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {profileAchievements.map((ach, i) => (
              <motion.div key={ach.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                <Card className={`border-2 text-center ${ach.earned ? "border-primary/50" : "opacity-50"}`}>
                  <CardContent className="p-4">
                    <p className="text-3xl mb-2">{ach.icon}</p>
                    <p className="font-bold text-xs">{ach.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{ach.description}</p>
                    {ach.earned && <Badge className="mt-2 bg-clima-success text-white text-[10px]">Earned ✓</Badge>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Scan history */}
          <h2 className="text-xl font-bold mb-4">Scan History</h2>
          {scansLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : scans.length === 0 ? (
            <Card className="border-2">
              <CardContent className="p-8 text-center">
                <Globe2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-semibold mb-2">No scans yet</p>
                <p className="text-sm text-muted-foreground mb-4">Start scanning websites to see your history here</p>
                <Button className="rounded-full" asChild><a href="/climascan">Start Scanning</a></Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {scans.map((scan, i) => (
                <motion.div key={scan.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border hover:border-primary/40 transition-colors">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                        <Globe2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{scan.url}</p>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{scan.country}</span>
                          <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold">{scan.co2_per_view ?? "—"}g</p>
                          <p className="text-[10px] text-muted-foreground">per view</p>
                        </div>
                        <Badge variant="outline" className={`font-bold ${scoreColor(scan.sustainability_score)}`}>
                          {scan.sustainability_score ?? "—"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
