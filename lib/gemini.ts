import { StorySegment, GameType } from '@/types';
import { supabase } from './supabase';

export interface StoryGenerationContext {
  currentThought: string;
  userExperiences?: Array<{
    title: string;
    description: string;
    content: any;
  }>;
  previousStories?: StorySegment[];
  userLevel?: number;
  completedGames?: string[];
}

export interface GeneratedStory {
  title: string;
  text: string;
  gameType: GameType;
  imagePrompt: string;
  xpReward: number;
  postGameFact: string;
}

const GAME_TYPES: GameType[] = [
  'quiz',
  'true-false',
  'word-scramble',
  'matching',
  'passage-puzzle',
  'typing-race'
];

const PEXELS_IMAGES = [
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
  'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
  'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg',
  'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg',
  'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
  'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
  'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg',
  'https://images.pexels.com/photos/1181723/pexels-photo-1181723.jpeg',
  'https://images.pexels.com/photos/1181319/pexels-photo-1181319.jpeg'
];

export async function generateStoryWithAI(context: StoryGenerationContext): Promise<GeneratedStory> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-story', {
      body: {
        ...context,
        count: 1
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to generate story');
    }

    if (!data.success || !data.stories || data.stories.length === 0) {
      throw new Error('No stories generated');
    }

    const story = data.stories[0];
    
    return {
      title: story.title,
      text: story.text,
      gameType: story.gameType as GameType,
      imagePrompt: 'mystical adventure scene',
      xpReward: story.xpReward,
      postGameFact: story.postGameFact
    };

  } catch (error) {
    console.error('Error calling edge function:', error);
    
    // Fallback to local generation if edge function fails
    return generateFallbackStory(context);
  }
}

// Generate multiple stories for variety
export async function generateMultipleStories(
  context: StoryGenerationContext, 
  count: number = 3
): Promise<GeneratedStory[]> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-story', {
      body: {
        ...context,
        count
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to generate stories');
    }

    if (!data.success || !data.stories) {
      throw new Error('No stories generated');
    }

    return data.stories.map((story: any) => ({
      title: story.title,
      text: story.text,
      gameType: story.gameType as GameType,
      imagePrompt: 'mystical adventure scene',
      xpReward: story.xpReward,
      postGameFact: story.postGameFact
    }));

  } catch (error) {
    console.error('Error calling edge function for multiple stories:', error);
    
    // Fallback to single story generation
    const fallbackStory = generateFallbackStory(context);
    return [fallbackStory];
  }
}

function generateFallbackStory(context: StoryGenerationContext): GeneratedStory {
  const thoughtWords = context.currentThought.toLowerCase().split(' ');
  
  const themes = {
    hope: {
      title: 'The Light Bearer',
      text: `Your thought of "${context.currentThought}" illuminates a path forward.`,
      fact: '🌟 Optimistic thinking can increase lifespan by 11-15%. Your positive mindset is literally life-changing!'
    },
    adventure: {
      title: 'The Quest Begins',
      text: `Your thought of "${context.currentThought}" sparks an epic journey.`,
      fact: '🗺️ Adventure activities boost creativity by 50%. Embrace the unknown!'
    },
    mystery: {
      title: 'Secrets Unveiled',
      text: `Your thought of "${context.currentThought}" reveals hidden mysteries.`,
      fact: '🔍 Curiosity activates the brain\'s reward system, making learning more enjoyable!'
    },
    courage: {
      title: 'Brave New World',
      text: `Your thought of "${context.currentThought}" demands courage to proceed.`,
      fact: '💪 Facing fears actually rewires your brain to be more resilient!'
    }
  };

  // Find matching theme or use default
  let selectedTheme = themes.adventure;
  for (const word of thoughtWords) {
    if (themes[word as keyof typeof themes]) {
      selectedTheme = themes[word as keyof typeof themes];
      break;
    }
  }

  return {
    title: selectedTheme.title,
    text: selectedTheme.text,
    gameType: getRandomGameType(),
    imagePrompt: 'mystical adventure scene',
    xpReward: Math.floor(Math.random() * 30) + 15,
    postGameFact: selectedTheme.fact
  };
}

function getRandomGameType(): GameType {
  return GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
}

export function getRandomPexelsImage(): string {
  return PEXELS_IMAGES[Math.floor(Math.random() * PEXELS_IMAGES.length)];
}