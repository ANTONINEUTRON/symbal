import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type UserProgress = Database['public']['Tables']['user_progress']['Row'];
type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert'];
type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update'];

interface AppSettings {
  premium_xp_threshold: number;
  max_xp_per_game: number;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    premium_xp_threshold: 75000, // Default fallback
    max_xp_per_game: 10 // Default fallback
  });

  useEffect(() => {
    if (user) {
      fetchProgress();
      fetchAppSettings();
    } else {
      setProgress(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchAppSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', ['premium_xp_threshold', 'max_xp_per_game']);

      if (error) {
        console.error('Error fetching app settings:', error);
        return;
      }

      const settings: Partial<AppSettings> = {};
      data?.forEach(setting => {
        if (setting.key === 'premium_xp_threshold') {
          settings.premium_xp_threshold = Number(setting.value);
        } else if (setting.key === 'max_xp_per_game') {
          settings.max_xp_per_game = Number(setting.value);
        }
      });

      setAppSettings(prev => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Error fetching app settings:', error);
    }
  };

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

    // Cap XP to maximum allowed per game
    const cappedXP = Math.min(xpAmount, appSettings.max_xp_per_game);
    const newXP = progress.xp + cappedXP;
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

    // Cap XP to maximum allowed per game
    const cappedXP = Math.min(xpReward, appSettings.max_xp_per_game);
    const newXP = progress.xp + cappedXP;
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

  // Check if user is premium based on XP threshold from database
  const isPremium = progress ? progress.xp >= appSettings.premium_xp_threshold : false;

  return {
    progress,
    isLoading,
    isPremium,
    premiumXpThreshold: appSettings.premium_xp_threshold,
    maxXpPerGame: appSettings.max_xp_per_game,
    updateProgress,
    addXP,
    completeGame,
    updateMood,
    addAchievement,
    refetch: fetchProgress,
    refreshSettings: fetchAppSettings,
  };
}