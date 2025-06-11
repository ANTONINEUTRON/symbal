import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CircleCheck as CheckCircle, ChevronUp, ChevronDown } from 'lucide-react-native';
import { StorySegment } from '@/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryCardProps {
  segment: StorySegment;
  onPlayGame: () => void;
  isCompleted: boolean;
}

export default function StoryCard({ segment, onPlayGame, isCompleted }: StoryCardProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: segment.imageUrl }}
        style={styles.backgroundImage}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
        style={styles.gradient}
      />

      <View style={styles.swipeIndicators}>
        <View style={styles.swipeIndicator}>
          <ChevronUp size={20} color="rgba(255,255,255,0.6)" />
          <Text style={styles.swipeText}>Swipe up</Text>
        </View>
        <View style={styles.swipeIndicator}>
          <ChevronDown size={20} color="rgba(255,255,255,0.6)" />
          <Text style={styles.swipeText}>Swipe down</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.title}>{segment.title}</Text>
          <Text style={styles.description}>{segment.text}</Text>
          
          <View style={styles.gameInfo}>
            <Text style={styles.gameType}>Game: {segment.gameType.replace('-', ' ').toUpperCase()}</Text>
            <Text style={styles.xpReward}>+{segment.xpReward} XP</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.playButton, isCompleted && styles.completedButton]}
          onPress={onPlayGame}
          disabled={isCompleted}
        >
          <LinearGradient
            colors={isCompleted ? ['#10B981', '#059669'] : ['#8B5CF6', '#EC4899']}
            style={styles.playButtonGradient}
          >
            {isCompleted ? (
              <>
                <CheckCircle size={20} color="white" />
                <Text style={styles.playButtonText}>Completed</Text>
              </>
            ) : (
              <>
                <Play size={20} color="white" />
                <Text style={styles.playButtonText}>Play Game</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  swipeIndicators: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -40 }],
    alignItems: 'center',
  },
  swipeIndicator: {
    alignItems: 'center',
    marginVertical: 20,
  },
  swipeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  textContent: {
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 34,
  },
  description: {
    color: '#E5E7EB',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameType: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  xpReward: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  completedButton: {
    opacity: 0.8,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  playButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});