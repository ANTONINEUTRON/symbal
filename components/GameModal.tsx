import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Lightbulb, ArrowRight } from 'lucide-react-native';
import { StorySegment } from '@/types';
import { gameContent } from '@/data/storyData';
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
  const [showPostGameInfo, setShowPostGameInfo] = useState(false);
  const [postGameMessage, setPostGameMessage] = useState('');

  const handleGameComplete = () => {
    // Get the post-game fact
    const fact = segment.postGameFact || 
                 gameContent.postGameFacts?.[segment.gameType] || 
                 '🎉 Great job! You\'re building valuable cognitive skills with every game you play.';
    
    setPostGameMessage(fact);
    setShowPostGameInfo(true);
    
    // Hide the post-game info after 3 seconds and complete the game
    setTimeout(() => {
      setShowPostGameInfo(false);
      onComplete(segment.xpReward);
    }, 3000);
  };

  const handleContinue = () => {
    setShowPostGameInfo(false);
    onComplete(segment.xpReward);
  };

  const renderGame = () => {
    switch (segment.gameType) {
      case 'quiz':
        return <QuizGame onComplete={handleGameComplete} />;
      case 'true-false':
        return <TrueFalseGame onComplete={handleGameComplete} />;
      case 'word-scramble':
        return <WordScrambleGame onComplete={handleGameComplete} />;
      case 'matching':
        return <MatchingGame onComplete={handleGameComplete} />;
      case 'passage-puzzle':
        return <PassagePuzzleGame onComplete={handleGameComplete} />;
      case 'crossword':
        return <PlaceholderGame gameType="Crossword" onComplete={handleGameComplete} />;
      case 'sudoku':
        return <PlaceholderGame gameType="Sudoku" onComplete={handleGameComplete} />;
      case 'typing-race':
        return <TypingRaceGame onComplete={handleGameComplete} />;
      default:
        return <PlaceholderGame gameType="Unknown" onComplete={handleGameComplete} />;
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

        {/* Post-Game Information Overlay */}
        {showPostGameInfo && (
          <View style={styles.postGameOverlay}>
            <View style={styles.postGameContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899', '#F59E0B']}
                style={styles.postGameGradient}
              >
                <View style={styles.postGameContent}>
                  <View style={styles.postGameHeader}>
                    <Lightbulb size={32} color="white" />
                    <Text style={styles.postGameTitle}>Did You Know?</Text>
                  </View>
                  
                  <Text style={styles.postGameText}>
                    {postGameMessage}
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.continueButton}
                    onPress={handleContinue}
                  >
                    <View style={styles.continueButtonContent}>
                      <Text style={styles.continueButtonText}>Continue Journey</Text>
                      <ArrowRight size={20} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        )}
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
  postGameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  postGameContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  postGameGradient: {
    padding: 32,
  },
  postGameContent: {
    alignItems: 'center',
  },
  postGameHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  postGameTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  postGameText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});