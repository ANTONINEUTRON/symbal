import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck as CheckCircle, RotateCcw } from 'lucide-react-native';
import { gameContent } from '@/data/storyData';

interface PassagePuzzleGameProps {
  onComplete: () => void;
}

export default function PassagePuzzleGame({ onComplete }: PassagePuzzleGameProps) {
  const puzzle = gameContent['passage-puzzle'][0];
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(['', '', '']);
  const [currentBlank, setCurrentBlank] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionPress = (option: string) => {
    if (showResult || selectedAnswers.includes(option)) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentBlank] = option;
    setSelectedAnswers(newAnswers);

    if (currentBlank < puzzle.blanks.length - 1) {
      setCurrentBlank(currentBlank + 1);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
    const isCorrect = selectedAnswers.every((answer, index) => answer === puzzle.blanks[index]);
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const resetAnswers = () => {
    setSelectedAnswers(['', '', '']);
    setCurrentBlank(0);
    setShowResult(false);
  };

  const isComplete = selectedAnswers.every(answer => answer !== '');
  const isCorrect = selectedAnswers.every((answer, index) => answer === puzzle.blanks[index]);

  const renderPassage = () => {
    const parts = puzzle.passage.split('_____');
    return (
      <Text style={styles.passage}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <Text style={[
                styles.blank,
                currentBlank === index && !showResult && styles.currentBlank,
                showResult && (selectedAnswers[index] === puzzle.blanks[index] ? styles.correctBlank : styles.wrongBlank)
              ]}>
                {selectedAnswers[index] || '_____'}
              </Text>
            )}
          </React.Fragment>
        ))}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fill in the Blanks</Text>
        <TouchableOpacity onPress={resetAnswers} style={styles.resetButton}>
          <RotateCcw size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <View style={styles.passageContainer}>
        {renderPassage()}
      </View>

      {!showResult && (
        <Text style={styles.instruction}>
          Select word {currentBlank + 1} of {puzzle.blanks.length}
        </Text>
      )}

      <View style={styles.optionsContainer}>
        {puzzle.options.map((option) => {
          const isSelected = selectedAnswers.includes(option);
          const isUsed = selectedAnswers.includes(option);
          
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                isUsed && styles.usedOption
              ]}
              onPress={() => handleOptionPress(option)}
              disabled={isUsed || showResult}
            >
              <LinearGradient
                colors={isUsed ? ['#10B981', '#059669'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.15)']}
                style={styles.optionGradient}
              >
                <Text style={styles.optionText}>{option}</Text>
                {isUsed && <CheckCircle size={16} color="white" />}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      {showResult && (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultText, isCorrect ? styles.correctText : styles.wrongText]}>
            {isCorrect ? 'Perfect! All blanks filled correctly!' : 'Some answers were incorrect.'}
          </Text>
        </View>
      )}

      {isComplete && !showResult && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Submit Answers</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 8,
  },
  passageContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  passage: {
    color: 'white',
    fontSize: 18,
    lineHeight: 28,
  },
  blank: {
    color: '#8B5CF6',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  currentBlank: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: 4,
  },
  correctBlank: {
    color: '#10B981',
  },
  wrongBlank: {
    color: '#EF4444',
  },
  instruction: {
    color: '#F59E0B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  option: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  usedOption: {
    opacity: 0.6,
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
  submitButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});