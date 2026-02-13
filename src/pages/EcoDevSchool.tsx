import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Trophy, Lock, CheckCircle2, Clock, Zap, Code, Image, Server, Globe2, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

interface Lesson {
  title: string;
  content: string;
  quiz?: { question: string; options: string[]; correctIndex: number };
}

const module1Lessons: Lesson[] = [
  {
    title: "What is Digital Carbon?",
    content: "Every time you load a webpage, data travels through servers, networks, and devices — all powered by electricity. The carbon footprint of the internet accounts for roughly 2% of global CO₂ emissions, comparable to the airline industry.\n\nData centers alone consume about 1% of the world's electricity. Each page view, each video stream, and each cloud storage operation contributes to this footprint.\n\nKey facts:\n• The average webpage produces ~0.5g CO₂ per view\n• Streaming one hour of video emits ~36g CO₂\n• A single email with attachments can produce 50g CO₂",
    quiz: {
      question: "What percentage of global CO₂ emissions does the internet account for?",
      options: ["0.5%", "2%", "10%", "25%"],
      correctIndex: 1,
    },
  },
  {
    title: "How Websites Generate Emissions",
    content: "Website emissions come from three main sources:\n\n1. **Data Transfer** — The more data sent from server to user, the more energy consumed. Large images, videos, and heavy JavaScript bundles are the biggest culprits.\n\n2. **Server Processing** — Every request requires CPU cycles on the server. Complex database queries and server-side rendering add to the energy cost.\n\n3. **Client-Side Processing** — Heavy JavaScript execution on the user's device drains battery and uses CPU power, translating to energy consumption.\n\nThe key insight: lighter websites = less energy = lower emissions.",
    quiz: {
      question: "Which of these is NOT a main source of website emissions?",
      options: ["Data Transfer", "Server Processing", "Monitor Brightness", "Client-Side Processing"],
      correctIndex: 2,
    },
  },
  {
    title: "Measuring Your Carbon Footprint",
    content: "Several models exist for calculating website carbon:\n\n• **Sustainable Web Design (SWD) Model** — Used by ClimaCode. Estimates CO₂ based on data transfer, energy intensity of the grid, and whether the hosting uses renewable energy.\n\n• **CO2.js Library** — An open-source tool by The Green Web Foundation. It implements the SWD model and makes calculations accessible to developers.\n\nTo measure your site:\n1. Calculate total page weight (HTML + CSS + JS + images + fonts)\n2. Estimate annual page views\n3. Apply the SWD model formula\n4. Compare against benchmarks (median: ~0.5g CO₂/view)",
    quiz: {
      question: "What is the median CO₂ per page view for websites?",
      options: ["~0.1g", "~0.5g", "~2g", "~10g"],
      correctIndex: 1,
    },
  },
  {
    title: "Taking Action: First Steps",
    content: "You don't need to rebuild your entire site to make a difference. Start with these high-impact actions:\n\n1. **Audit first** — Use ClimaScan to understand your baseline. You can't improve what you don't measure.\n\n2. **Optimize images** — Images typically account for 40-60% of page weight. Convert to WebP/AVIF, compress, and lazy-load.\n\n3. **Reduce JavaScript** — Audit your bundles. Remove unused libraries. Consider whether you really need that animation library.\n\n4. **Choose green hosting** — The Green Web Foundation maintains a directory of hosts powered by renewable energy.\n\n5. **Set a carbon budget** — Aim for under 0.5g CO₂ per page view. Track it like you track performance metrics.\n\nCongratulations! You've completed Module 1. 🎉",
  },
];

