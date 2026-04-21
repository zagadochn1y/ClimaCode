import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Award, TrendingUp, Users, Globe2, Zap, Shield, Star, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KazakhstanMap from "@/components/KazakhstanMap";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const cities = [
  "Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Атырау",
  "Павлодар", "Костанай", "Семей", "Туркестан", "Мангистау", "Жамбыл",
  "Западный Казахстан", "Северный Казахстан", "Восточный Казахстан", "Кызылорда", "Акмола",
  "Улытау", "Жетісу"
];

const cityToRegion: Record<string, string> = {
  "Алматы": "almaty", "Астана": "astana", "Шымкент": "shymkent", "Караганда": "karaganda",
  "Актобе": "aktobe", "Атырау": "atyrau", "Павлодар": "pavlodar", "Костанай": "kostanay",
  "Семей": "semey", "Туркестан": "turkestan", "Мангистау": "mangystau", "Жамбыл": "zhambyl",
  "Западный Казахстан": "wko", "Северный Казахстан": "nko", "Восточный Казахстан": "eko",
  "Кызылорда": "kyzylorda", "Акмола": "akmola", "Улытау": "ulytau", "Жетісу": "jetisu"
};

interface DevScore {
  user_id: string;
  city: string;
  carbon_score: number;
  total_co2_saved: number;
  total_co2_measured: number;
  optimized_sites: number;
  badges: string[];
  scans_count: number;
  username?: string;
  avatar_url?: string;
}

