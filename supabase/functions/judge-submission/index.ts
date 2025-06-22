import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface UserSubmission {
  type: 'drawing' | 'writing';
  content: string;
  submittedAt: string;
  taskId: string;
}

interface StorySegment {
  id: string;
  title: string;
  text: string;
  gameType: string;
  drawingPrompt?: string;
  writingPrompt?: string;
  wordLimit?: number;
  timeLimit?: number;
}

interface AIJudgment {
  score: number;
  feedback: string;
  encouragement: string;
  improvements?: string[];
  highlights?: string[];
}

async function judgeSubmissionWithAI(submission: UserSubmission, originalTask: StorySegment): Promise<AIJudgment> {
  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const taskPrompt = submission.type === 'drawing' 
      ? originalTask.drawingPrompt 
      : originalTask.writingPrompt;

    const prompt = `
You are a friendly, encouraging AI judge for a creative app called Symbal. Your role is to provide playful, supportive feedback on user submissions.

TASK DETAILS:
- Type: ${submission.type}
- Original Prompt: "${taskPrompt}"
- Task Title: "${originalTask.title}"
- Task Description: "${originalTask.text}"

USER SUBMISSION:
${submission.type === 'writing' ? `Text: "${submission.content}"` : 'Drawing: [User submitted a drawing]'}

JUDGING GUIDELINES:
1. Be encouraging and positive - this is about creativity, not perfection
2. Use a playful, friendly tone with emojis
3. Connect your feedback to the original task and story
4. Score between 7-10 (everyone deserves encouragement!)
5. Highlight what the user did well
6. Offer gentle, constructive suggestions if appropriate
7. Make the user feel proud of their creative expression

For DRAWING submissions:
- Comment on creativity, use of colors, interpretation of prompt
- Acknowledge effort and artistic choices
- Be supportive regardless of skill level

For WRITING submissions:
- Comment on creativity, word choice, storytelling
- Acknowledge emotional expression and imagination
- Be supportive of all writing styles

Respond in this exact JSON format:
{
  "score": 8,
  "feedback": "Your ${submission.type} beautifully captures the essence of the prompt! I love how you...",
  "encouragement": "🎨 What a wonderful creative expression! Your imagination really shines through!",
  "highlights": ["Creative interpretation", "Good use of the prompt", "Unique artistic voice"],
  "improvements": ["Optional gentle suggestion if appropriate"]
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

    const judgment = JSON.parse(jsonMatch[0]);

    // Validate and sanitize the response
    return {
      score: Math.max(7, Math.min(10, judgment.score || 8)),
      feedback: judgment.feedback?.substring(0, 500) || `Your ${submission.type} shows wonderful creativity!`,
      encouragement: judgment.encouragement?.substring(0, 200) || '🎨 Amazing creative work!',
      highlights: Array.isArray(judgment.highlights) ? judgment.highlights.slice(0, 5) : ['Creative expression'],
      improvements: Array.isArray(judgment.improvements) ? judgment.improvements.slice(0, 3) : undefined
    };

  } catch (error) {
    console.error('Error judging submission with AI:', error);
    throw error;
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

    const { submission, originalTask } = await req.json()
    
    if (!submission || !originalTask) {
      return new Response(
        JSON.stringify({ error: 'submission and originalTask are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    try {
      const judgment = await judgeSubmissionWithAI(submission, originalTask);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          judgment
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } catch (error) {
      console.error('Error judging submission:', error);
      
      // Return fallback judgment
      const fallbackJudgment = generateFallbackJudgment(submission, originalTask);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI judgment failed, using fallback',
          judgment: fallbackJudgment
        }),
        { 
          status: 200, // Return 200 with fallback instead of error
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})