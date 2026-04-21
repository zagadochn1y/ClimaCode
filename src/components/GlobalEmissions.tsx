import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Globe2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

// Mercator projection
const project = (lon: number, lat: number, w: number, h: number): [number, number] => {
  const x = ((lon + 180) / 360) * w;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = h / 2 - (w * mercN) / (2 * Math.PI);
  return [x, y];
};

const coordsToPath = (coords: number[][][], w: number, h: number): string => {
  return coords
    .map((ring) => {
      const pts = ring.map(([lon, lat]) => project(lon, lat, w, h));
      return "M" + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L") + "Z";
    })
    .join("");
};

const geoToPath = (geometry: any, w: number, h: number): string => {
  if (geometry.type === "Polygon") {
    return coordsToPath(geometry.coordinates, w, h);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map((poly: any) => coordsToPath(poly, w, h)).join("");
  }
  return "";
};

// Emission data per country (sample — top emitters + others)
const emissionData: Record<string, { co2: number; traffic: number }> = {
  USA: { co2: 1400, traffic: 950 },
  CHN: { co2: 2100, traffic: 1300 },
  IND: { co2: 700, traffic: 480 },
  RUS: { co2: 500, traffic: 320 },
  JPN: { co2: 350, traffic: 410 },
  DEU: { co2: 220, traffic: 280 },
  GBR: { co2: 180, traffic: 250 },
  BRA: { co2: 150, traffic: 190 },
  KOR: { co2: 190, traffic: 300 },
  CAN: { co2: 160, traffic: 200 },
  AUS: { co2: 140, traffic: 170 },
  FRA: { co2: 130, traffic: 210 },
  IDN: { co2: 200, traffic: 150 },
  MEX: { co2: 120, traffic: 130 },
  SAU: { co2: 170, traffic: 110 },
  ZAF: { co2: 130, traffic: 90 },
  NGA: { co2: 60, traffic: 40 },
  EGY: { co2: 70, traffic: 50 },
  KAZ: { co2: 90, traffic: 60 },
  TUR: { co2: 140, traffic: 160 },
};

const getColor = (iso: string, isHovered: boolean): string => {
  const d = emissionData[iso];
  if (isHovered) return "hsl(var(--primary) / 0.7)";
  if (!d) return "hsl(var(--muted) / 0.6)";
  const co2 = d.co2;
  if (co2 > 1000) return "hsl(0, 65%, 50%)";
  if (co2 > 500) return "hsl(15, 70%, 50%)";
  if (co2 > 200) return "hsl(35, 75%, 50%)";
  if (co2 > 100) return "hsl(55, 70%, 50%)";
  return "hsl(120, 45%, 45%)";
};

interface Feature {
  properties: { name: string; iso: string; continent: string; pop: number };
  geometry: any;
}

const MAP_W = 960;
const MAP_H = 500;

