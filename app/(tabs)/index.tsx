import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { initialStorySegments } from '@/data/storyData';
import { StorySegment } from '@/types';
import StoryCard from '@/components/StoryCard';
import ThoughtModal from '@/components/ThoughtModal';
import GameModal from '@/components/GameModal';
import XPTracker from '@/components/XPTracker';
import PostGameInfoModal from '@/components/PostGameInfoModal';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/contexts/AuthContext';
import { useAIStoryGeneration } from '@/hooks/useAIStoryGeneration';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StoryFeed() {
  const { isSignedIn } = useAuth();
  const { progress, completeGame, updateThought } = useUserProgress();
  const { generateStory, isGenerating, error } = useAIStoryGeneration();
  
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

  // Show error if AI generation fails
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Story Generation',
        'Using offline mode. Connect to internet for AI-powered stories.',
        [{ text: 'OK' }]
      );
    }
  }, [error]);

  const handleSwipeUp = async () => {
    if (currentIndex < storySegments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Generate more story content when reaching the end
      try {
        const newStories = await generateStory(currentThought, currentIndex);
        setStorySegments([...storySegments, ...newStories]);
        setCurrentIndex(currentIndex + 1);
      } catch (err) {
        console.error('Error generating new story:', err);
        // Fallback to basic story if AI fails
        const fallbackStory: StorySegment = {
          id: `fallback-${Date.now()}`,
          title: 'The Journey Continues',
          text: 'Your adventure unfolds with new challenges ahead.',
          gameType: 'quiz',
          imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
          xpReward: 15,
          postGameFact: '🌟 Every step forward is progress, no matter how small!'
        };
        setStorySegments([...storySegments, fallbackStory]);
        setCurrentIndex(currentIndex + 1);
      }
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
    
    // Generate new AI-powered story content starting from next screen
    try {
      const newStories = await generateStory(newThought, currentIndex);
      const updatedStories = [...storySegments];
      updatedStories.splice(currentIndex + 1, updatedStories.length - currentIndex - 1, ...newStories);
      setStorySegments(updatedStories);
    } catch (err) {
      console.error('Error generating story after thought update:', err);
    }
    
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

      {/* Loading indicator for AI generation */}
      {isGenerating && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDot} />
            <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
            <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
          </View>
        </View>
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 2,
    opacity: 0.4,
  },
  loadingDotDelay1: {
    opacity: 0.7,
  },
  loadingDotDelay2: {
    opacity: 1,
  },
});