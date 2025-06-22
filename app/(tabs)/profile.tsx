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

export default function ProfileTab() {
  const { isSignedIn } = useAuth();
  const { progress, completeGame, updateMood } = useUserProgress();
  const { generateStory, isGenerating, error } = useAIStoryGeneration();
  
  const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [currentGame, setCurrentGame] = useState<StorySegment | null>(null);

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Use progress from Supabase if signed in, otherwise use local state
  const currentXP = isSignedIn ? (progress?.xp || 0) : 0;
  const currentMood = isSignedIn ? (progress?.mood || 'creative inspiration') : 'creative inspiration';
  const completedGames = isSignedIn ? (progress?.completed_games || []) : [];

  // Generate initial story on mount
  useEffect(() => {
    if (storySegments.length === 0) {
      generateInitialStory();
    }
  }, []);

  // Show error if AI generation fails
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Story Generation',
        'Using offline mode. Connect to internet for AI-powered creative tasks.',
        [{ text: 'OK' }]
      );
    }
  }, [error]);

  const generateInitialStory = async () => {
    try {
      const newStories = await generateStory(currentMood, 0);
      setStorySegments(newStories);
    } catch (err) {
      console.error('Error generating initial story:', err);
      // Set a fallback story
      const fallbackStory: StorySegment = {
        id: `fallback-${Date.now()}`,
        title: 'Creative Awakening',
        text: 'Your creative journey begins with a simple challenge.',
        gameType: 'drawing',
        imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        xpReward: 20,
        postGameFact: '🎨 Creative expression enhances mental well-being!',
        drawingPrompt: 'Draw something that makes you happy',
        colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
        timeLimit: 15
      };
      setStorySegments([fallbackStory]);
    }
  };

  const handleSwipeUp = async () => {
    if (currentIndex < storySegments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Generate more story content when reaching the end
      try {
        const newStories = await generateStory(currentMood, currentIndex);
        setStorySegments([...storySegments, ...newStories]);
        setCurrentIndex(currentIndex + 1);
      } catch (err) {
        console.error('Error generating new story:', err);
        // Fallback to basic story if AI fails
        const fallbackStory: StorySegment = {
          id: `fallback-${Date.now()}`,
          title: 'The Creative Continues',
          text: 'Your creative journey unfolds with new challenges ahead.',
          gameType: Math.random() > 0.5 ? 'drawing' : 'writing',
          imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
          xpReward: 25,
          postGameFact: '🌟 Every creative act builds your artistic confidence!',
          drawingPrompt: 'Express your current mood through art',
          writingPrompt: 'Write about a moment that inspired you',
          wordLimit: 100,
          colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
          timeLimit: 15
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
          await completeGame(currentGame.id, earnedXP, currentGame.gameType);
        } catch (error) {
          console.error('Error saving game completion:', error);
        }
      }
    }
    setGameModalVisible(false);
    setCurrentGame(null);
  };

  const handleMoodUpdate = async (newMood: string) => {
    if (isSignedIn) {
      try {
        await updateMood(newMood);
      } catch (error) {
        console.error('Error updating mood:', error);
      }
    }
    
    // Generate new AI-powered story content starting from next screen
    try {
      const newStories = await generateStory(newMood, currentIndex);
      const updatedStories = [...storySegments];
      updatedStories.splice(currentIndex + 1, updatedStories.length - currentIndex - 1, ...newStories);
      setStorySegments(updatedStories);
    } catch (err) {
      console.error('Error generating story after mood update:', err);
    }
    
    setMoodModalVisible(false);
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
        currentMood={currentStory.title}
        onMoodPress={() => setMoodModalVisible(true)}
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
        visible={moodModalVisible}
        currentMood={currentMood}
        onClose={() => setMoodModalVisible(false)}
        onUpdate={handleMoodUpdate}
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