import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface StoryGenerationContext {
  mood: string;
  userExperiences?: Array<{
    title: string;
    description: string;
    content: any;
  }>;
  userLevel?: number;
  completedGames?: string[];
  lastTaskTypes?: string[];
  count?: number;
}

interface GeneratedStory {
  title: string;
  text: string;
  gameType: string;
  xpReward: number;
  postGameFact: string;
  drawingPrompt?: string;
  writingPrompt?: string;
  wordLimit?: number;
  colorPalette?: string[];
  timeLimit?: number;
}

const GAME_TYPES = ['drawing', 'writing'];

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

const COLOR_PALETTES = [
  ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  ['#FF9F43', '#10AC84', '#5F27CD', '#00D2D3', '#FF3838', '#FF9FF3'],
  ['#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84', '#FF3838'],
  ['#A55EEA', '#26DE81', '#FD79A8', '#FDCB6E', '#6C5CE7', '#74B9FF'],
  ['#FF7675', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894']
];

function getRandomGameType(excludeTypes: string[] = []): string {
  const availableTypes = GAME_TYPES.filter(type => !excludeTypes.includes(type));
  return availableTypes.length > 0 
    ? availableTypes[Math.floor(Math.random() * availableTypes.length)]
    : GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
}

function getRandomPexelsImage(): string {
  return PEXELS_IMAGES[Math.floor(Math.random() * PEXELS_IMAGES.length)];
}

function getRandomColorPalette(): string[] {
  return COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
}

async function generateStoryWithAI(context: StoryGenerationContext): Promise<GeneratedStory> {
  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Build context for AI
    const experiencesContext = context.userExperiences?.length 
      ? `User's custom experiences: ${context.userExperiences.map(exp => `"${exp.title}": ${exp.description}`).join(', ')}`
      : '';

    const lastTaskTypesContext = context.lastTaskTypes?.length
      ? `Recent task types to avoid: ${context.lastTaskTypes.join(', ')}`
      : '';

    const prompt = `
You are a creative AI for an interactive story app called Symbal. Generate a compelling creative task based on the user's current mood and context.

Current user mood: "${context.mood}"
User level: ${context.userLevel || 1}
${experiencesContext}
${lastTaskTypesContext}

Requirements:
1. Create an engaging story title (max 6 words)
2. Write a captivating story description (2-3 sentences, max 150 characters)
3. Choose a task type: either "drawing" or "writing" (avoid recent types if provided)
4. Suggest XP reward (5-10 SYM maximum - this is strictly enforced)
5. Create an educational post-game fact related to creativity

For DRAWING tasks, provide:
- drawingPrompt: A simple, straightforward instruction to draw a concrete noun or object (e.g., "draw a car", "draw a pot", "draw a tree"). Avoid adjectives or complex scenarios. Use only concrete, everyday objects that are easy to recognize and draw.
- colorPalette: Array of 6 hex colors
- timeLimit: 10-20 minutes

For WRITING tasks, provide:
- writingPrompt: A creative writing instruction. The user should be asked to write a response that is not less than 400 characters. Make this clear in the prompt.
- wordLimit: 10-400 words (flexible range to accommodate different task complexities)
- timeLimit: 10-15 minutes

The task should:
- Be inspired by the user's mood: "${context.mood}"
- Be appropriate for all ages
- Encourage creativity and self-expression
- Be achievable within the time limit
- Be unique and engaging

IMPORTANT XP REWARD GUIDELINES:
- XP rewards must be between 5-10 SYM only
- This is the maximum allowed per game to maintain balance
- Higher complexity tasks can award up to 10 SYM
- Simple tasks should award 5-7 SYM

IMPORTANT DRAWING PROMPT GUIDELINES:
- Use only concrete nouns (car, house, tree, cat, book, cup, etc.)
- Avoid adjectives like "magical", "beautiful", "mysterious"
- Keep it simple: "draw a [noun]"
- Examples: "draw a bicycle", "draw a flower", "draw a sandwich"

IMPORTANT WRITING PROMPT GUIDELINES:
- Clearly state the minimum character requirement (400 characters)
- Make the writing task engaging but achievable
- Word limit can vary from 10-400 words depending on task complexity
- Examples: "Write about your favorite memory (at least 400 characters)", "Describe a perfect day (minimum 400 characters)"

Respond in this exact JSON format:
{
  "title": "Creative Task Title",
  "text": "Story description that connects to the user's mood and introduces the creative challenge.",
  "gameType": "drawing",
  "xpReward": 8,
  "postGameFact": "🎨 Educational fact about creativity, art, or self-expression.",
  "drawingPrompt": "draw a car",
  "colorPalette": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
  "timeLimit": 15
}

OR for writing tasks:

{
  "title": "Creative Writing Challenge",
  "text": "Story description that connects to the user's mood and introduces the writing challenge.",
  "gameType": "writing",
  "xpReward": 7,
  "postGameFact": "✍️ Educational fact about writing, storytelling, or creativity.",
  "writingPrompt": "Write about your favorite place (at least 400 characters)",
  "wordLimit": 150,
  "timeLimit": 12
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

    // Validate and sanitize the response with strict XP capping
    const story: GeneratedStory = {
      title: generatedStory.title?.substring(0, 50) || 'Creative Challenge',
      text: generatedStory.text?.substring(0, 200) || `Your mood of "${context.mood}" inspires a creative task.`,
      gameType: GAME_TYPES.includes(generatedStory.gameType) ? generatedStory.gameType : getRandomGameType(context.lastTaskTypes),
      xpReward: Math.max(5, Math.min(10, generatedStory.xpReward || 8)), // Strict 5-10 SYM cap
      postGameFact: generatedStory.postGameFact?.substring(0, 300) || '🎨 Creative expression enhances mental well-being and cognitive flexibility!',
      timeLimit: Math.max(5, Math.min(30, generatedStory.timeLimit || 15))
    };

    // Add task-specific properties with enhanced validation
    if (story.gameType === 'drawing') {
      // Ensure drawing prompt is simple and concrete
      let drawingPrompt = generatedStory.drawingPrompt?.substring(0, 200) || `draw a house`;
      
      // Basic validation to ensure it starts with "draw a/an" and is simple
      if (!drawingPrompt.toLowerCase().startsWith('draw a') && !drawingPrompt.toLowerCase().startsWith('draw an')) {
        drawingPrompt = `draw a ${drawingPrompt.replace(/^draw\s*/i, '').toLowerCase()}`;
      }
      
      story.drawingPrompt = drawingPrompt;
      story.colorPalette = Array.isArray(generatedStory.colorPalette) && generatedStory.colorPalette.length === 6
        ? generatedStory.colorPalette
        : getRandomColorPalette();
    } else if (story.gameType === 'writing') {
      // Ensure writing prompt mentions character requirement
      let writingPrompt = generatedStory.writingPrompt?.substring(0, 200) || `Write about something that makes you happy (at least 400 characters)`;
      
      // Add character requirement if not present
      if (!writingPrompt.includes('400 characters') && !writingPrompt.includes('at least 400')) {
        writingPrompt += ' (at least 400 characters)';
      }
      
      story.writingPrompt = writingPrompt;
      story.wordLimit = Math.max(10, Math.min(400, generatedStory.wordLimit || 100));
    }

    return story;

  } catch (error) {
    console.error('Error generating story with AI:', error);
    throw error;
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

  const gameType = getRandomGameType(context.lastTaskTypes);

  // Simple concrete objects for drawing fallbacks
  const simpleObjects = ['car', 'tree', 'house', 'cat', 'book', 'cup', 'flower', 'bird', 'chair', 'apple'];
  const randomObject = simpleObjects[Math.floor(Math.random() * simpleObjects.length)];

  const baseStory = {
    title: selectedTheme.title,
    text: selectedTheme.text,
    gameType,
    xpReward: Math.floor(Math.random() * 6) + 5, // 5-10 SYM range
    postGameFact: selectedTheme.fact,
    timeLimit: 15
  };

  if (gameType === 'drawing') {
    return {
      ...baseStory,
      drawingPrompt: `draw a ${randomObject}`,
      colorPalette: getRandomColorPalette()
    };
  } else {
    return {
      ...baseStory,
      writingPrompt: `Write about something that makes you feel "${context.mood}" (at least 400 characters)`,
      wordLimit: Math.floor(Math.random() * 391) + 10 // 10-400 words range
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const context: StoryGenerationContext = await req.json()
    
    if (!context.mood) {
      return new Response(
        JSON.stringify({ error: 'mood is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const count = context.count || 1;
    const stories: GeneratedStory[] = [];

    for (let i = 0; i < count; i++) {
      try {
        // Add slight variation to context for each story
        const variedContext = {
          ...context,
          mood: context.mood + (i > 0 ? ` (variation ${i + 1})` : '')
        };
        
        const story = await generateStoryWithAI(variedContext);
        stories.push(story);
        
        // Small delay to avoid rate limiting
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error generating story ${i + 1}:`, error);
        stories.push(generateFallbackStory(context));
      }
    }

    // Add image URLs to stories
    const storiesWithImages = stories.map((story, index) => ({
      ...story,
      imageUrl: getRandomPexelsImage(),
      id: `ai-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        stories: storiesWithImages,
        count: stories.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    
    // Return fallback story on error
    const fallbackStory = generateFallbackStory({ 
      mood: 'creative inspiration' 
    });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'AI generation failed, using fallback',
        stories: [{
          ...fallbackStory,
          imageUrl: getRandomPexelsImage(),
          id: `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }]
      }),
      { 
        status: 200, // Return 200 with fallback instead of error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})