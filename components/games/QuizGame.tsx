import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { gameContent } from '@/data/storyData';

interface QuizGameProps {
  onComplete: () => void;
}

export default function QuizGame({ onComplete }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = gameContent.quiz;
  const question = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        onComplete();
      }
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionNumber}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          let buttonStyle = styles.option;
          let colors = ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.15)'];
          
          if (showResult) {
            if (index === question.correctAnswer) {
              colors = ['#10B981', '#059669'];
            } else if (index === selectedAnswer && index !== question.correctAnswer) {
              colors = ['#EF4444', '#DC2626'];
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <LinearGradient colors={colors} style={styles.optionGradient}>
                <Text style={styles.optionText}>{option}</Text>
                {showResult && (
                  <View style={styles.resultIcon}>
                    {index === question.correctAnswer ? (
                      <CheckCircle size={20} color="white" />
                    ) : index === selectedAnswer ? (
                      <XCircle size={20} color="white" />
                    ) : null}
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
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
  questionNumber: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  score: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  question: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  resultIcon: {
    marginLeft: 12,
  },
});