import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Lightbulb, Leaf, Search, FileText, Award, Globe2, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobeComponent from "@/components/Globe";
import { useLanguage } from "@/contexts/LanguageContext";

const team = [
  { name: "Maidankhan Adilet", role: "cofounder", photo: "" },
  { name: "Maidan Adiya", role: "cofounder", photo: "" },
];

const Index = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Leaf, title: t("why.tracking.title"), description: t("why.tracking.desc") },
    { icon: BarChart3, title: t("why.insights.title"), description: t("why.insights.desc") },
    { icon: Lightbulb, title: t("why.tips.title"), description: t("why.tips.desc") },
  ];

  const howItWorks = [
    { step: "01", icon: Search, title: t("how.step1.title"), description: t("how.step1.desc") },
    { step: "02", icon: Zap, title: t("how.step2.title"), description: t("how.step2.desc") },
    { step: "03", icon: FileText, title: t("how.step3.title"), description: t("how.step3.desc") },
    { step: "04", icon: Award, title: t("how.step4.title"), description: t("how.step4.desc") },
  ];

  const stats = [
    { value: "4.5B+", label: t("stats.tons") },
    { value: "~0.5g", label: t("stats.avg") },
    { value: "2%", label: t("stats.global") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4" dangerouslySetInnerHTML={{
              __html: t("hero.title").replace(/<span>/g, '<span class="text-gradient-green">').replace(/<\/span>/g, '</span>')
            }} />
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">{t("hero.subtitle")}</p>
            <div className="flex gap-3">
              <Link to="/climascan">
                <Button size="lg" className="rounded-full px-8 text-base font-semibold">
                  {t("hero.start")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base font-semibold"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
                {t("hero.learn")}
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex-shrink-0">
            <GlobeComponent />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <p className="text-4xl md:text-5xl font-black mb-2">{stat.value}</p>
                <p className="text-sm opacity-80 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t("why.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
              <Card className="text-center h-full border-2 border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
                    <f.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">{t("how.title")}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">{t("how.subtitle")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} viewport={{ once: true }}>
                <Card className="h-full border-2 border-border hover:border-primary/40 transition-colors relative overflow-hidden">
                  <CardContent className="pt-8 pb-6 px-6">
                    <span className="absolute top-3 right-4 text-5xl font-black text-primary/10">{item.step}</span>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-4">{t("tools.title")}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">{t("tools.subtitle")}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Globe2, title: "ClimaScan", description: t("tools.climascan.desc"), link: "/climascan" },
            { icon: Lightbulb, title: "EcoDev School", description: t("tools.ecodev.desc"), link: "/ecodev" },
            { icon: BarChart3, title: "ClimaOffset", description: t("tools.offset.desc"), link: "/offset" },
          ].map((product, i) => (
            <motion.div key={product.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
              <Card className="h-full border-2 transition-colors border-primary/30 hover:border-primary">
                <CardContent className="pt-8 pb-6 px-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <product.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1 mb-4">{product.description}</p>
                  <Link to={product.link}>
                    <Button variant="outline" className="rounded-full w-full">
                      {t("tools.try")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">{t("cta.title")}</h2>
            <p className="text-lg opacity-90 mb-8 max-w-lg mx-auto">{t("cta.subtitle")}</p>
            <Link to="/climascan">
              <Button size="lg" variant="secondary" className="rounded-full px-10 text-base font-semibold">
                {t("cta.button")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-4">{t("about.title")}</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">{t("about.desc")}</p>
        <div className="flex flex-wrap justify-center gap-8">
          {team.map((member) => (
            <Card key={member.name} className="w-56 overflow-hidden border-2 border-primary/30">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center text-2xl font-bold text-primary">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-xs text-muted-foreground">{t("about.photo")}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 text-center bg-primary text-primary-foreground">
                <p className="font-bold">{member.name}</p>
                <p className="text-sm opacity-90">{t("about.cofounder")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
