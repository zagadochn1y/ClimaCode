import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Trophy, Lock, CheckCircle2, Clock, Zap, Code, Image, Server, Globe2, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useEcoDevProgress } from "@/hooks/useEcoDevProgress";

interface Lesson {
  title: string;
  content: string;
  quiz?: { question: string; options: string[]; correctIndex: number };
}

const moduleLessons: Record<number, Lesson[]> = {
  1: [
    {
      title: "What is Digital Carbon?",
      content: "Every time you load a webpage, data travels through servers, networks, and devices — all powered by electricity. The carbon footprint of the internet accounts for roughly 2% of global CO₂ emissions, comparable to the airline industry.\n\nData centers alone consume about 1% of the world's electricity. Each page view, each video stream, and each cloud storage operation contributes to this footprint.\n\nKey facts:\n• The average webpage produces ~0.5g CO₂ per view\n• Streaming one hour of video emits ~36g CO₂\n• A single email with attachments can produce 50g CO₂",
      quiz: { question: "What percentage of global CO₂ emissions does the internet account for?", options: ["0.5%", "2%", "10%", "25%"], correctIndex: 1 },
    },
    {
      title: "How Websites Generate Emissions",
      content: "Website emissions come from three main sources:\n\n1. **Data Transfer** — The more data sent from server to user, the more energy consumed. Large images, videos, and heavy JavaScript bundles are the biggest culprits.\n\n2. **Server Processing** — Every request requires CPU cycles on the server. Complex database queries and server-side rendering add to the energy cost.\n\n3. **Client-Side Processing** — Heavy JavaScript execution on the user's device drains battery and uses CPU power, translating to energy consumption.\n\nThe key insight: lighter websites = less energy = lower emissions.",
      quiz: { question: "Which of these is NOT a main source of website emissions?", options: ["Data Transfer", "Server Processing", "Monitor Brightness", "Client-Side Processing"], correctIndex: 2 },
    },
    {
      title: "Measuring Your Carbon Footprint",
      content: "Several models exist for calculating website carbon:\n\n• **Sustainable Web Design (SWD) Model** — Used by ClimaCode. Estimates CO₂ based on data transfer, energy intensity of the grid, and whether the hosting uses renewable energy.\n\n• **CO2.js Library** — An open-source tool by The Green Web Foundation. It implements the SWD model and makes calculations accessible to developers.\n\nTo measure your site:\n1. Calculate total page weight (HTML + CSS + JS + images + fonts)\n2. Estimate annual page views\n3. Apply the SWD model formula\n4. Compare against benchmarks (median: ~0.5g CO₂/view)",
      quiz: { question: "What is the median CO₂ per page view for websites?", options: ["~0.1g", "~0.5g", "~2g", "~10g"], correctIndex: 1 },
    },
    {
      title: "Taking Action: First Steps",
      content: "You don't need to rebuild your entire site to make a difference. Start with these high-impact actions:\n\n1. **Audit first** — Use ClimaScan to understand your baseline.\n2. **Optimize images** — Images typically account for 40-60% of page weight. Convert to WebP/AVIF, compress, and lazy-load.\n3. **Reduce JavaScript** — Audit your bundles. Remove unused libraries.\n4. **Choose green hosting** — The Green Web Foundation maintains a directory of hosts powered by renewable energy.\n5. **Set a carbon budget** — Aim for under 0.5g CO₂ per page view.\n\nCongratulations! You've completed Module 1. 🎉",
    },
  ],
  2: [
    {
      title: "Why Images Matter for Carbon",
      content: "Images are the largest contributor to page weight — typically 40-60% of total bytes transferred. A single unoptimized hero image can weigh 2-5 MB.\n\nEvery extra byte means more energy for:\n• Server storage and processing\n• Network transmission\n• Client-side decoding and rendering\n\nOptimizing images is the single highest-impact action you can take to reduce your website's carbon footprint.",
      quiz: { question: "What percentage of page weight do images typically account for?", options: ["10-20%", "20-30%", "40-60%", "70-90%"], correctIndex: 2 },
    },
    {
      title: "Modern Image Formats",
      content: "Modern formats offer dramatically better compression:\n\n• **WebP** — 25-35% smaller than JPEG at similar quality. Supported by all modern browsers.\n• **AVIF** — 50% smaller than JPEG. Newer but growing support.\n• **SVG** — Perfect for icons and illustrations. Infinitely scalable, tiny file size.\n\nFallback strategy:\n1. Serve AVIF as primary\n2. WebP as fallback\n3. JPEG/PNG as last resort\n\nUse the <picture> element for automatic format selection.",
      quiz: { question: "Which format offers ~50% compression improvement over JPEG?", options: ["WebP", "AVIF", "PNG", "GIF"], correctIndex: 1 },
    },
    {
      title: "Lazy Loading & Responsive Images",
      content: "Don't load what users don't see:\n\n• **Lazy loading** — Add loading=\"lazy\" to images below the fold. The browser loads them only when they're about to enter the viewport.\n\n• **Responsive images** — Use srcset to serve appropriately sized images:\n  - Mobile: 400px wide\n  - Tablet: 800px wide\n  - Desktop: 1200px wide\n\nA 1200px image on a 400px phone wastes 67% of data!\n\n• **Aspect ratio** — Always set width and height attributes to prevent layout shifts.",
      quiz: { question: "What attribute enables lazy loading on images?", options: ["defer", "async", "loading=\"lazy\"", "src-lazy"], correctIndex: 2 },
    },
    {
      title: "Video & Media Optimization",
      content: "Video is the heaviest media type:\n\n• **Avoid autoplay** — A 30-second autoplay video can transfer 10-30 MB.\n• **Use poster images** — Show a static thumbnail until user clicks.\n• **Compress videos** — Use H.265/HEVC or VP9. Tools like FFmpeg can reduce size 40-60%.\n• **Consider alternatives** — Can an animated illustration or CSS animation replace the video?\n\nAudio follows similar principles: use modern codecs (Opus, AAC), compress, and don't autoplay.",
      quiz: { question: "What can replace autoplay video to save bandwidth?", options: ["GIF animation", "Poster image with click-to-play", "Higher resolution video", "Multiple video sources"], correctIndex: 1 },
    },
    {
      title: "Image CDN & Automation",
      content: "Automate optimization to ensure consistency:\n\n• **Image CDNs** — Services like Cloudinary, imgix, or Cloudflare Images automatically optimize, resize, and serve the best format.\n\n• **Build-time optimization** — Use tools like sharp, imagemin, or squoosh in your build pipeline.\n\n• **Content Management** — Set maximum upload dimensions and auto-compress on upload.\n\nGolden rules:\n1. No image over 200KB for standard content\n2. Hero images under 500KB\n3. Always specify dimensions\n4. Use CSS for decorative effects, not images\n\n🎉 Module 2 Complete!",
    },
  ],
  3: [
    {
      title: "The Cost of JavaScript",
      content: "JavaScript is the most expensive resource on the web — byte for byte, it costs more than images because it must be parsed, compiled, and executed.\n\n• **Average JS bundle**: 400-600KB (compressed)\n• **Parse time**: 1-3 seconds on mobile devices\n• **Impact**: Heavy JS drains battery, blocks rendering, and consumes CPU energy\n\nThe V8 engine (Chrome) and SpiderMonkey (Firefox) spend significant energy just parsing and compiling your code before any logic runs.",
      quiz: { question: "Why is JavaScript more expensive than images per byte?", options: ["It's downloaded faster", "It must be parsed, compiled, and executed", "Browsers cache it poorly", "It's always larger"], correctIndex: 1 },
    },
    {
      title: "Tree-Shaking & Dead Code Elimination",
      content: "Tree-shaking removes unused code from your final bundle:\n\n• Use **ES modules** (import/export) — they're statically analyzable.\n• Avoid **side effects** in modules — mark packages as side-effect-free in package.json.\n• Use **named imports**: `import { debounce } from 'lodash-es'` instead of `import _ from 'lodash'`.\n\nThis can reduce bundle size by 20-60% depending on the libraries used.\n\nTools: Webpack, Rollup, Vite (uses Rollup), and esbuild all support tree-shaking.",
      quiz: { question: "Which import style enables better tree-shaking?", options: ["import * as lib from 'lib'", "require('lib')", "import { specific } from 'lib'", "import lib from 'lib'"], correctIndex: 2 },
    },
    {
      title: "Code Splitting & Lazy Loading",
      content: "Don't send all code upfront:\n\n• **Route-based splitting** — Each page loads only its own code.\n• **Component-based splitting** — Heavy components (charts, editors, maps) load on demand.\n• **Dynamic imports** — `const Chart = lazy(() => import('./Chart'))`\n\nIn React: use React.lazy + Suspense.\nIn Vite: automatic chunk splitting with dynamic imports.\n\nGoal: Initial bundle under 100KB (compressed). Load everything else on demand.",
      quiz: { question: "What is a good target for initial JS bundle size?", options: ["Under 10KB", "Under 100KB", "Under 500KB", "Under 1MB"], correctIndex: 1 },
    },
    {
      title: "Efficient CSS",
      content: "CSS also has a carbon cost:\n\n• **Purge unused CSS** — Tools like PurgeCSS or Tailwind's built-in purging remove unused styles.\n• **Avoid CSS-in-JS at scale** — Runtime CSS generation adds JS overhead. Prefer static extraction.\n• **Use CSS custom properties** — One definition, many uses. Smaller file size than repeated values.\n• **Minimize specificity wars** — BEM or utility-first approaches produce cleaner, smaller CSS.\n\nAverage CSS savings from purging: 80-95% reduction!",
      quiz: { question: "How much CSS can typically be removed by purging?", options: ["10-20%", "30-50%", "60-70%", "80-95%"], correctIndex: 3 },
    },
    {
      title: "Fonts & Third-Party Scripts",
      content: "Fonts and third-party scripts are hidden carbon sources:\n\n**Fonts:**\n• Use **system fonts** when possible — zero download cost.\n• Limit font **weights** — each weight adds 20-50KB.\n• Use **font-display: swap** — shows text immediately.\n• **Subset fonts** — include only needed characters.\n\n**Third-party scripts:**\n• Audit every external script (analytics, ads, widgets).\n• Use **async/defer** loading.\n• Consider self-hosting critical scripts.\n• Ask: does this script justify its carbon cost?\n\n🎉 Module 3 Complete!",
    },
    {
      title: "Build Pipeline Optimization",
      content: "Your build process affects the final output:\n\n• **Minification** — Remove whitespace, comments, shorten variable names.\n• **Compression** — Enable Brotli (preferred) or Gzip on your server.\n• **Source maps** — Only generate for development, not production.\n• **Bundle analysis** — Use tools like webpack-bundle-analyzer to find bloat.\n\nGolden rule: measure, optimize, re-measure. Use Lighthouse and WebPageTest to track improvements.\n\nA well-optimized build can reduce total transfer size by 60-80%.",
    },
  ],
  4: [
    {
      title: "What Is Green Hosting?",
      content: "Not all servers are equal when it comes to carbon:\n\n• **Traditional hosting** — Powered by a mix of energy sources, often fossil-fuel heavy.\n• **Green hosting** — Providers that use renewable energy (solar, wind, hydro) or purchase Renewable Energy Certificates (RECs).\n\nThe Green Web Foundation maintains a public directory of verified green hosts. Switching to a green host can reduce your site's carbon footprint by **up to 90%** without changing a single line of code.\n\nExamples of green hosts: GreenGeeks, A2 Hosting (with REC), Krystal, Infomaniak.",
      quiz: { question: "How much can switching to a green host reduce your carbon footprint?", options: ["Up to 10%", "Up to 30%", "Up to 60%", "Up to 90%"], correctIndex: 3 },
    },
    {
      title: "Content Delivery Networks (CDNs)",
      content: "CDNs reduce distance between server and user:\n\n• **Edge caching** — Static assets are served from the nearest data center, reducing latency and energy in transit.\n• **Reduced origin load** — The main server handles fewer requests, saving energy.\n• **Automatic optimization** — Many CDNs offer on-the-fly image resizing, compression, and format conversion.\n\nPopular green-friendly CDNs: Cloudflare (carbon-neutral), Fastly, BunnyCDN.\n\nA CDN can cut data transfer energy by **40-70%** for globally distributed users.",
      quiz: { question: "What is the main environmental benefit of a CDN?", options: ["It stores more data", "It reduces server-to-user distance and energy", "It speeds up code execution", "It replaces databases"], correctIndex: 1 },
    },
    {
      title: "Server-Side Sustainability",
      content: "Backend choices matter too:\n\n• **Serverless / Edge functions** — Spin up on demand, zero idle energy. Great for low-traffic or bursty workloads.\n• **Right-sizing** — Don't run a 16-core VM for a blog. Match resources to actual load.\n• **Auto-scaling** — Scale down during off-peak hours to save energy.\n• **Region selection** — Choose data center regions with cleaner energy grids (e.g., Scandinavia, France, Quebec).\n\nEvery watt saved on the server side compounds over millions of requests.",
      quiz: { question: "Which approach wastes zero energy when idle?", options: ["Dedicated servers", "Virtual machines", "Serverless functions", "Shared hosting"], correctIndex: 2 },
    },
    {
      title: "Caching Strategies for Sustainability",
      content: "Caching prevents redundant work:\n\n• **Browser caching** — Set long Cache-Control headers for static assets. Users download once, reuse for months.\n• **Service Workers** — Cache critical resources offline. The app works without network requests.\n• **API caching** — Cache database queries and API responses with tools like Redis or in-memory stores.\n• **Stale-while-revalidate** — Serve cached content immediately, update in background.\n\nA strong caching strategy can **eliminate 60-80%** of repeat requests, saving server energy and bandwidth.\n\n🎉 Module 4 Complete!",
      quiz: { question: "What percentage of repeat requests can caching eliminate?", options: ["10-20%", "30-40%", "60-80%", "90-100%"], correctIndex: 2 },
    },
  ],
  5: [
    {
      title: "Core Web Vitals & Carbon",
      content: "Google's Core Web Vitals measure user experience, and they directly correlate with energy:\n\n• **LCP (Largest Contentful Paint)** — Faster load = less time the CPU/network is active.\n• **FID / INP (Interaction to Next Paint)** — Responsive pages use CPU bursts efficiently, not prolonged processing.\n• **CLS (Cumulative Layout Shift)** — Stable layouts prevent wasted re-renders and re-paints.\n\nA site with good Core Web Vitals is almost always a low-carbon site. Performance IS sustainability.",
      quiz: { question: "Which statement is true about Core Web Vitals and carbon?", options: ["They are unrelated", "Good vitals usually mean lower carbon", "Only LCP matters for carbon", "CLS has no energy impact"], correctIndex: 1 },
    },
    {
      title: "Rendering Strategies",
      content: "How you render pages affects energy consumption:\n\n• **SSG (Static Site Generation)** — Pages pre-built at deploy time. Zero server computation per request. Lowest energy cost.\n• **SSR (Server-Side Rendering)** — Computed per request. Heavier on the server but great for dynamic content.\n• **CSR (Client-Side Rendering)** — Shifts work to the user's device. Can drain mobile batteries.\n• **ISR (Incremental Static Regeneration)** — Hybrid: mostly static with periodic rebuilds.\n\nChoose SSG whenever content allows. For dynamic content, use ISR or SSR with aggressive caching.",
      quiz: { question: "Which rendering strategy has the lowest energy cost per request?", options: ["SSR", "CSR", "SSG", "ISR"], correctIndex: 2 },
    },
    {
      title: "Sustainable API Design",
      content: "APIs can be wasteful or efficient:\n\n• **Over-fetching** — REST endpoints often return more data than needed. Use GraphQL or lean REST endpoints.\n• **Pagination** — Never return unbounded lists. Use cursor-based pagination.\n• **Compression** — Enable gzip/brotli for API responses.\n• **Batching** — Combine multiple requests into one. Reduces HTTP overhead.\n• **WebSockets vs Polling** — Use persistent connections for real-time data instead of polling every N seconds.\n\nEvery unnecessary API call wastes server cycles, network bandwidth, and client battery.",
      quiz: { question: "What is a sustainable alternative to polling?", options: ["More frequent polling", "WebSockets", "Larger payloads", "Removing caching"], correctIndex: 1 },
    },
    {
      title: "Monitoring & Carbon Budgets",
      content: "You can't improve what you don't measure:\n\n• **Set a carbon budget** — e.g., max 0.5g CO₂ per page view. Enforce in CI/CD.\n• **Use Lighthouse CI** — Automated performance scoring on every PR.\n• **Website Carbon Calculator** — Track your score over time.\n• **Real User Monitoring (RUM)** — Measure actual user experience, not just lab conditions.\n\nIntegrate carbon tracking into your development workflow the same way you track performance regressions.\n\nGolden rule: Every PR should either maintain or improve the carbon score.",
      quiz: { question: "What is a good carbon budget per page view?", options: ["Max 5g CO₂", "Max 2g CO₂", "Max 0.5g CO₂", "Max 0.1g CO₂"], correctIndex: 2 },
    },
    {
      title: "Your Green Development Checklist",
      content: "Use this checklist for every project:\n\n✅ Images: WebP/AVIF, lazy-loaded, responsive srcset\n✅ JavaScript: Tree-shaken, code-split, under 100KB initial\n✅ CSS: Purged, minimal, utility-first or modular\n✅ Fonts: System fonts or subsetted, font-display: swap\n✅ Hosting: Green host with renewable energy\n✅ CDN: Edge caching enabled for static assets\n✅ Caching: Long Cache-Control, service worker for offline\n✅ APIs: Paginated, compressed, no over-fetching\n✅ Monitoring: Carbon budget in CI, Lighthouse audits\n✅ Third-party: Every script justified and async-loaded\n\nShare this checklist with your team. Sustainable development is a team sport! 🌍",
    },
    {
      title: "Final Project: Audit Your Own Site",
      content: "Put everything you've learned into practice! This is your final exercise.\n\n**Step 1:** Choose a website you own or maintain.\n**Step 2:** Run it through ClimaScan to get your baseline CO₂ score.\n**Step 3:** Create an optimization plan using this template:\n\n📋 **Optimization Plan**\n• Current CO₂ per view: ___g\n• Target CO₂ per view: ___g\n• Top 3 optimizations to implement:\n  1. ___\n  2. ___\n  3. ___\n• Timeline: ___\n\n**Step 4:** Implement at least one optimization.\n**Step 5:** Re-scan and compare results.\n\nCongratulations — you are now an Eco Developer! 🏆🌱\n\n🎉 Module 5 Complete — You've finished the entire course!",
    },
  ],
};

