import { StorySegment, GameContent } from '@/types';

export const initialStorySegments: StorySegment[] = [
  {
    id: '1',
    title: 'The Digital Awakening',
    text: 'You find yourself in a world where thoughts become reality. Your first challenge awaits...',
    gameType: 'quiz',
    imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    xpReward: 10,
    postGameFact: '💡 Did you know? The human brain processes visual information 60,000 times faster than text. This is why storytelling with imagery is so powerful!'
  },
  {
    id: '2',
    title: 'The Truth Seeker',
    text: 'Ancient wisdom tests your ability to discern truth from fiction. Trust your instincts.',
    gameType: 'true-false',
    imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
    xpReward: 15,
    postGameFact: '🧠 Quick decisions often rely on intuition. Research shows that gut feelings can be surprisingly accurate when based on experience!'
  },
  {
    id: '3',
    title: 'Words of Power',
    text: 'The scrambled words hold the key to unlocking the next realm. Unravel their secrets.',
    gameType: 'word-scramble',
    imageUrl: 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg',
    xpReward: 20,
    postGameFact: '📚 Word games like this improve cognitive flexibility and help prevent mental decline. Keep challenging your brain!'
  },
  {
    id: '4',
    title: 'The Memory Palace',
    text: 'Match the ancient symbols with their meanings to proceed through the mystical gateway.',
    gameType: 'matching',
    imageUrl: 'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg',
    xpReward: 25,
    postGameFact: '🏛️ The "Memory Palace" technique used by ancient Greeks can improve memory by up to 40%. Try visualizing information in familiar spaces!'
  },
  {
    id: '5',
    title: 'The Lost Manuscript',
    text: 'Fill in the missing pieces of this ancient text to reveal the hidden message.',
    gameType: 'passage-puzzle',
    imageUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
    xpReward: 30,
    postGameFact: '✍️ Context clues help us understand 70% of new vocabulary. This skill transfers to real-world reading comprehension!'
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
  ],
  postGameFacts: {
    quiz: '🎯 Regular quizzing improves long-term retention by 50%. Challenge yourself daily to boost learning!',
    'true-false': '⚖️ Critical thinking skills developed through true/false exercises help you make better decisions in daily life.',
    'word-scramble': '🔤 Anagram solving activates both hemispheres of your brain, enhancing creative problem-solving abilities.',
    matching: '🔗 Pattern recognition games like matching improve your ability to see connections in complex situations.',
    'passage-puzzle': '📖 Fill-in-the-blank exercises strengthen reading comprehension and vocabulary retention.',
    crossword: '🧩 Crossword puzzles can delay memory decline and improve verbal fluency. Keep your mind sharp!',
    sudoku: '🔢 Number puzzles like Sudoku enhance logical reasoning and concentration skills.',
    'typing-race': '⌨️ Fast typing isn\'t just about speed - it frees your mind to focus on ideas rather than mechanics.'
  }
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
        xpReward: 15,
        postGameFact: '🌟 Optimistic thinking can increase lifespan by 11-15%. Your positive mindset is literally life-changing!'
      }
    ],
    fear: [
      {
        id: `fear-${Date.now()}`,
        title: 'Facing Shadows',
        text: `Your thought of "${thought}" conjures dark challenges. Face them with courage.`,
        gameType: 'true-false',
        imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
        xpReward: 20,
        postGameFact: '💪 Facing fears actually rewires your brain to be more resilient. Each challenge makes you stronger!'
      }
    ],
    love: [
      {
        id: `love-${Date.now()}`,
        title: 'The Heart\'s Journey',
        text: `Your thought of "${thought}" opens doorways to connection and understanding.`,
        gameType: 'matching',
        imageUrl: 'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg',
        xpReward: 25,
        postGameFact: '❤️ Acts of love and kindness release oxytocin, which reduces stress and promotes healing. Spread the love!'
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
      xpReward: 18,
      postGameFact: '🌊 Embracing uncertainty leads to personal growth. Every unexpected path teaches valuable lessons!'
    }
  ];
};