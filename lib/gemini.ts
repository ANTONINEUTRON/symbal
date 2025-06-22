import { StorySegment, GameType, UserSubmission, AIJudgment } from '@/types';
import { supabase } from './supabase';

export interface StoryGenerationContext {
  mood: string;
  userExperiences?: Array<{
    title: string;
    description: string;
    content: any;
  }>;
  previousStories?: StorySegment[];
  userLevel?: number;
  completedGames?: string[];
  lastTaskTypes?: string[];
}

export interface GeneratedStory {
  title: string;
  text: string;
  gameType: GameType;
  imagePrompt: string;
  xpReward: number;
  postGameFact: string;
  drawingPrompt?: string;
  writingPrompt?: string;
  wordLimit?: number;
  colorPalette?: string[];
  timeLimit?: number;
}

const GAME_TYPES: GameType[] = ['drawing', 'writing'];

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
      imagePrompt: 'creative task scene',
      xpReward: story.xpReward,
      postGameFact: story.postGameFact,
      drawingPrompt: story.drawingPrompt,
      writingPrompt: story.writingPrompt,
      wordLimit: story.wordLimit,
      colorPalette: story.colorPalette,
      timeLimit: story.timeLimit
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
      imagePrompt: 'creative task scene',
      xpReward: story.xpReward,
      postGameFact: story.postGameFact,
      drawingPrompt: story.drawingPrompt,
      writingPrompt: story.writingPrompt,
      wordLimit: story.wordLimit,
      colorPalette: story.colorPalette,
      timeLimit: story.timeLimit
    }));

  } catch (error) {
    console.error('Error calling edge function for multiple stories:', error);
    
    // Fallback to single story generation
    const fallbackStory = generateFallbackStory(context);
    return [fallbackStory];
  }
}

// Judge user submission with AI
export async function judgeSubmissionWithAI(
  submission: UserSubmission,
  originalTask: StorySegment
): Promise<AIJudgment> {
  try {
    const { data, error } = await supabase.functions.invoke('judge-submission', {
      body: {
        submission,
        originalTask
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to judge submission');
    }

    if (!data.success || !data.judgment) {
      throw new Error('No judgment generated');
    }

    return data.judgment;

  } catch (error) {
    console.error('Error calling judge submission function:', error);
    
    // Fallback judgment
    return generateFallbackJudgment(submission, originalTask);
  }
}

function generateFallbackStory(context: StoryGenerationContext): GeneratedStory {
  const moodWords = context.mood.toLowerCase().split(' ');
  
  const themes = {
    hope: {
      title: 'Light & Inspiration',
      text: `Your mood of "${context.mood}" sparks a creative challenge.`,
      fact: '🌟 Creative expression can boost mood and reduce stress by up to 45%!'
    },
    adventure: {
      title: 'Epic Journey',
      text: `Your mood of "${context.mood}" calls for an adventurous creation.`,
      fact: '🗺️ Adventure-themed creativity enhances problem-solving skills!'
    },
    mystery: {
      title: 'Hidden Secrets',
      text: `Your mood of "${context.mood}" unveils mysterious creative possibilities.`,
      fact: '🔍 Mystery-based tasks improve analytical thinking and imagination!'
    },
    courage: {
      title: 'Brave Expression',
      text: `Your mood of "${context.mood}" demands bold creative expression.`,
      fact: '💪 Creative courage builds confidence in all areas of life!'
    }
  };

  // Find matching theme or use default
  let selectedTheme = themes.adventure;
  for (const word of moodWords) {
    if (themes[word as keyof typeof themes]) {
      selectedTheme = themes[word as keyof typeof themes];
      break;
    }
  }

  // Avoid recent task types
  const availableTypes = GAME_TYPES.filter(type => 
    !context.lastTaskTypes?.includes(type)
  );
  const gameType = availableTypes.length > 0 
    ? availableTypes[Math.floor(Math.random() * availableTypes.length)]
    : getRandomGameType();

  const baseStory = {
    title: selectedTheme.title,
    text: selectedTheme.text,
    gameType,
    imagePrompt: 'creative task scene',
    xpReward: Math.floor(Math.random() * 30) + 20,
    postGameFact: selectedTheme.fact,
    timeLimit: 15
  };

  if (gameType === 'drawing') {
    return {
      ...baseStory,
      drawingPrompt: `Draw something inspired by "${context.mood}" - let your imagination flow!`,
      colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
    };
  } else {
    return {
      ...baseStory,
      writingPrompt: `Write a short story or poem inspired by "${context.mood}". Express your creativity!`,
      wordLimit: 150
    };
  }
}

function generateFallbackJudgment(submission: UserSubmission, originalTask: StorySegment): AIJudgment {
  const encouragements = [
    "What a wonderful creative expression! 🎨",
    "Your imagination really shines through! ✨",
    "I love the creativity you've shown here! 💫",
    "This is such a unique take on the prompt! 🌟",
    "Your artistic spirit is truly inspiring! 🎭"
  ];

  const feedback = submission.type === 'drawing' 
    ? "Your drawing captures the essence of the prompt beautifully. The colors and composition work well together!"
    : "Your writing shows great creativity and emotional depth. The way you've interpreted the prompt is fascinating!";

  return {
    score: Math.floor(Math.random() * 3) + 7, // 7-10 range
    feedback,
    encouragement: encouragements[Math.floor(Math.random() * encouragements.length)],
    highlights: [
      "Creative interpretation",
      "Good use of the prompt",
      "Unique artistic voice"
    ]
  };
}

function getRandomGameType(): GameType {
  return GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
}

export function getRandomPexelsImage(): string {
  return PEXELS_IMAGES[Math.floor(Math.random() * PEXELS_IMAGES.length)];
}