const modules = [
  { id: 1, icon: Globe2, title: "The Carbon Cost of the Internet", description: "Understand how websites and apps generate CO₂ emissions and why it matters.", lessons: 4, duration: "20 min", difficulty: "Beginner" },
  { id: 2, icon: Image, title: "Optimizing Images & Media", description: "Learn to compress, lazy-load, and use modern formats like WebP and AVIF.", lessons: 5, duration: "30 min", difficulty: "Beginner" },
  { id: 3, icon: Code, title: "Efficient JavaScript & CSS", description: "Write lighter code: tree-shaking, code splitting, and reducing bundle size.", lessons: 6, duration: "35 min", difficulty: "Intermediate" },
  { id: 4, icon: Server, title: "Green Hosting & CDN", description: "Choose renewable-powered hosting and optimize content delivery.", lessons: 4, duration: "25 min", difficulty: "Intermediate" },
  { id: 5, icon: Zap, title: "Performance = Sustainability", description: "Core Web Vitals, caching, API design, and a final hands-on project.", lessons: 7, duration: "40 min", difficulty: "Advanced" },
];

const achievements = [
  { title: "First Lesson", description: "Complete your first lesson", icon: "🌱" },
  { title: "Green Beginner", description: "Complete Module 1", icon: "🌿" },
  { title: "Media Master", description: "Complete Module 2", icon: "🖼️" },
  { title: "Code Optimizer", description: "Complete Module 3", icon: "⚡" },
  { title: "Green Hoster", description: "Complete Module 4", icon: "🌐" },
  { title: "Performance Pro", description: "Complete Module 5", icon: "🚀" },
  { title: "Carbon Cutter", description: "Score 100% on all quizzes", icon: "✂️" },
  { title: "Eco Developer", description: "Complete all modules", icon: "🏆" },
];

