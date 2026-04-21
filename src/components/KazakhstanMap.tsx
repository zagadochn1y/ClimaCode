import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RegionData {
  id: string;
  name: string;
  nameKk: string;
  nameRu: string;
}

// Mercator projection
const project = (lon: number, lat: number): [number, number] => {
  const x = (lon + 180) * (1000 / 360);
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = 500 - (1000 * mercN) / (2 * Math.PI);
  return [x, y];
};

const coordsToPath = (coords: number[][]): string => {
  const pts = coords.map(([lon, lat]) => project(lon, lat));
  return "M" + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L") + "Z";
};

const geoToPath = (geometry: any): string => {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring: number[][]) => coordsToPath(ring)).join("");
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((poly: any) => poly.map((ring: number[][]) => coordsToPath(ring)).join(""))
      .join("");
  }
  return "";
};

const regionNames: Record<string, { en: string; ru: string; kk: string }> = {
  almaty: { en: "Almaty Region", ru: "Алматинская обл.", kk: "Алматы облысы" },
  almaty_city: { en: "Almaty City", ru: "г. Алматы", kk: "Алматы қ." },
  akmola: { en: "Akmola", ru: "Акмолинская обл.", kk: "Ақмола облысы" },
  aktobe: { en: "Aktobe", ru: "Актюбинская обл.", kk: "Ақтөбе облысы" },
  atyrau: { en: "Atyrau", ru: "Атырауская обл.", kk: "Атырау облысы" },
  eko: { en: "East Kazakhstan", ru: "Вост. Казахстан", kk: "Шығыс Қазақстан" },
  mangystau: { en: "Mangystau", ru: "Мангистауская обл.", kk: "Маңғыстау облысы" },
  nko: { en: "North Kazakhstan", ru: "Сев. Казахстан", kk: "Солтүстік Қазақстан" },
  pavlodar: { en: "Pavlodar", ru: "Павлодарская обл.", kk: "Павлодар облысы" },
  karaganda: { en: "Karaganda", ru: "Карагандинская обл.", kk: "Қарағанды облысы" },
  kostanay: { en: "Kostanay", ru: "Костанайская обл.", kk: "Қостанай облысы" },
  kyzylorda: { en: "Kyzylorda", ru: "Кызылординская обл.", kk: "Қызылорда облысы" },
  turkestan: { en: "Turkestan", ru: "Туркестанская обл.", kk: "Түркістан облысы" },
  wko: { en: "West Kazakhstan", ru: "Зап. Казахстан", kk: "Батыс Қазақстан" },
  zhambyl: { en: "Zhambyl", ru: "Жамбылская обл.", kk: "Жамбыл облысы" },
  shymkent: { en: "Shymkent", ru: "г. Шымкент", kk: "Шымкент қ." },
  astana: { en: "Astana", ru: "г. Астана", kk: "Астана қ." },
};

interface Feature {
  properties: { id: string; name: string };
  geometry: any;
}

interface Props {
  data: Record<string, { co2Saved: number; sitesOptimized: number; devCount: number }>;
  lang: "en" | "ru" | "kk";
  onRegionClick?: (regionId: string) => void;
}

