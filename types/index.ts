export type GameType = 
  | 'quiz'
  | 'true-false'
  | 'word-scramble'
  | 'matching'
  | 'passage-puzzle'
  | 'crossword'
  | 'sudoku'
  | 'typing-race';

export interface StorySegment {
  id: string;
  title: string;
  text: string;
  gameType: GameType;
  imageUrl?: string;
  xpReward: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TrueFalseCard {
  statement: string;
  isTrue: boolean;
}

export interface WordScramble {
  word: string;
  scrambled: string;
  hint: string;
}

export interface MatchingPair {
  term: string;
  definition: string;
}

export interface PassagePuzzle {
  passage: string;
  blanks: string[];
  options: string[];
}

export interface TypingRace {
  sentence: string;
  timeLimit: number;
}

export interface GameContent {
  quiz: QuizQuestion[];
  'true-false': TrueFalseCard[];
  'word-scramble': WordScramble[];
  matching: MatchingPair[];
  'passage-puzzle': PassagePuzzle[];
  crossword: { imageUrl: string };
  sudoku: { imageUrl: string };
  'typing-race': TypingRace[];
}

export interface UserProgress {
  xp: number;
  currentStoryIndex: number;
  currentThought: string;
  completedGames: string[];
}