const difficultyColor = (d: string) => {
  if (d === "Beginner") return "bg-clima-success/15 text-clima-success border-clima-success/30";
  if (d === "Intermediate") return "bg-clima-warning/15 text-clima-warning border-clima-warning/30";
  return "bg-primary/15 text-primary border-primary/30";
};

const EcoDevSchool = () => {
  const { user } = useAuth();
  const { progress, saveProgress } = useEcoDevProgress();
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  const isModuleUnlocked = (moduleId: number) => {
    if (moduleId === 1) return true;
    const prev = progress.get(moduleId - 1);
    return prev?.completed ?? false;
  };

  const isModuleCompleted = (moduleId: number) => progress.get(moduleId)?.completed ?? false;

  const totalLessonsCompleted = Array.from(progress.values()).reduce((acc, p) => acc + p.completed_lessons.length, 0);
  const totalModulesCompleted = Array.from(progress.values()).filter(p => p.completed).length;

  const handleStartModule = (moduleId: number) => {
    if (!moduleLessons[moduleId]) return;
    const saved = progress.get(moduleId);
    setActiveModule(moduleId);
    setCurrentLesson(0);
    setCompletedLessons(new Set(saved?.completed_lessons ?? []));
    setQuizScores(saved?.quiz_scores ?? {});
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleNextLesson = () => {
    if (!activeModule || !moduleLessons[activeModule]) return;
    const lessons = moduleLessons[activeModule];
    const newCompleted = new Set([...completedLessons, currentLesson]);
    setCompletedLessons(newCompleted);

    const isLast = currentLesson >= lessons.length - 1;
    const completedArr = Array.from(newCompleted);
    const moduleComplete = isLast && completedArr.length >= lessons.length;

    if (user) {
      saveProgress(activeModule, completedArr, quizScores, moduleComplete);
    }

    if (!isLast) {
      setCurrentLesson(currentLesson + 1);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    } else {
      setActiveModule(null);
    }
  };

  const handlePrevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!activeModule) return;
    setQuizSubmitted(true);
    const lesson = moduleLessons[activeModule][currentLesson];
    if (lesson.quiz && quizAnswer === lesson.quiz.correctIndex) {
      setQuizScores(prev => ({ ...prev, [`${activeModule}-${currentLesson}`]: 1 }));
    }
  };

  const earnedAchievements = [
    totalLessonsCompleted >= 1,
    isModuleCompleted(1),
    isModuleCompleted(2),
    isModuleCompleted(3),
    isModuleCompleted(4),
    isModuleCompleted(5),
    false, // all quizzes perfect — complex check
    totalModulesCompleted >= 5,
  ];

  // Lesson view
  if (activeModule && moduleLessons[activeModule]) {
    const lessons = moduleLessons[activeModule];
    const lesson = lessons[currentLesson];
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 max-w-3xl">
          <Button variant="ghost" className="mb-6" onClick={() => setActiveModule(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Modules
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-xs">Lesson {currentLesson + 1} / {lessons.length}</Badge>
              <Progress value={((currentLesson + 1) / lessons.length) * 100} className="h-2 flex-1" />
            </div>

            <h1 className="text-2xl font-black mb-6">{lesson.title}</h1>

            <Card className="border-2 mb-6">
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  {lesson.content.split("\n").map((line, i) => (
                    <p key={i} className={`text-sm ${line.startsWith("•") || /^\d\./.test(line) ? "ml-4" : ""} ${line.startsWith("**") ? "font-semibold" : "text-muted-foreground"} mb-2`}>
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {lesson.quiz && (
              <Card className="border-2 border-primary/30 mb-6">
                <CardContent className="p-6">
                  <p className="font-bold text-sm mb-4">📝 Quiz: {lesson.quiz.question}</p>
                  <div className="space-y-2">
                    {lesson.quiz.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => { if (!quizSubmitted) setQuizAnswer(i); }}
                        className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-colors ${
                          quizSubmitted && i === lesson.quiz!.correctIndex
                            ? "border-clima-success bg-clima-success/10"
                            : quizSubmitted && i === quizAnswer && i !== lesson.quiz!.correctIndex
                              ? "border-destructive bg-destructive/10"
                              : quizAnswer === i
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {!quizSubmitted && quizAnswer !== null && (
                    <Button className="mt-4 rounded-full" onClick={handleQuizSubmit}>Check Answer</Button>
                  )}
                  {quizSubmitted && (
                    <p className={`mt-3 text-sm font-semibold ${quizAnswer === lesson.quiz.correctIndex ? "text-clima-success" : "text-destructive"}`}>
                      {quizAnswer === lesson.quiz.correctIndex ? "✅ Correct!" : `❌ The answer is: ${lesson.quiz.options[lesson.quiz.correctIndex]}`}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevLesson} disabled={currentLesson === 0} className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              <Button onClick={handleNextLesson} className="rounded-full" disabled={lesson.quiz && !quizSubmitted}>
                {currentLesson === lessons.length - 1 ? "Complete Module 🎉" : "Next Lesson"}
                {currentLesson < lessons.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5 mb-4">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Learning Platform</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">EcoDev School</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Learn to build energy-efficient websites and apps. Master sustainable coding practices step by step.
          </p>
        </motion.div>

        {/* Progress overview */}
        <Card className="border-2 mb-10">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">Your Progress</span>
                  <span className="text-muted-foreground">{totalModulesCompleted} / {modules.length} modules</span>
                </div>
                <Progress value={(totalModulesCompleted / modules.length) * 100} className="h-3" />
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-black text-primary">{totalLessonsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Lessons Done</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-clima-warning">{earnedAchievements.filter(Boolean).length}</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules */}
        <h2 className="text-xl font-bold mb-6">Modules</h2>
        <div className="space-y-4 mb-12">
          {modules.map((mod, i) => {
            const unlocked = isModuleUnlocked(mod.id);
            const completed = isModuleCompleted(mod.id);
            return (
              <motion.div key={mod.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                <Card className={`border-2 transition-colors ${unlocked ? "hover:border-primary/50" : "opacity-60"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${unlocked ? "bg-primary/10" : "bg-muted"}`}>
                        {unlocked ? <mod.icon className="h-6 w-6 text-primary" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold">{mod.title}</h3>
                          <Badge variant="outline" className={`text-[10px] ${difficultyColor(mod.difficulty)}`}>{mod.difficulty}</Badge>
                          {completed && <Badge className="bg-clima-success text-white text-[10px]">Completed ✓</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{mod.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{mod.lessons} lessons</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{mod.duration}</span>
                        </div>
                      </div>
                      <Button
                        variant={unlocked ? "default" : "outline"}
                        size="sm"
                        className="rounded-full flex-shrink-0"
                        disabled={!unlocked || !moduleLessons[mod.id]}
                        onClick={() => handleStartModule(mod.id)}
                      >
                        {completed ? "Review" : unlocked && moduleLessons[mod.id] ? "Start" : "Locked"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements */}
        <h2 className="text-xl font-bold mb-6">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {achievements.map((ach, i) => (
            <motion.div key={ach.title} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
              <Card className={`border-2 text-center ${earnedAchievements[i] ? "border-primary/50" : "opacity-50"}`}>
                <CardContent className="p-4">
                  <p className="text-3xl mb-2">{ach.icon}</p>
                  <p className="font-bold text-sm">{ach.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ach.description}</p>
                  {earnedAchievements[i] && <Badge className="mt-2 bg-clima-success text-white text-[10px]">Earned ✓</Badge>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {!user && (
          <Card className="border-2 border-primary/30 bg-accent/50">
            <CardContent className="p-6 text-center">
              <p className="font-semibold mb-2">Sign in to track your progress</p>
              <p className="text-sm text-muted-foreground mb-4">Your progress and achievements will be saved to your account</p>
              <Button className="rounded-full" asChild><a href="/login">Sign In</a></Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EcoDevSchool;
