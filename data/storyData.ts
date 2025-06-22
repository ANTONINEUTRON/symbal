// This file now serves as a minimal data provider since all story generation is handled by AI
import { StorySegment } from '@/types';

// Fallback stories for when AI generation fails
export const fallbackStories: StorySegment[] = [
  {
    id: 'fallback-1',
    title: 'Creative Awakening',
    text: 'Your creative journey begins with a simple challenge.',
    gameType: 'drawing',
    imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
    xpReward: 20,
    postGameFact: '🎨 Creative expression enhances mental well-being and cognitive flexibility!',
    drawingPrompt: 'Draw something that makes you happy',
    colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    timeLimit: 15
  },
  {
    id: 'fallback-2',
    title: 'Words of Wonder',
    text: 'Express your thoughts through the power of written words.',
    gameType: 'writing',
    imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
    xpReward: 25,
    postGameFact: '✍️ Writing regularly improves cognitive function and emotional processing!',
    writingPrompt: 'Write about a moment that changed your perspective',
    wordLimit: 120,
    timeLimit: 12
  }
];

// Educational facts for creative tasks
export const creativeFacts = {
  drawing: [
    '🎨 Drawing activates both hemispheres of your brain, enhancing creativity and problem-solving!',
    '🖌️ Art therapy has been shown to reduce stress and anxiety by up to 45%!',
    '🌈 Using colors in art can influence mood and emotional well-being!',
    '✏️ Regular drawing practice improves hand-eye coordination and fine motor skills!'
  ],
  writing: [
    '✍️ Writing regularly improves cognitive function and emotional processing!',
    '📝 Expressive writing can boost immune system function and reduce stress!',
    '📚 Creative writing enhances empathy by helping you understand different perspectives!',
    '🧠 Writing by hand activates areas of the brain associated with learning and memory!'
  ]
};

// Color palettes for drawing tasks
export const colorPalettes = [
  ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  ['#FF9F43', '#10AC84', '#5F27CD', '#00D2D3', '#FF3838', '#FF9FF3'],
  ['#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84', '#FF3838'],
  ['#A55EEA', '#26DE81', '#FD79A8', '#FDCB6E', '#6C5CE7', '#74B9FF'],
  ['#FF7675', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894']
];

export function getRandomColorPalette(): string[] {
  return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
}

export function getRandomCreativeFact(taskType: 'drawing' | 'writing'): string {
  const facts = creativeFacts[taskType];
  return facts[Math.floor(Math.random() * facts.length)];
}