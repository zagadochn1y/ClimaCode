import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Satellite, Radio, Zap, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface SpaceImpactProps {
  bytes: number;
  co2PerView: number;
}

const ENERGY_PER_GB = 0.06; // kWh per GB (network + data center)
const SATELLITE_OVERHEAD = 1.3; // satellite relay adds ~30% energy

const SpaceImpact = ({ bytes, co2PerView }: SpaceImpactProps) => {
  const { t } = useLanguage();
  const [optimized, setOptimized] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({ data: 0, energy: 0, co2: 0 });

  const dataGB = bytes / (1024 * 1024 * 1024);
  const dataMB = bytes / (1024 * 1024);

  const rawData = dataMB;
  const rawEnergy = dataGB * ENERGY_PER_GB * SATELLITE_OVERHEAD * 1000; // Wh
  const rawCo2 = co2PerView * SATELLITE_OVERHEAD;

  const optFactor = 0.35;
  const targetData = optimized ? rawData * optFactor : rawData;
  const targetEnergy = optimized ? rawEnergy * optFactor : rawEnergy;
  const targetCo2 = optimized ? rawCo2 * optFactor : rawCo2;

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;
    const startData = animatedValues.data;
    const startEnergy = animatedValues.energy;
    const startCo2 = animatedValues.co2;

    const timer = setInterval(() => {
      step++;
      const t = step / steps;
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setAnimatedValues({
        data: startData + (targetData - startData) * ease,
        energy: startEnergy + (targetEnergy - startEnergy) * ease,
        co2: startCo2 + (targetCo2 - startCo2) * ease,
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [optimized, targetData, targetEnergy, targetCo2]);

  // Satellite positions
  const satellites = [
    { angle: 0, speed: 20, size: 24, orbit: 120 },
    { angle: 120, speed: 25, size: 20, orbit: 100 },
    { angle: 240, speed: 30, size: 18, orbit: 140 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8"
    >
      <div className="glass-card rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center neon-glow-subtle">
            <Satellite className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t("space.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("space.subtitle")}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Satellite Visualization */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-72 h-72">
              {/* Earth */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-24 h-24 rounded-full relative overflow-hidden"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, hsl(200, 80%, 60%), hsl(142, 64%, 36%) 60%, hsl(142, 70%, 18%))",
                    boxShadow: "0 0 30px rgba(34,197,94,0.3), inset -8px -8px 20px rgba(0,0,0,0.2)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-[25%] left-[20%] w-[35%] h-[20%] rounded-[40%] bg-primary/50 rotate-12" />
                  <div className="absolute top-[45%] left-[50%] w-[25%] h-[25%] rounded-[35%] bg-primary/40" />
                </motion.div>
              </div>

              {/* Orbit rings */}
              {satellites.map((sat, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="rounded-full border border-primary/10"
                    style={{ width: sat.orbit * 2, height: sat.orbit * 2 }}
                  />
                </div>
              ))}

              {/* Satellites */}
              {satellites.map((sat, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: sat.size,
                    height: sat.size,
                    marginTop: -sat.size / 2,
                    marginLeft: -sat.size / 2,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: sat.speed,
                    repeat: Infinity,
                    ease: "linear",
                    delay: (sat.angle / 360) * sat.speed,
                  }}
                >
                  <motion.div
                    style={{
                      position: "absolute",
                      top: -sat.orbit,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="relative">
                      <Satellite
                        className="text-primary drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                        style={{ width: sat.size, height: sat.size }}
                      />
                      {/* Data transmission line */}
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2"
                        style={{
                          width: optimized ? 1 : 2,
                          height: sat.orbit - 48,
                          background: `linear-gradient(to bottom, hsl(var(--primary) / ${optimized ? 0.3 : 0.6}), transparent)`,
                        }}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Pulse rings from Earth */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`pulse-${i}`}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0.3, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1,
                    ease: "easeOut",
                  }}
                >
                  <div className="w-24 h-24 rounded-full border border-primary/30" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Data Panel */}
          <div className="flex-1 space-y-4">
            {/* Mode Toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <span className={`text-sm font-medium ${!optimized ? "text-primary" : "text-muted-foreground"}`}>
                {t("space.raw")}
              </span>
              <button
                onClick={() => setOptimized(!optimized)}
                className="relative w-14 h-7 rounded-full bg-border transition-colors"
                style={{ backgroundColor: optimized ? "hsl(var(--primary))" : "hsl(var(--border))" }}
              >
                <motion.div
                  className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                  animate={{ left: optimized ? 32 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium ${optimized ? "text-primary" : "text-muted-foreground"}`}>
                {t("space.optimized")}
              </span>
            </div>

            {/* Metrics */}
            {[
              { label: t("space.dataTransmitted"), value: animatedValues.data.toFixed(3), unit: "MB", icon: Radio },
              { label: t("space.energyUsage"), value: animatedValues.energy.toFixed(4), unit: "Wh", icon: Zap },
              { label: t("space.co2emissions"), value: animatedValues.co2.toFixed(3), unit: "g CO₂", icon: Satellite },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                className="p-4 rounded-xl bg-muted/30 border border-border/50"
                animate={{ borderColor: optimized ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border) / 0.5)" }}
              >
                <div className="flex items-center gap-3">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground flex-1">{metric.label}</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black tabular-nums">{metric.value}</span>
                  <span className="text-xs text-muted-foreground">{metric.unit}</span>
                </div>
              </motion.div>
            ))}

            {optimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center"
              >
                <p className="text-sm font-semibold text-primary">
                  🌱 {t("space.saved")} {((1 - optFactor) * 100).toFixed(0)}% CO₂
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* How this is calculated */}
        <div className="mt-6">
          <button
            onClick={() => setShowCalc(!showCalc)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCalc ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {t("space.howCalculated")}
          </button>
          <AnimatePresence>
            {showCalc && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-2"
              >
                <p><strong>{t("space.calc1Title")}:</strong> {t("space.calc1Desc")}</p>
                <p><strong>{t("space.calc2Title")}:</strong> {t("space.calc2Desc")}</p>
                <p><strong>{t("space.calc3Title")}:</strong> {t("space.calc3Desc")}</p>
                <p className="text-[10px] opacity-70">{t("space.calcNote")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SpaceImpact;
