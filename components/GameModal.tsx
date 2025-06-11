import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { StorySegment } from '@/types';
import QuizGame from '@/components/games/QuizGame';
import TrueFalseGame from '@/components/games/TrueFalseGame';
import WordScrambleGame from '@/components/games/WordScrambleGame';
import MatchingGame from '@/components/games/MatchingGame';
import PassagePuzzleGame from '@/components/games/PassagePuzzleGame';
import PlaceholderGame from '@/components/games/PlaceholderGame';
import TypingRaceGame from '@/components/games/TypingRaceGame';

interface GameModalProps {
  visible: boolean;
  segment: StorySegment;
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export default function GameModal({ visible, segment, onClose, onComplete }: GameModalProps) {
  const renderGame = () => {
    switch (segment.gameType) {
      case 'quiz':
        return <QuizGame onComplete={() => onComplete(segment.xpReward)} />;
      case 'true-false':
        return <TrueFalseGame onComplete={() => onComplete(segment.xpReward)} />;
      case 'word-scramble':
        return <WordScrambleGame onComplete={() => onComplete(segment.xpReward)} />;
      case 'matching':
        return <MatchingGame onComplete={() => onComplete(segment.xpReward)} />;
      case 'passage-puzzle':
        return <PassagePuzzleGame onComplete={() => onComplete(segment.xpReward)} />;
      case 'crossword':
        return <PlaceholderGame gameType="Crossword" onComplete={() => onComplete(segment.xpReward)} />;
      case 'sudoku':
        return <PlaceholderGame gameType="Sudoku" onComplete={() => onComplete(segment.xpReward)} />;
      case 'typing-race':
        return <TypingRaceGame onComplete={() => onComplete(segment.xpReward)} />;
      default:
        return <PlaceholderGame gameType="Unknown" onComplete={() => onComplete(segment.xpReward)} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{segment.title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.gameContainer}>
          {renderGame()}
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  gameContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});