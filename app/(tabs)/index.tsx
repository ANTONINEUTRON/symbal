import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { initialStorySegments, generateNextStory } from '@/data/storyData';
import { StorySegment, UserProgress } from '@/types';
import StoryCard from '@/components/StoryCard';
import ThoughtModal from '@/components/ThoughtModal';
import GameModal from '@/components/GameModal';
import XPTracker from '@/components/XPTracker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StoryFeed() {
  const [storySegments, setStorySegments] = useState<StorySegment[]>(initialStorySegments);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    xp: 0,
    currentStoryIndex: 0,
    currentThought: 'adventure begins now',
    completedGames: []
  });
  const [thoughtModalVisible, setThoughtModalVisible] = useState(false);
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [currentGame, setCurrentGame] = useState<StorySegment | null>(null);

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleSwipeUp = () => {
    if (currentIndex < storySegments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Generate more story content when reaching the end
      const newStories = generateNextStory(userProgress.currentThought, currentIndex);
      setStorySegments([...storySegments, ...newStories]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      scale.value = withSpring(0.95);
    },
    onActive: (event) => {
      translateY.value = event.translationY * 0.5;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);
      
      if (event.translationY < -100 && event.velocityY < -500) {
        // Swipe up
        translateY.value = withSpring(-SCREEN_HEIGHT);
        runOnJS(handleSwipeUp)();
      } else if (event.translationY > 100 && event.velocityY > 500) {
        // Swipe down
        translateY.value = withSpring(SCREEN_HEIGHT);
        runOnJS(handleSwipeDown)();
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  // Reset animation when index changes
  useEffect(() => {
    translateY.value = 0;
  }, [currentIndex]);

  const handlePlayGame = (segment: StorySegment) => {
    setCurrentGame(segment);
    setGameModalVisible(true);
  };

  const handleGameComplete = (earnedXP: number) => {
    setUserProgress(prev => ({
      ...prev,
      xp: prev.xp + earnedXP,
      completedGames: [...prev.completedGames, currentGame?.id || '']
    }));
    setGameModalVisible(false);
    setCurrentGame(null);
  };

  const handleThoughtUpdate = (newThought: string) => {
    setUserProgress(prev => ({ ...prev, currentThought: newThought }));
    
    // Generate new story content starting from next screen
    const newStories = generateNextStory(newThought, currentIndex);
    const updatedStories = [...storySegments];
    updatedStories.splice(currentIndex + 1, updatedStories.length - currentIndex - 1, ...newStories);
    setStorySegments(updatedStories);
    
    setThoughtModalVisible(false);
  };

  const currentStory = storySegments[currentIndex];

  if (!currentStory) {
    return null;
  }

  return (
    <View style={styles.container}>
      <XPTracker 
        xp={userProgress.xp} 
        currentStoryTitle={currentStory.title}
        onThoughtPress={() => setThoughtModalVisible(true)}
      />
      
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <StoryCard
            segment={currentStory}
            onPlayGame={() => handlePlayGame(currentStory)}
            isCompleted={userProgress.completedGames.includes(currentStory.id)}
          />
        </Animated.View>
      </PanGestureHandler>

      <ThoughtModal
        visible={thoughtModalVisible}
        currentThought={userProgress.currentThought}
        onClose={() => setThoughtModalVisible(false)}
        onUpdate={handleThoughtUpdate}
      />

      {currentGame && (
        <GameModal
          visible={gameModalVisible}
          segment={currentGame}
          onClose={() => setGameModalVisible(false)}
          onComplete={handleGameComplete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  cardContainer: {
    flex: 1,
  },
});