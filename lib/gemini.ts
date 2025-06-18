import { GoogleGenerativeAI } from '@google/generative-ai';
import { StorySegment, GameType } from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build context for AI
    const experiencesContext = context.userExperiences?.length 
      ? `User's custom experiences: ${context.userExperiences.map(exp => `"${exp.title}": ${exp.description}`).join(', ')}`
      : '';

    const previousContext = context.previousStories?.length 
      ? `Previous story themes: ${context.previousStories.slice(-3).map(s => s.title).join(', ')}`
      : '';

    const prompt = `
You are a creative storytelling AI for an interactive story app called Symbal. Generate a compelling story segment based on the user's current thought and context.

Current user thought: "${context.currentThought}"
User level: ${context.userLevel || 1}
${experiencesContext}
${previousContext}

Requirements:
1. Create an engaging story title (max 6 words)
2. Write a captivating story description (2-3 sentences, max 150 characters)
3. Choose an appropriate game type from: ${GAME_TYPES.join(', ')}
4. Suggest XP reward (10-50 based on complexity)
5. Create an educational post-game fact related to the story theme

The story should:
- Be inspired by the user's thought: "${context.currentThought}"
- Be appropriate for all ages
- Encourage learning and growth
- Connect to the user's experiences if provided
- Be unique and avoid repetition from previous stories

Respond in this exact JSON format:
{
  "title": "Story Title Here",
  "text": "Story description here that connects to the user's thought and creates intrigue.",
  "gameType": "quiz",
  "xpReward": 25,
  "postGameFact": "🧠 Educational fact related to the story theme that teaches something valuable."
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const generatedStory = JSON.parse(jsonMatch[0]);

    // Validate and sanitize the response
    const story: GeneratedStory = {
      title: generatedStory.title?.substring(0, 50) || 'The Unexpected Journey',
      text: generatedStory.text?.substring(0, 200) || `Your thought of "${context.currentThought}" opens new possibilities.`,
      gameType: GAME_TYPES.includes(generatedStory.gameType) ? generatedStory.gameType : getRandomGameType(),
      imagePrompt: generatedStory.imagePrompt || 'mystical adventure scene',
      xpReward: Math.max(10, Math.min(50, generatedStory.xpReward || 20)),
      postGameFact: generatedStory.postGameFact?.substring(0, 300) || '🌟 Every challenge you overcome makes you stronger and more resilient!'
    };

    return story;

  } catch (error) {
    console.error('Error generating story with AI:', error);
    
    // Fallback to random generation if AI fails
    return generateFallbackStory(context);
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

// Generate multiple stories for variety
export async function generateMultipleStories(
  context: StoryGenerationContext, 
  count: number = 3
): Promise<GeneratedStory[]> {
  const stories: GeneratedStory[] = [];
  
  for (let i = 0; i < count; i++) {
    try {
      // Add slight variation to context for each story
      const variedContext = {
        ...context,
        currentThought: context.currentThought + (i > 0 ? ` (variation ${i + 1})` : '')
      };
      
      const story = await generateStoryWithAI(variedContext);
      stories.push(story);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error generating story ${i + 1}:`, error);
      stories.push(generateFallbackStory(context));
    }
  }
  
  return stories;
}