const GlobalEmissions = () => {
  const { t } = useLanguage();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ name: string; iso: string; x: number; y: number } | null>(null);
  const [liveCounter, setLiveCounter] = useState(4_523_891_000);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleZoom = (delta: number) => setZoom(z => Math.max(0.5, Math.min(5, z + delta)));
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const onPanStart = (e: React.MouseEvent) => { setIsPanning(true); panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }; };
  const onPanMove = (e: React.MouseEvent) => { if (!isPanning) return; setPan({ x: panStart.current.panX + (e.clientX - panStart.current.x) / zoom, y: panStart.current.panY + (e.clientY - panStart.current.y) / zoom }); };
  const onPanEnd = () => setIsPanning(false);
  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); handleZoom(e.deltaY > 0 ? -0.2 : 0.2); };

  useEffect(() => {
    fetch("/world-110m.geojson")
      .then((r) => r.json())
      .then((data) => setFeatures(data.features))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter((prev) => prev + Math.floor(Math.random() * 50 + 20));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const paths = useMemo(() => {
    return features.map((f) => ({
      iso: f.properties.iso,
      name: f.properties.name,
      d: geoToPath(f.geometry, MAP_W, MAP_H),
    }));
  }, [features]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, name: string, iso: string) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipData({
        name,
        iso,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const emission = tooltipData ? emissionData[tooltipData.iso] : null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-primary/20">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">{t("global.live")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">{t("global.title")}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("global.subtitle")}</p>
        </motion.div>

        {/* Live Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 mb-10 text-center border border-primary/20 max-w-2xl mx-auto"
        >
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{t("global.counter")}</p>
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-primary animate-pulse" />
            <p className="text-4xl md:text-5xl font-black tabular-nums text-gradient-green">
              {liveCounter.toLocaleString("en-US")}
            </p>
            <span className="text-lg text-muted-foreground">kg CO₂</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{t("global.counterNote")}</p>
        </motion.div>

        {/* Real World Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          ref={containerRef}
          className="glass-card rounded-2xl p-4 md:p-6 border border-border/50 relative overflow-hidden"
        >
          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm" onClick={() => handleZoom(0.3)}><ZoomIn className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm" onClick={() => handleZoom(-0.3)}><ZoomOut className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm" onClick={resetView}><RotateCcw className="h-3.5 w-3.5" /></Button>
          </div>

          {features.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
            onMouseDown={onPanStart}
            onMouseMove={onPanMove}
            onMouseUp={onPanEnd}
            onMouseLeave={() => { onPanEnd(); setHovered(null); setTooltipData(null); }}
            onWheel={onWheel}
          >
            <svg
              viewBox={`0 60 ${MAP_W} ${MAP_H - 120}`}
              className="w-full h-auto"
              style={{
                maxHeight: "60vh",
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: "center center",
                transition: isPanning ? "none" : "transform 0.2s ease-out",
              }}
            >
              {/* Ocean background */}
              <rect x="0" y="60" width={MAP_W} height={MAP_H - 120} fill="hsl(var(--muted) / 0.15)" rx="8" />

              {/* Graticule */}
              {[-60, -30, 0, 30, 60].map((lat) => {
                const [, y] = project(0, lat, MAP_W, MAP_H);
                return (
                  <line
                    key={`lat-${lat}`}
                    x1="0" y1={y} x2={MAP_W} y2={y}
                    stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.4"
                    strokeDasharray="4 4"
                  />
                );
              })}
              {[-120, -60, 0, 60, 120].map((lon) => {
                const [x] = project(lon, 0, MAP_W, MAP_H);
                return (
                  <line
                    key={`lon-${lon}`}
                    x1={x} y1="60" x2={x} y2={MAP_H - 60}
                    stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.4"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Countries */}
              {paths.map((p) => (
                <path
                  key={p.iso + p.name}
                  d={p.d}
                  fill={getColor(p.iso, hovered === p.iso)}
                  stroke="hsl(var(--border) / 0.5)"
                  strokeWidth={hovered === p.iso ? 1.5 : 0.5}
                  className="transition-colors duration-200 cursor-pointer"
                  style={{
                    filter: hovered === p.iso ? "drop-shadow(0 0 6px hsl(var(--primary) / 0.4))" : "none",
                  }}
                  onMouseEnter={() => setHovered(p.iso)}
                  onMouseLeave={() => {
                    setHovered(null);
                    setTooltipData(null);
                  }}
                  onMouseMove={(e) => handleMouseMove(e, p.name, p.iso)}
                  onTouchStart={() => {
                    setHovered(p.iso);
                    setTooltipData({ name: p.name, iso: p.iso, x: 150, y: 100 });
                  }}
                />
              ))}
            </svg>
          </div>
          )}

          {/* Tooltip */}
          {tooltipData && hovered && (
            <div
              className="absolute pointer-events-none glass-card rounded-xl p-3 border border-primary/30 shadow-lg z-20 text-sm"
              style={{
                left: Math.min(tooltipData.x + 12, (containerRef.current?.clientWidth ?? 600) - 200),
                top: Math.max(tooltipData.y - 70, 10),
              }}
            >
              <p className="font-bold mb-1">{tooltipData.name}</p>
              {emission ? (
                <div className="space-y-0.5 text-xs text-muted-foreground">
                  <p>CO₂: <span className="text-foreground font-semibold">{emission.co2} Mt/year</span></p>
                  <p>{t("global.traffic")}: <span className="text-foreground font-semibold">{emission.traffic} EB/year</span></p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">{t("global.low")}</p>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 md:gap-4 mt-4 justify-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(120, 45%, 45%)" }} />
              <span>{t("global.low")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(55, 70%, 50%)" }} />
              <span>{t("global.medium")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(0, 65%, 50%)" }} />
              <span>{t("global.high")}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { icon: Globe2, label: t("global.stat1"), value: "~4.5B", unit: t("global.stat1unit") },
            { icon: Zap, label: t("global.stat2"), value: "~900", unit: t("global.stat2unit") },
            { icon: Activity, label: t("global.stat3"), value: "2%", unit: t("global.stat3unit") },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-4 border border-border/50 text-center"
            >
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.unit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalEmissions;
