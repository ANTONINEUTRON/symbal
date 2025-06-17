import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Modal } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { initialStorySegments, generateNextStory, gameContent } from '@/data/storyData';
import { StorySegment } from '@/types';
import StoryCard from '@/components/StoryCard';
import ThoughtModal from '@/components/ThoughtModal';
import GameModal from '@/components/GameModal';
import XPTracker from '@/components/XPTracker';
import PostGameInfoModal from '../components/PostGameInfoModal';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/contexts/AuthContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StoryFeed() {
  const { isSignedIn } = useAuth();
  const { progress, completeGame, updateThought } = useUserProgress();
  
  const [storySegments, setStorySegments] = useState<StorySegment[]>(initialStorySegments);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thoughtModalVisible, setThoughtModalVisible] = useState(false);
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [currentGame, setCurrentGame] = useState<StorySegment | null>(null);

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Use progress from Supabase if signed in, otherwise use local state
  const currentXP = isSignedIn ? (progress?.xp || 0) : 0;
  const currentThought = isSignedIn ? (progress?.current_thought || 'adventure begins now') : 'adventure begins now';
  const completedGames = isSignedIn ? (progress?.completed_games || []) : [];

  const handleSwipeUp = () => {
    if (currentIndex < storySegments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Generate more story content when reaching the end
      const newStories = generateNextStory(currentThought, currentIndex);
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

  const handleShowInfo = (segment: StorySegment) => {
    setCurrentGame(segment);
    setInfoModalVisible(true);
  };

  const handleGameComplete = async (earnedXP: number) => {
    if (currentGame) {
      if (isSignedIn) {
        try {
          await completeGame(currentGame.id, earnedXP);
        } catch (error) {
          console.error('Error saving game completion:', error);
        }
      }
    }
    setGameModalVisible(false);
    setCurrentGame(null);
  };

  const handleThoughtUpdate = async (newThought: string) => {
    if (isSignedIn) {
      try {
        await updateThought(newThought);
      } catch (error) {
        console.error('Error updating thought:', error);
      }
    }
    
    // Generate new story content starting from next screen
    const newStories = generateNextStory(newThought, currentIndex);
    const updatedStories = [...storySegments];
    updatedStories.splice(currentIndex + 1, updatedStories.length - currentIndex - 1, ...newStories);
    setStorySegments(updatedStories);
    
    setThoughtModalVisible(false);
  };

  const currentStory = storySegments[currentIndex];
  const isCompleted = completedGames.includes(currentStory?.id);

  if (!currentStory) {
    return null;
  }

  return (
    <View style={styles.container}>
      <XPTracker 
        xp={currentXP} 
        currentStoryTitle={currentStory.title}
        onThoughtPress={() => setThoughtModalVisible(true)}
      />
      
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <StoryCard
            segment={currentStory}
            onPlayGame={() => handlePlayGame(currentStory)}
            onShowInfo={() => handleShowInfo(currentStory)}
            isCompleted={isCompleted}
          />
        </Animated.View>
      </PanGestureHandler>

      <ThoughtModal
        visible={thoughtModalVisible}
        currentThought={currentThought}
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

      {currentGame && (
        <PostGameInfoModal
          visible={infoModalVisible}
          segment={currentGame}
          onClose={() => setInfoModalVisible(false)}
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