export type GameType = 'drawing' | 'writing';

export interface StorySegment {
  id: string;
  title: string;
  text: string;
  gameType: GameType;
  imageUrl?: string;
  xpReward: number;
  postGameFact?: string;
  // Creative task specific properties
  drawingPrompt?: string;
  writingPrompt?: string;
  wordLimit?: number;
  colorPalette?: string[];
  timeLimit?: number; // in minutes
}

export interface DrawingTask {
  prompt: string;
  colorPalette: string[];
  timeLimit: number;
  canvasSize: { width: number; height: number };
}

export interface WritingTask {
  prompt: string;
  wordLimit: number;
  timeLimit: number;
  genre?: string;
}

export interface UserSubmission {
  type: 'drawing' | 'writing';
  content: string; // SVG string for drawing, text for writing
  submittedAt: string;
  taskId: string;
}

export interface AIJudgment {
  score: number; // 1-10
  feedback: string;
  encouragement: string;
  improvements?: string[];
  highlights?: string[];
}

export interface UserProgress {
  xp: number;
  currentStoryIndex: number;
  mood: string;
  completedGames: string[];
  lastTaskTypes: string[];
}

// Remove old game interfaces - they're no longer needed
export interface GameContent {
  postGameFacts?: Partial<Record<GameType, string>>;
}