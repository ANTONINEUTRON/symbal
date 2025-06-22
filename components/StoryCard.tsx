import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Info, Palette, PenTool } from 'lucide-react-native';
import { StorySegment } from '@/types';
import AIStoryIndicator from './AIStoryIndicator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryCardProps {
  segment: StorySegment;
  onPlayGame: () => void;
  onShowInfo: () => void;
  isCompleted: boolean;
}

export default function StoryCard({ segment, onPlayGame, onShowInfo, isCompleted }: StoryCardProps) {
  // Check if this is an AI-generated story
  const isAIGenerated = segment.id.startsWith('ai-');

  const getTaskIcon = () => {
    switch (segment.gameType) {
      case 'drawing':
        return Palette;
      case 'writing':
        return PenTool;
      default:
        return Play;
    }
  };

  const getTaskDisplayName = () => {
    switch (segment.gameType) {
      case 'drawing':
        return 'DRAWING TASK';
      case 'writing':
        return 'WRITING TASK';
      default:
        return 'CREATIVE TASK';
    }
  };

  const TaskIcon = getTaskIcon();

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

      {/* AI Story Indicator */}
      <AIStoryIndicator isAIGenerated={isAIGenerated} />

      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.title}>{segment.title}</Text>

          {isCompleted ? (
            <View style={styles.completedContainer}>
              <Text style={styles.completedText}>
                ✨ Task completed! You've expressed your creativity beautifully.
              </Text>
            </View>
          ) : (
            <Text style={styles.description}>{segment.text}</Text>
          )}

          <View style={styles.taskInfo}>
            <View style={styles.taskTypeRow}>
              <TaskIcon size={20} color="#8B5CF6" />
              <Text style={styles.taskTypeText}>
                {getTaskDisplayName()}
              </Text>
            </View>
            <Text style={styles.xpReward}>+{segment.xpReward} SYM</Text>
          </View>

          {/* Task-specific details */}
          {!isCompleted && (
            <View style={styles.taskDetails}>
              {segment.gameType === 'drawing' && segment.drawingPrompt && (
                <Text style={styles.taskPrompt}>🎨 {segment.drawingPrompt}</Text>
              )}
              {segment.gameType === 'writing' && segment.writingPrompt && (
                <Text style={styles.taskPrompt}>✍️ {segment.writingPrompt}</Text>
              )}
              {segment.timeLimit && (
                <Text style={styles.timeLimit}>⏱️ {segment.timeLimit} minutes</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.playButton, isCompleted && styles.completedButton]}
            onPress={isCompleted ? onShowInfo : onPlayGame}
          >
            <LinearGradient
              colors={isCompleted ? ['#10B981', '#059669'] : ['#8B5CF6', '#EC4899']}
              style={styles.playButtonGradient}
            >
              {isCompleted ? (
                <>
                  <Info size={20} color="white" />
                  <Text style={styles.playButtonText}>View Details</Text>
                </>
              ) : (
                <>
                  <Play size={20} color="white" />
                  <Text style={styles.playButtonText}>Start Creating</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  completedContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  completedText: {
    color: '#E5E7EB',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTypeText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  xpReward: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskDetails: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  taskPrompt: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  timeLimit: {
    color: '#9CA3AF',
    fontSize: 12,
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 12,
  },
  playButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  completedButton: {
    opacity: 1,
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