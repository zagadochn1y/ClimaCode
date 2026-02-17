import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ModuleProgress {
  module_id: number;
  completed_lessons: number[];
  quiz_scores: Record<string, number>;
  completed: boolean;
}

export function useEcoDevProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Map<number, ModuleProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("ecodev_progress")
        .select("module_id, completed_lessons, quiz_scores, completed")
        .eq("user_id", user.id);
      const map = new Map<number, ModuleProgress>();
      (data ?? []).forEach((row: any) => {
        map.set(row.module_id, {
          module_id: row.module_id,
          completed_lessons: row.completed_lessons ?? [],
          quiz_scores: (row.quiz_scores as Record<string, number>) ?? {},
          completed: row.completed,
        });
      });
      setProgress(map);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const saveProgress = useCallback(async (moduleId: number, completedLessons: number[], quizScores: Record<string, number>, completed: boolean) => {
    if (!user) return;
    const { error } = await supabase
      .from("ecodev_progress")
      .upsert({
        user_id: user.id,
        module_id: moduleId,
        completed_lessons: completedLessons,
        quiz_scores: quizScores,
        completed,
      }, { onConflict: "user_id,module_id" });
    if (!error) {
      setProgress((prev) => {
        const next = new Map(prev);
        next.set(moduleId, { module_id: moduleId, completed_lessons: completedLessons, quiz_scores: quizScores, completed });
        return next;
      });
    }
  }, [user]);

  return { progress, loading, saveProgress };
}
