import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, X } from 'lucide-react-native';
import { gameContent } from '@/data/storyData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TrueFalseGameProps {
  onComplete: () => void;
}

export default function TrueFalseGame({ onComplete }: TrueFalseGameProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);

  const cards = gameContent['true-false'];
  const card = cards[currentCard];

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleAnswer = (answer: boolean) => {
    const isCorrect = answer === card.isTrue;
    setLastAnswer(answer);
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentCard < cards.length - 1) {
        setCurrentCard(currentCard + 1);
        setShowResult(false);
        setLastAnswer(null);
        translateX.value = 0;
        opacity.value = 1;
      } else {
        onComplete();
      }
    }, 1000);
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
      opacity.value = 1 - Math.abs(event.translationX) / (SCREEN_WIDTH * 0.5);
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SCREEN_WIDTH * 0.3) {
        // Swipe threshold reached
        const answer = event.translationX > 0; // Right = true, Left = false
        translateX.value = withSpring(event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH);
        opacity.value = withSpring(0);
        runOnJS(handleAnswer)(answer);
      } else {
        // Return to center
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const getResultColor = () => {
    if (!showResult || lastAnswer === null) return ['#8B5CF6', '#EC4899'];
    const isCorrect = lastAnswer === card.isTrue;
    return isCorrect ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626'];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cardNumber}>
          Card {currentCard + 1} of {cards.length}
        </Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <View style={styles.instructions}>
        <View style={styles.instructionItem}>
          <X size={20} color="#EF4444" />
          <Text style={styles.instructionText}>Swipe left for FALSE</Text>
        </View>
        <View style={styles.instructionItem}>
          <Check size={20} color="#10B981" />
          <Text style={styles.instructionText}>Swipe right for TRUE</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.card, cardStyle]}>
            <LinearGradient
              colors={getResultColor()}
              style={styles.cardGradient}
            >
              <Text style={styles.statement}>{card.statement}</Text>
              
              {showResult && (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultText}>
                    {lastAnswer === card.isTrue ? 'Correct!' : 'Wrong!'}
                  </Text>
                  <Text style={styles.answerText}>
                    Answer: {card.isTrue ? 'TRUE' : 'FALSE'}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        </PanGestureHandler>
      </View>

      <View style={styles.swipeHints}>
        <Text style={styles.swipeHint}>← FALSE</Text>
        <Text style={styles.swipeHint}>TRUE →</Text>
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
    marginBottom: 20,
  },
  cardNumber: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  score: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statement: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
  },
  resultText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: 20,
  },
  swipeHint: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});