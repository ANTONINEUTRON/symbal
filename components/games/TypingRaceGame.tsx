import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Target } from 'lucide-react-native';
import { gameContent } from '@/data/storyData';

interface TypingRaceGameProps {
  onComplete: () => void;
}

export default function TypingRaceGame({ onComplete }: TypingRaceGameProps) {
  const challenge = gameContent['typing-race'][0];
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [accuracy, setAccuracy] = useState(100);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameEnded) {
      endGame();
    }
  }, [timeLeft, gameStarted, gameEnded]);

  const handleInputChange = (text: string) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    setUserInput(text);
    
    // Calculate accuracy
    const correctChars = text.split('').filter((char, index) => 
      char === challenge.sentence[index]
    ).length;
    const currentAccuracy = correctChars / text.length * 100;
    setAccuracy(isNaN(currentAccuracy) ? 100 : Math.round(currentAccuracy));

    // Check if completed
    if (text === challenge.sentence) {
      endGame(true);
    }
  };

  const endGame = (completed = false) => {
    setGameEnded(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const getCharacterColor = (index: number) => {
    if (index >= userInput.length) return '#6B7280';
    return userInput[index] === challenge.sentence[index] ? '#10B981' : '#EF4444';
  };

  const wpm = Math.round((userInput.length / 5) / ((challenge.timeLimit - timeLeft) / 60));
  const isCompleted = userInput === challenge.sentence;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.stat}>
          <Clock size={20} color="#8B5CF6" />
          <Text style={styles.statText}>{timeLeft}s</Text>
        </View>
        <View style={styles.stat}>
          <Target size={20} color="#EC4899" />
          <Text style={styles.statText}>{accuracy}%</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.wpmLabel}>WPM</Text>
          <Text style={styles.statText}>{wpm || 0}</Text>
        </View>
      </View>

      <View style={styles.sentenceContainer}>
        <Text style={styles.sentence}>
          {challenge.sentence.split('').map((char, index) => (
            <Text
              key={index}
              style={[
                styles.character,
                { color: getCharacterColor(index) },
                index === userInput.length && !gameEnded && styles.currentCharacter
              ]}
            >
              {char}
            </Text>
          ))}
        </Text>
      </View>

      <TextInput
        style={[
          styles.input,
          gameEnded && (isCompleted ? styles.inputSuccess : styles.inputFailed)
        ]}
        value={userInput}
        onChangeText={handleInputChange}
        placeholder={gameStarted ? '' : 'Start typing to begin...'}
        placeholderTextColor="#9CA3AF"
        multiline
        editable={!gameEnded}
        autoFocus
      />

      {gameEnded && (
        <View style={styles.resultContainer}>
          <LinearGradient
            colors={isCompleted ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
            style={styles.resultGradient}
          >
            <Text style={styles.resultTitle}>
              {isCompleted ? 'Perfect!' : 'Time\'s Up!'}
            </Text>
            <Text style={styles.resultStats}>
              Final WPM: {wpm} | Accuracy: {accuracy}%
            </Text>
            {isCompleted && (
              <Text style={styles.resultBonus}>
                Bonus XP for perfect completion!
              </Text>
            )}
          </LinearGradient>
        </View>
      )}

      {!gameStarted && (
        <Text style={styles.instruction}>
          Type the sentence above as quickly and accurately as possible!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  wpmLabel: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sentenceContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sentence: {
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 1,
  },
  character: {
    fontSize: 18,
  },
  currentCharacter: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  inputSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  inputFailed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  resultContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultGradient: {
    padding: 20,
    alignItems: 'center',
  },
  resultTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultStats: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  resultBonus: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic',
  },
  instruction: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});