const modules = [
  {
    id: 1, icon: Globe2, title: "The Carbon Cost of the Internet",
    description: "Understand how websites and apps generate CO₂ emissions and why it matters.",
    lessons: 4, duration: "20 min", difficulty: "Beginner", unlocked: true,
  },
  {
    id: 2, icon: Image, title: "Optimizing Images & Media",
    description: "Learn to compress, lazy-load, and use modern formats like WebP and AVIF.",
    lessons: 5, duration: "30 min", difficulty: "Beginner", unlocked: false,
  },
  {
    id: 3, icon: Code, title: "Efficient JavaScript & CSS",
    description: "Write lighter code: tree-shaking, code splitting, and reducing bundle size.",
    lessons: 6, duration: "35 min", difficulty: "Intermediate", unlocked: false,
  },
  {
    id: 4, icon: Server, title: "Green Hosting & CDN",
    description: "Choose renewable-powered hosting and optimize content delivery.",
    lessons: 4, duration: "25 min", difficulty: "Intermediate", unlocked: false,
  },
  {
    id: 5, icon: Zap, title: "Performance = Sustainability",
    description: "Core Web Vitals, caching strategies, and their impact on carbon emissions.",
    lessons: 5, duration: "30 min", difficulty: "Advanced", unlocked: false,
  },
];

const achievements = [
  { title: "First Lesson", description: "Complete your first lesson", icon: "🌱" },
  { title: "Green Beginner", description: "Complete Module 1", icon: "🌿" },
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
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleStartModule = (moduleId: number) => {
    if (moduleId === 1) {
      setActiveModule(1);
      setCurrentLesson(0);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    }
  };

  const handleNextLesson = () => {
    setCompletedLessons((prev) => new Set([...prev, currentLesson]));
    if (currentLesson < module1Lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    } else {
      setCompletedLessons((prev) => new Set([...prev, currentLesson]));
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

  const moduleCompleted = completedLessons.size >= module1Lessons.length;
  const lessonsCompleted = completedLessons.size;
  const earnedAchievements = [
    lessonsCompleted >= 1,
    moduleCompleted,
    false,
    false,
  ];

  // Lesson view
  if (activeModule === 1) {
    const lesson = module1Lessons[currentLesson];
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 max-w-3xl">
          <Button variant="ghost" className="mb-6" onClick={() => setActiveModule(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Modules
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-xs">Lesson {currentLesson + 1} / {module1Lessons.length}</Badge>
              <Progress value={((currentLesson + 1) / module1Lessons.length) * 100} className="h-2 flex-1" />
            </div>

            <h1 className="text-2xl font-black mb-6">{lesson.title}</h1>

            <Card className="border-2 mb-6">
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  {lesson.content.split("\n").map((line, i) => (
                    <p key={i} className={`text-sm ${line.startsWith("•") || line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.") || line.startsWith("5.") ? "ml-4" : ""} ${line.startsWith("**") ? "font-semibold" : "text-muted-foreground"} mb-2`}>
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quiz */}
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
                    <Button className="mt-4 rounded-full" onClick={() => setQuizSubmitted(true)}>
                      Check Answer
                    </Button>
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
                {currentLesson === module1Lessons.length - 1 ? "Complete Module 🎉" : "Next Lesson"}
                {currentLesson < module1Lessons.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
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
                  <span className="text-muted-foreground">{moduleCompleted ? 1 : 0} / {modules.length} modules</span>
                </div>
                <Progress value={(moduleCompleted ? 1 : 0) / modules.length * 100} className="h-3" />
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-black text-primary">{lessonsCompleted}</p>
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
          {modules.map((mod, i) => (
            <motion.div key={mod.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
              <Card className={`border-2 transition-colors ${mod.unlocked ? "hover:border-primary/50" : "opacity-60"}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${mod.unlocked ? "bg-primary/10" : "bg-muted"}`}>
                      {mod.unlocked ? <mod.icon className="h-6 w-6 text-primary" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold">{mod.title}</h3>
                        <Badge variant="outline" className={`text-[10px] ${difficultyColor(mod.difficulty)}`}>{mod.difficulty}</Badge>
                        {mod.id === 1 && moduleCompleted && <Badge className="bg-clima-success text-white text-[10px]">Completed ✓</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{mod.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{mod.lessons} lessons</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{mod.duration}</span>
                      </div>
                    </div>
                    <Button
                      variant={mod.unlocked ? "default" : "outline"}
                      size="sm"
                      className="rounded-full flex-shrink-0"
                      disabled={!mod.unlocked}
                      onClick={() => handleStartModule(mod.id)}
                    >
                      {mod.id === 1 && moduleCompleted ? "Review" : mod.unlocked ? "Start" : "Locked"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <h2 className="text-xl font-bold mb-6">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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