const badgeConfig: Record<string, { icon: typeof Star; label: Record<string, string>; color: string }> = {
  eco_starter: { icon: Zap, label: { en: "Eco Starter", ru: "Эко Старт", kk: "Эко Старт" }, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  green_dev: { icon: Shield, label: { en: "Green Dev", ru: "Зелёный Dev", kk: "Жасыл Dev" }, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  carbon_pro: { icon: Award, label: { en: "Carbon Pro", ru: "Carbon Pro", kk: "Carbon Pro" }, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
};

export default function CarbonRanking() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [allScores, setAllScores] = useState<DevScore[]>([]);
  const [myScore, setMyScore] = useState<DevScore | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all scores with profiles
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: scores } = await supabase.from("developer_scores").select("*");
      if (!scores) { setLoading(false); return; }

      // Get profiles for usernames
      const userIds = scores.map(s => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, username, avatar_url").in("user_id", userIds);
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) ?? []);

      const enriched = scores.map(s => ({
        ...s,
        username: profileMap.get(s.user_id)?.username ?? undefined,
        avatar_url: profileMap.get(s.user_id)?.avatar_url ?? undefined,
      }));

      setAllScores(enriched);
      if (user) {
        const mine = enriched.find(s => s.user_id === user.id);
        setMyScore(mine ?? null);
      }
      setLoading(false);
    }
    load();

    // Realtime subscription
    const channel = supabase
      .channel("ranking-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "developer_scores" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Ensure user has a score entry
  useEffect(() => {
    if (!user || myScore) return;
    // Create entry from scan_results
    async function init() {
      const { data: scans } = await supabase.from("scan_results").select("*").eq("user_id", user!.id);
      if (!scans) return;
      const totalCo2 = scans.reduce((s, r) => s + (Number(r.co2_per_view) || 0), 0);
      const avgScore = scans.length > 0 ? scans.reduce((s, r) => s + (Number(r.sustainability_score) || 0), 0) / scans.length : 0.5;
      const carbonScore = Math.round(avgScore * 100);
      const badges: string[] = [];
      if (scans.length >= 1) badges.push("eco_starter");
      if (scans.length >= 5) badges.push("green_dev");
      if (carbonScore >= 70) badges.push("carbon_pro");

      await supabase.from("developer_scores").upsert({
        user_id: user!.id,
        carbon_score: carbonScore,
        total_co2_measured: totalCo2,
        total_co2_saved: totalCo2 * 0.3,
        optimized_sites: scans.length,
        scans_count: scans.length,
        badges,
      }, { onConflict: "user_id" });
    }
    init();
  }, [user, myScore]);

  // Derived data
  const filtered = useMemo(() => {
    let list = [...allScores];
    if (selectedCity !== "all") list = list.filter(s => s.city === selectedCity);
    if (selectedRegion) {
      const regionCities = Object.entries(cityToRegion).filter(([, v]) => v === selectedRegion).map(([k]) => k);
      list = list.filter(s => regionCities.includes(s.city));
    }
    return list.sort((a, b) => b.carbon_score - a.carbon_score);
  }, [allScores, selectedCity, selectedRegion]);

  const nationalStats = useMemo(() => {
    const total = allScores.reduce((s, d) => s + d.total_co2_saved, 0);
    const sites = allScores.reduce((s, d) => s + d.optimized_sites, 0);
    const avg = allScores.length > 0 ? allScores.reduce((s, d) => s + d.carbon_score, 0) / allScores.length : 0;
    return { totalCo2Saved: total, totalSites: sites, avgScore: avg, devCount: allScores.length };
  }, [allScores]);

  const mapData = useMemo(() => {
    const map: Record<string, { co2Saved: number; sitesOptimized: number; devCount: number }> = {};
    for (const s of allScores) {
      const region = cityToRegion[s.city] ?? "almaty";
      if (!map[region]) map[region] = { co2Saved: 0, sitesOptimized: 0, devCount: 0 };
      map[region].co2Saved += s.total_co2_saved;
      map[region].sitesOptimized += s.optimized_sites;
      map[region].devCount += 1;
    }
    return map;
  }, [allScores]);

  const tr = {
    title: { en: "Carbon Ranking Kazakhstan", ru: "Carbon Ranking Казахстан", kk: "Carbon Ranking Қазақстан" },
    subtitle: { en: "Developer sustainability leaderboard & digital carbon map", ru: "Лидерборд устойчивости разработчиков и карта цифрового углерода", kk: "Әзірлеушілердің тұрақтылық лидерборды және цифрлық көміртегі картасы" },
    nationalCounter: { en: "CO₂ Saved Nationally", ru: "CO₂ сохранено по стране", kk: "Елде сақталған CO₂" },
    sustainIndex: { en: "Digital Sustainability Index", ru: "Индекс цифровой устойчивости", kk: "Цифрлық тұрақтылық индексі" },
    devs: { en: "Developers", ru: "Разработчиков", kk: "Әзірлеушілер" },
    sites: { en: "Sites Optimized", ru: "Оптимизировано сайтов", kk: "Оңтайландырылған сайттар" },
    leaderboard: { en: "Leaderboard", ru: "Лидерборд", kk: "Лидерборд" },
    map: { en: "Kazakhstan Map", ru: "Карта Казахстана", kk: "Қазақстан картасы" },
    myScore: { en: "My Score", ru: "Мой рейтинг", kk: "Менің рейтингім" },
    allCities: { en: "All Cities", ru: "Все города", kk: "Барлық қалалар" },
    rank: { en: "Rank", ru: "Место", kk: "Орын" },
    developer: { en: "Developer", ru: "Разработчик", kk: "Әзірлеуші" },
    score: { en: "Score", ru: "Балл", kk: "Балл" },
    co2saved: { en: "CO₂ Saved", ru: "CO₂ сохранено", kk: "CO₂ сақталды" },
    badges: { en: "Badges", ru: "Бейджи", kk: "Бейджіктер" },
    setCity: { en: "Select your city to join the ranking", ru: "Выберите город для участия в рейтинге", kk: "Рейтингке қатысу үшін қалаңызды таңдаңыз" },
    loginToJoin: { en: "Sign in to join the ranking", ru: "Войдите для участия в рейтинге", kk: "Рейтингке қатысу үшін кіріңіз" },
    update: { en: "Update City", ru: "Обновить город", kk: "Қаланы жаңарту" },
    improvement: { en: "improvement", ru: "улучшение", kk: "жақсарту" },
    noData: { en: "No developers yet. Be the first!", ru: "Пока нет разработчиков. Будьте первым!", kk: "Әзірлеушілер жоқ. Бірінші болыңыз!" },
  };

  const tl = (key: keyof typeof tr) => tr[key][language] ?? tr[key].en;

  const handleCityUpdate = async (city: string) => {
    if (!user) return;
    await supabase.from("developer_scores").update({ city, region: city }).eq("user_id", user.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Counter */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-12 overflow-hidden">
        <div className="container text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary text-sm px-4 py-1">
              🇰🇿 {tl("title")}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black mb-3">{tl("title")}</h1>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">{tl("subtitle")}</p>
          </motion.div>

          {/* National stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Globe2, value: `${nationalStats.totalCo2Saved.toFixed(1)}g`, label: tl("nationalCounter") },
              { icon: TrendingUp, value: `${nationalStats.avgScore.toFixed(0)}/100`, label: tl("sustainIndex") },
              { icon: Users, value: `${nationalStats.devCount}`, label: tl("devs") },
              { icon: Zap, value: `${nationalStats.totalSites}`, label: tl("sites") },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <Card className="border-primary/20">
                  <CardContent className="py-4 px-3 text-center">
                    <s.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-xl md:text-2xl font-black text-primary">{s.value}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* My Score Card */}
      {user && myScore && (
        <section className="container -mt-2 mb-6">
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="py-6 flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <svg viewBox="0 0 120 120" className="w-28 h-28">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <motion.circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - myScore.carbon_score / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    transform="rotate(-90 60 60)"
                  />
                  <text x="60" y="55" textAnchor="middle" className="text-2xl font-black fill-foreground">{myScore.carbon_score}</text>
                  <text x="60" y="72" textAnchor="middle" className="text-[10px] fill-muted-foreground">/100</text>
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold mb-1">{tl("myScore")}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {myScore.city} • {myScore.scans_count} scans • {myScore.total_co2_saved.toFixed(1)}g CO₂ {language === "ru" ? "сохранено" : "saved"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {myScore.badges.map(b => {
                    const cfg = badgeConfig[b];
                    if (!cfg) return null;
                    const Icon = cfg.icon;
                    return (
                      <Badge key={b} variant="outline" className={cfg.color}>
                        <Icon className="h-3 w-3 mr-1" /> {cfg.label[language] ?? cfg.label.en}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[180px]">
                <Select onValueChange={handleCityUpdate} defaultValue={myScore.city}>
                  <SelectTrigger className="h-9">
                    <MapPin className="h-3 w-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Not logged in prompt */}
      {!user && (
        <section className="container mb-6">
          <Card className="border-dashed border-primary/30">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">{tl("loginToJoin")}</p>
              <Link to="/login"><Button className="rounded-full px-8">{t("nav.login")}</Button></Link>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Tabs: Leaderboard + Map */}
      <section className="container pb-16">
        <Tabs defaultValue="leaderboard">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="leaderboard"><Trophy className="h-4 w-4 mr-2" />{tl("leaderboard")}</TabsTrigger>
            <TabsTrigger value="map"><Globe2 className="h-4 w-4 mr-2" />{tl("map")}</TabsTrigger>
          </TabsList>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <div className="flex justify-end mb-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue placeholder={tl("allCities")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tl("allCities")}</SelectItem>
                  {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">{tl("noData")}</CardContent></Card>
            ) : (
              <div className="space-y-2">
                {filtered.map((dev, i) => {
                  const rankIcon = i === 0 ? <Trophy className="h-5 w-5 text-yellow-500" /> : i === 1 ? <Medal className="h-5 w-5 text-gray-400" /> : i === 2 ? <Medal className="h-5 w-5 text-amber-600" /> : null;
                  const isMe = user?.id === dev.user_id;

                  return (
                    <motion.div key={dev.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <Card className={`transition-colors ${isMe ? "border-primary/50 bg-primary/5" : "hover:border-primary/20"}`}>
                        <CardContent className="py-3 px-4 flex items-center gap-4">
                          {/* Rank */}
                          <div className="w-10 text-center font-black text-lg text-muted-foreground">
                            {rankIcon ?? `#${i + 1}`}
                          </div>

                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0 overflow-hidden">
                            {dev.avatar_url ? (
                              <img src={dev.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (dev.username ?? "U")[0].toUpperCase()
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {dev.username ?? `dev_${dev.user_id.slice(0, 6)}`}
                              {isMe && <span className="text-primary ml-2 text-xs">(you)</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">{dev.city}</p>
                          </div>

                          {/* Badges */}
                          <div className="hidden md:flex gap-1">
                            {dev.badges.slice(0, 3).map(b => {
                              const cfg = badgeConfig[b];
                              if (!cfg) return null;
                              const Icon = cfg.icon;
                              return <Badge key={b} variant="outline" className={`${cfg.color} text-[10px] py-0`}><Icon className="h-3 w-3" /></Badge>;
                            })}
                          </div>

                          {/* Score */}
                          <div className="text-right">
                            <p className="text-xl font-black text-primary">{dev.carbon_score}</p>
                            <p className="text-[10px] text-muted-foreground">{dev.total_co2_saved.toFixed(1)}g saved</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Map */}
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">{tl("map")}</CardTitle>
              </CardHeader>
              <CardContent>
                <KazakhstanMap
                  data={mapData}
                  lang={language}
                  onRegionClick={(regionId) => {
                    setSelectedRegion(regionId);
                    // Find city for this region and filter leaderboard
                    const city = Object.entries(cityToRegion).find(([, v]) => v === regionId)?.[0];
                    if (city) setSelectedCity(city);
                  }}
                />
                {selectedRegion && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                    <h3 className="font-bold text-center mb-3">
                      {language === "ru" ? "Топ разработчиков региона" : language === "kk" ? "Аймақтың үздік әзірлеушілері" : "Top Regional Developers"}
                    </h3>
                    <div className="space-y-2">
                      {filtered.slice(0, 5).map((dev, i) => (
                        <div key={dev.user_id} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50">
                          <span className="font-bold text-primary w-6">#{i + 1}</span>
                          <span className="flex-1 text-sm font-medium">{dev.username ?? `dev_${dev.user_id.slice(0, 6)}`}</span>
                          <span className="text-sm font-black text-primary">{dev.carbon_score}</span>
                        </div>
                      ))}
                      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">{tl("noData")}</p>}
                    </div>
                    <div className="text-center mt-4">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedRegion(null); setSelectedCity("all"); }}>
                        {language === "ru" ? "Сбросить фильтр" : language === "kk" ? "Сүзгіні тастау" : "Reset filter"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}
