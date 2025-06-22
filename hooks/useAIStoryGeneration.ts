import { useState } from 'react';
import { generateStoryWithAI, generateMultipleStories } from '@/lib/gemini';
import { StorySegment } from '@/types';
import { useCustomExperiences } from './useCustomExperiences';
import { useUserProgress } from './useUserProgress';

export function useAIStoryGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { experiences } = useCustomExperiences();
  const { progress } = useUserProgress();

  const generateStory = async (
    mood: string,
    currentIndex: number
  ): Promise<StorySegment[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      const stories = await generateStoryWithAI({
        mood,
        userExperiences: experiences,
        userLevel: progress?.level,
        completedGames: progress?.completed_games,
        lastTaskTypes: progress?.last_task_types,
      });

      return [{
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: stories.title,
        text: stories.text,
        gameType: stories.gameType,
        imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        xpReward: stories.xpReward,
        postGameFact: stories.postGameFact,
        drawingPrompt: stories.drawingPrompt,
        writingPrompt: stories.writingPrompt,
        wordLimit: stories.wordLimit,
        colorPalette: stories.colorPalette,
        timeLimit: stories.timeLimit,
      }];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate story';
      setError(errorMessage);
      console.error('Story generation error:', err);
      
      // Return fallback story
      return [{
        id: `fallback-${Date.now()}`,
        title: 'Creative Expression',
        text: `Your mood of "${mood}" inspires a new creative challenge.`,
        gameType: Math.random() > 0.5 ? 'drawing' : 'writing',
        imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        xpReward: 25,
        postGameFact: '🎨 Creative expression enhances mental well-being and cognitive flexibility!',
        drawingPrompt: `Draw something inspired by "${mood}"`,
        writingPrompt: `Write about "${mood}" and what it means to you`,
        wordLimit: 100,
        colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
        timeLimit: 15,
      }];
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMultipleStoriesFunc = async (
    mood: string,
    currentIndex: number,
    count: number = 3
  ): Promise<StorySegment[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      const stories = await generateMultipleStories({
        mood,
        userExperiences: experiences,
        userLevel: progress?.level,
        completedGames: progress?.completed_games,
        lastTaskTypes: progress?.last_task_types,
      }, count);

      return stories.map((story, index) => ({
        id: `ai-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        title: story.title,
        text: story.text,
        gameType: story.gameType,
        imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        xpReward: story.xpReward,
        postGameFact: story.postGameFact,
        drawingPrompt: story.drawingPrompt,
        writingPrompt: story.writingPrompt,
        wordLimit: story.wordLimit,
        colorPalette: story.colorPalette,
        timeLimit: story.timeLimit,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate stories';
      setError(errorMessage);
      console.error('Multiple story generation error:', err);
      
      // Return single fallback story
      return [{
        id: `fallback-${Date.now()}`,
        title: 'Creative Expression',
        text: `Your mood of "${mood}" inspires a new creative challenge.`,
        gameType: Math.random() > 0.5 ? 'drawing' : 'writing',
        imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        xpReward: 25,
        postGameFact: '🎨 Creative expression enhances mental well-being and cognitive flexibility!',
        drawingPrompt: `Draw something inspired by "${mood}"`,
        writingPrompt: `Write about "${mood}" and what it means to you`,
        wordLimit: 100,
        colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
        timeLimit: 15,
      }];
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateStory,
    generateMultipleStories: generateMultipleStoriesFunc,
    isGenerating,
    error,
    clearError: () => setError(null)
  };
}