export default function KazakhstanMap({ data, lang, onRegionClick }: Props) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom/pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  useEffect(() => {
    fetch("/kz-regions.geojson")
      .then((r) => r.json())
      .then((d) => setFeatures(d.features))
      .catch(console.error);
  }, []);

  // Compute viewBox from features
  const viewBox = useMemo(() => {
    if (features.length === 0) return "0 0 100 100";
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const f of features) {
      const path = geoToPath(f.geometry);
      const coords = path.match(/[\d.]+,[\d.]+/g);
      if (!coords) continue;
      for (const c of coords) {
        const [x, y] = c.split(",").map(Number);
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
    }
    const pad = 5;
    return `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`;
  }, [features]);

  const paths = useMemo(() => {
    return features.map((f) => ({
      id: f.properties.id,
      name: f.properties.name,
      d: geoToPath(f.geometry),
    }));
  }, [features]);

  const getIntensity = (regionId: string) => {
    const d = data[regionId];
    if (!d || d.devCount === 0) return 0;
    return Math.min(1, d.devCount / 10);
  };

  const getColor = (regionId: string, isHovered: boolean) => {
    if (isHovered) return "hsl(var(--primary) / 0.7)";
    const intensity = getIntensity(regionId);
    if (intensity === 0) return "hsl(var(--muted) / 0.6)";
    const lightness = 45 - intensity * 15;
    return `hsl(142, ${50 + intensity * 30}%, ${lightness}%)`;
  };

  const getRegionName = (id: string) => {
    const names = regionNames[id];
    if (!names) return id;
    return names[lang] ?? names.en;
  };

  const handleMouseMove = useCallback((e: React.MouseEvent, id: string) => {
    if (!containerRef.current || isPanning) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHovered(id);
  }, [isPanning]);

  const handleZoom = (delta: number) => {
    setZoom((z) => Math.max(0.5, Math.min(5, z + delta)));
  };

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // Mouse pan handlers
  const onPanStart = (e: React.MouseEvent) => {
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };
  const onPanMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: panStart.current.panX + (e.clientX - panStart.current.x) / zoom,
      y: panStart.current.panY + (e.clientY - panStart.current.y) / zoom,
    });
  };
  const onPanEnd = () => setIsPanning(false);

  // Wheel zoom
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY > 0 ? -0.2 : 0.2);
  };

  // Touch handlers
  const lastTouchDist = useRef<number | null>(null);
  const touchPanStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1) {
      touchPanStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, panX: pan.x, panY: pan.y };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const delta = (dist - lastTouchDist.current) * 0.01;
      handleZoom(delta);
      lastTouchDist.current = dist;
    } else if (e.touches.length === 1 && zoom > 1) {
      setPan({
        x: touchPanStart.current.panX + (e.touches[0].clientX - touchPanStart.current.x) / zoom,
        y: touchPanStart.current.panY + (e.touches[0].clientY - touchPanStart.current.y) / zoom,
      });
    }
  };

  const onTouchEnd = () => { lastTouchDist.current = null; };

  const hoveredData = hovered ? data[hovered] : null;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
        <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm" onClick={() => handleZoom(0.3)}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm" onClick={() => handleZoom(-0.3)}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm" onClick={resetView}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {features.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          onMouseDown={onPanStart}
          onMouseMove={onPanMove}
          onMouseUp={onPanEnd}
          onMouseLeave={() => { onPanEnd(); setHovered(null); }}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <svg
            viewBox={viewBox}
            className="w-full h-auto"
            style={{
              maxHeight: "60vh",
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: "center center",
              transition: isPanning ? "none" : "transform 0.2s ease-out",
            }}
          >
            {/* Background */}
            <rect x={viewBox.split(" ").map(Number)[0]} y={viewBox.split(" ").map(Number)[1]}
              width={viewBox.split(" ").map(Number)[2]} height={viewBox.split(" ").map(Number)[3]}
              fill="transparent" />

            {paths.map((p) => {
              const isHovered = hovered === p.id;
              return (
                <path
                  key={p.id}
                  d={p.d}
                  fill={getColor(p.id, isHovered)}
                  stroke={isHovered ? "hsl(var(--primary))" : "hsl(var(--border) / 0.6)"}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  className="transition-colors duration-200 cursor-pointer"
                  style={{
                    filter: isHovered ? "drop-shadow(0 0 6px hsl(var(--primary) / 0.4))" : "none",
                  }}
                  onMouseMove={(e) => { e.stopPropagation(); handleMouseMove(e, p.id); }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => { e.stopPropagation(); onRegionClick?.(p.id); }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    setHovered(p.id);
                    if (containerRef.current) {
                      const rect = containerRef.current.getBoundingClientRect();
                      const touch = e.touches[0];
                      setTooltipPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
                    }
                  }}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Tooltip */}
      {hovered && !isPanning && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute pointer-events-none glass-card rounded-xl p-3 border border-primary/30 shadow-lg z-20 text-sm min-w-[180px]"
          style={{
            left: Math.min(tooltipPos.x + 12, (containerRef.current?.clientWidth ?? 400) - 200),
            top: Math.max(tooltipPos.y - 70, 10),
          }}
        >
          <p className="font-bold mb-1">{getRegionName(hovered)}</p>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>👨‍💻 {lang === "ru" ? "Разработчиков" : lang === "kk" ? "Әзірлеушілер" : "Developers"}: <span className="text-foreground font-medium">{hoveredData?.devCount ?? 0}</span></p>
            <p>🌿 CO₂ {lang === "ru" ? "сохранено" : lang === "kk" ? "сақталды" : "saved"}: <span className="text-foreground font-medium">{(hoveredData?.co2Saved ?? 0).toFixed(2)}g</span></p>
            <p>🌐 {lang === "ru" ? "Сайтов" : lang === "kk" ? "Сайттар" : "Sites"}: <span className="text-foreground font-medium">{hoveredData?.sitesOptimized ?? 0}</span></p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
