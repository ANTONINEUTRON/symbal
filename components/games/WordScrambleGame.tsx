import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shuffle, CircleCheck as CheckCircle, Lightbulb } from 'lucide-react-native';
import { gameContent } from '@/data/storyData';

interface WordScrambleGameProps {
  onComplete: () => void;
}

export default function WordScrambleGame({ onComplete }: WordScrambleGameProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const words = gameContent['word-scramble'];
  const word = words[currentWord];

  const handleSubmit = () => {
    const isCorrect = userInput.toUpperCase() === word.word;
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentWord < words.length - 1) {
        setCurrentWord(currentWord + 1);
        setUserInput('');
        setShowHint(false);
        setShowResult(false);
      } else {
        onComplete();
      }
    }, 2000);
  };

  const isCorrect = userInput.toUpperCase() === word.word;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.wordNumber}>
          Word {currentWord + 1} of {words.length}
        </Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <View style={styles.gameArea}>
        <Text style={styles.scrambledWord}>{word.scrambled}</Text>
        
        <TouchableOpacity
          style={styles.hintButton}
          onPress={() => setShowHint(!showHint)}
        >
          <Lightbulb size={16} color="#F59E0B" />
          <Text style={styles.hintButtonText}>Hint</Text>
        </TouchableOpacity>

        {showHint && (
          <Text style={styles.hint}>{word.hint}</Text>
        )}

        <TextInput
          style={[
            styles.input,
            showResult && (isCorrect ? styles.inputCorrect : styles.inputWrong)
          ]}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Unscramble the word..."
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          editable={!showResult}
        />

        {showResult && (
          <View style={styles.resultContainer}>
            <View style={styles.resultIcon}>
              {isCorrect ? (
                <CheckCircle size={32} color="#10B981" />
              ) : (
                <Text style={styles.correctAnswer}>Answer: {word.word}</Text>
              )}
            </View>
            <Text style={[styles.resultText, isCorrect ? styles.correctText : styles.wrongText]}>
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, (!userInput.trim() || showResult) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!userInput.trim() || showResult}
        >
          <LinearGradient
            colors={userInput.trim() && !showResult ? ['#8B5CF6', '#EC4899'] : ['#6B7280', '#4B5563']}
            style={styles.submitButtonGradient}
          >
            <Shuffle size={20} color="white" />
            <Text style={styles.submitButtonText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  wordNumber: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  score: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrambledWord: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 24,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  hintButtonText: {
    color: '#F59E0B',
    marginLeft: 8,
    fontSize: 14,
  },
  hint: {
    color: '#F59E0B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    width: '100%',
    marginBottom: 24,
  },
  inputCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  inputWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultIcon: {
    marginBottom: 8,
  },
  correctAnswer: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  correctText: {
    color: '#10B981',
  },
  wrongText: {
    color: '#EF4444',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});