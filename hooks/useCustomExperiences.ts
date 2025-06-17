import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type CustomExperience = Database['public']['Tables']['custom_experiences']['Row'];
type CustomExperienceInsert = Database['public']['Tables']['custom_experiences']['Insert'];
type CustomExperienceUpdate = Database['public']['Tables']['custom_experiences']['Update'];

export function useCustomExperiences() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<CustomExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchExperiences();
    } else {
      setExperiences([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchExperiences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('custom_experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createExperience = async (experience: Omit<CustomExperienceInsert, 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('custom_experiences')
        .insert({
          ...experience,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setExperiences(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating experience:', error);
      throw error;
    }
  };

  const updateExperience = async (id: string, updates: CustomExperienceUpdate) => {
    try {
      const { data, error } = await supabase
        .from('custom_experiences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      setExperiences(prev => prev.map(exp => exp.id === id ? data : exp));
      return data;
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_experiences')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  };

  const incrementPlays = async (id: string) => {
    const experience = experiences.find(exp => exp.id === id);
    if (!experience) return;

    return updateExperience(id, {
      plays: experience.plays + 1,
    });
  };

  return {
    experiences,
    isLoading,
    createExperience,
    updateExperience,
    deleteExperience,
    incrementPlays,
    refetch: fetchExperiences,
  };
}