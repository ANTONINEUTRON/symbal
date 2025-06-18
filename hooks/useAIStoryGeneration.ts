import { useState } from 'react';
import { generateNextStory, generateMultipleNextStories } from '@/data/storyData';
import { StorySegment } from '@/types';
import { useCustomExperiences } from './useCustomExperiences';
import { useUserProgress } from './useUserProgress';

export function useAIStoryGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { experiences } = useCustomExperiences();
  const { progress } = useUserProgress();

  const generateStory = async (
    thought: string,
    currentIndex: number
  ): Promise<StorySegment[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      const stories = await generateNextStory(
        thought,
        currentIndex,
        experiences,
        progress?.level,
        progress?.completed_games
      );

      return stories;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate story';
      setError(errorMessage);
      console.error('Story generation error:', err);
      
      // Return fallback story
      return [{
        id: `fallback-${Date.now()}`,
        title: 'The Continuing Journey',
        text: `Your thought of "${thought}" opens new possibilities ahead.`,
        gameType: 'quiz',
        imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        xpReward: 15,
        postGameFact: '🌟 Every challenge is an opportunity to grow stronger and wiser!'
      }];
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMultipleStories = async (
    thought: string,
    currentIndex: number,
    count: number = 3
  ): Promise<StorySegment[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      const stories = await generateMultipleNextStories(
        thought,
        currentIndex,
        experiences,
        progress?.level,
        progress?.completed_games,
        count
      );

      return stories;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate stories';
      setError(errorMessage);
      console.error('Multiple story generation error:', err);
      
      // Return single fallback story
      return [{
        id: `fallback-${Date.now()}`,
        title: 'The Continuing Journey',
        text: `Your thought of "${thought}" opens new possibilities ahead.`,
        gameType: 'quiz',
        imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        xpReward: 15,
        postGameFact: '🌟 Every challenge is an opportunity to grow stronger and wiser!'
      }];
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateStory,
    generateMultipleStories,
    isGenerating,
    error,
    clearError: () => setError(null)
  };
}