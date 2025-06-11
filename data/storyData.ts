import { StorySegment, GameContent } from '@/types';

export const initialStorySegments: StorySegment[] = [
  {
    id: '1',
    title: 'The Digital Awakening',
    text: 'You find yourself in a world where thoughts become reality. Your first challenge awaits...',
    gameType: 'quiz',
    imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    xpReward: 10
  },
  {
    id: '2',
    title: 'The Truth Seeker',
    text: 'Ancient wisdom tests your ability to discern truth from fiction. Trust your instincts.',
    gameType: 'true-false',
    imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
    xpReward: 15
  },
  {
    id: '3',
    title: 'Words of Power',
    text: 'The scrambled words hold the key to unlocking the next realm. Unravel their secrets.',
    gameType: 'word-scramble',
    imageUrl: 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg',
    xpReward: 20
  },
  {
    id: '4',
    title: 'The Memory Palace',
    text: 'Match the ancient symbols with their meanings to proceed through the mystical gateway.',
    gameType: 'matching',
    imageUrl: 'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg',
    xpReward: 25
  },
  {
    id: '5',
    title: 'The Lost Manuscript',
    text: 'Fill in the missing pieces of this ancient text to reveal the hidden message.',
    gameType: 'passage-puzzle',
    imageUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
    xpReward: 30
  }
];

export const gameContent: GameContent = {
  quiz: [
    {
      question: 'What fuels creativity in the digital age?',
      options: ['Fear', 'Curiosity', 'Anger', 'Boredom'],
      correctAnswer: 1
    },
    {
      question: 'Which element is most powerful in storytelling?',
      options: ['Plot', 'Character', 'Emotion', 'Setting'],
      correctAnswer: 2
    }
  ],
  'true-false': [
    { statement: 'Innovation comes from comfort zones', isTrue: false },
    { statement: 'Every ending is a new beginning', isTrue: true },
    { statement: 'Wisdom grows through experience', isTrue: true },
    { statement: 'Perfect plans never fail', isTrue: false }
  ],
  'word-scramble': [
    { word: 'CREATIVITY', scrambled: 'YTIVITAERC', hint: 'The spark of imagination' },
    { word: 'JOURNEY', scrambled: 'YENRUOJ', hint: 'A path of discovery' },
    { word: 'WISDOM', scrambled: 'MODSIW', hint: 'Knowledge through experience' }
  ],
  matching: [
    { term: 'Courage', definition: 'Acting despite fear' },
    { term: 'Wisdom', definition: 'Applied knowledge' },
    { term: 'Growth', definition: 'Continuous evolution' },
    { term: 'Purpose', definition: 'Reason for being' }
  ],
  'passage-puzzle': [
    {
      passage: 'The greatest _____ in life come from embracing the _____. When we step into the _____, we discover our true potential.',
      blanks: ['adventures', 'unknown', 'darkness'],
      options: ['adventures', 'unknown', 'darkness', 'fear', 'light', 'comfort']
    }
  ],
  crossword: {
    imageUrl: 'https://images.pexels.com/photos/1181319/pexels-photo-1181319.jpeg'
  },
  sudoku: {
    imageUrl: 'https://images.pexels.com/photos/1181318/pexels-photo-1181318.jpeg'
  },
  'typing-race': [
    { sentence: 'The quick brown fox jumps over the lazy dog', timeLimit: 15 },
    { sentence: 'Innovation distinguishes between a leader and a follower', timeLimit: 20 }
  ]
};

export const generateNextStory = (thought: string, currentIndex: number): StorySegment[] => {
  const thoughtWords = thought.toLowerCase().split(' ').filter(word => word.length > 0);
  
  const themes: Record<string, StorySegment[]> = {
    hope: [
      {
        id: `hope-${Date.now()}`,
        title: 'The Light Bearer',
        text: `Your thought of "${thought}" illuminates a new path forward. Hope guides your steps.`,
        gameType: 'quiz',
        imageUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
        xpReward: 15
      }
    ],
    fear: [
      {
        id: `fear-${Date.now()}`,
        title: 'Facing Shadows',
        text: `Your thought of "${thought}" conjures dark challenges. Face them with courage.`,
        gameType: 'true-false',
        imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
        xpReward: 20
      }
    ],
    love: [
      {
        id: `love-${Date.now()}`,
        title: 'The Heart\'s Journey',
        text: `Your thought of "${thought}" opens doorways to connection and understanding.`,
        gameType: 'matching',
        imageUrl: 'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg',
        xpReward: 25
      }
    ]
  };

  // Check if any thought words match our themes
  for (const word of thoughtWords) {
    if (themes[word]) {
      return themes[word];
    }
  }

  // Default story continuation
  return [
    {
      id: `custom-${Date.now()}`,
      title: 'The Unexpected Path',
      text: `Your thought of "${thought}" creates ripples in the fabric of reality. New challenges emerge.`,
      gameType: ['quiz', 'word-scramble', 'matching'][Math.floor(Math.random() * 3)] as any,
      imageUrl: 'https://images.pexels.com/photos/1181723/pexels-photo-1181723.jpeg',
      xpReward: 18
    }
  ];
};