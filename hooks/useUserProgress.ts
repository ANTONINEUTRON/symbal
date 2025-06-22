import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type UserProgress = Database['public']['Tables']['user_progress']['Row'];
type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert'];
type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update'];

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Progress doesn't exist, create it
        const newProgress: UserProgressInsert = {
          user_id: user.id,
          xp: 0,
          level: 1,
          current_story_index: 0,
          mood: 'creative inspiration',
          completed_games: [],
          achievements: [],
          last_task_types: [],
        };

        const { data: createdProgress, error: createError } = await supabase
          .from('user_progress')
          .insert(newProgress)
          .select()
          .single();

        if (createError) throw createError;
        setProgress(createdProgress);
      } else if (error) {
        throw error;
      } else {
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (updates: UserProgressUpdate) => {
    if (!user || !progress) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProgress(data);
      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const addXP = async (xpAmount: number) => {
    if (!progress) return;

    const newXP = progress.xp + xpAmount;
    const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP

    return updateProgress({
      xp: newXP,
      level: newLevel,
    });
  };

  const completeGame = async (gameId: string, xpReward: number, gameType?: string) => {
    if (!progress) return;

    const updatedCompletedGames = [...progress.completed_games];
    if (!updatedCompletedGames.includes(gameId)) {
      updatedCompletedGames.push(gameId);
    }

    // Update last task types to prevent repetition (keep last 5)
    let updatedLastTaskTypes = [...progress.last_task_types];
    if (gameType) {
      updatedLastTaskTypes.push(gameType);
      if (updatedLastTaskTypes.length > 5) {
        updatedLastTaskTypes = updatedLastTaskTypes.slice(-5);
      }
    }

    const newXP = progress.xp + xpReward;
    const newLevel = Math.floor(newXP / 100) + 1;

    return updateProgress({
      xp: newXP,
      level: newLevel,
      completed_games: updatedCompletedGames,
      last_task_types: updatedLastTaskTypes,
    });
  };

  const updateMood = async (newMood: string) => {
    return updateProgress({
      mood: newMood,
    });
  };

  const addAchievement = async (achievementId: string) => {
    if (!progress) return;

    const updatedAchievements = [...progress.achievements];
    if (!updatedAchievements.includes(achievementId)) {
      updatedAchievements.push(achievementId);
    }

    return updateProgress({
      achievements: updatedAchievements,
    });
  };

  return {
    progress,
    isLoading,
    updateProgress,
    addXP,
    completeGame,
    updateMood,
    addAchievement,
    refetch: fetchProgress,
  };
}