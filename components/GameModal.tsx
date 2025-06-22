import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Sparkles, ArrowRight } from 'lucide-react-native';
import { StorySegment, UserSubmission, AIJudgment } from '@/types';
import { judgeSubmissionWithAI } from '@/lib/gemini';
import DrawingCanvas from '@/components/games/DrawingCanvas';
import WritingInput from '@/components/games/WritingInput';

interface GameModalProps {
  visible: boolean;
  segment: StorySegment;
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export default function GameModal({ visible, segment, onClose, onComplete }: GameModalProps) {
  const [showPostGameInfo, setShowPostGameInfo] = useState(false);
  const [aiJudgment, setAiJudgment] = useState<AIJudgment | null>(null);
  const [isJudging, setIsJudging] = useState(false);

  const handleTaskComplete = async (submissionContent: string) => {
    setIsJudging(true);

    try {
      // Create submission object
      const submission: UserSubmission = {
        type: segment.gameType,
        content: submissionContent,
        submittedAt: new Date().toISOString(),
        taskId: segment.id
      };

      // Get AI judgment
      const judgment = await judgeSubmissionWithAI(submission, segment);
      setAiJudgment(judgment);
      setShowPostGameInfo(true);
    } catch (error) {
      console.error('Error getting AI judgment:', error);
      
      // Fallback judgment
      const fallbackJudgment: AIJudgment = {
        score: 8,
        feedback: `Your ${segment.gameType} shows wonderful creativity and imagination!`,
        encouragement: '🎨 Amazing creative work! Keep expressing yourself!',
        highlights: ['Creative expression', 'Unique interpretation', 'Artistic courage']
      };
      
      setAiJudgment(fallbackJudgment);
      setShowPostGameInfo(true);
    } finally {
      setIsJudging(false);
    }
  };

  const handleContinue = () => {
    setShowPostGameInfo(false);
    setAiJudgment(null);
    onComplete(segment.xpReward);
  };

  const renderTask = () => {
    if (segment.gameType === 'drawing') {
      return (
        <DrawingCanvas
          prompt={segment.drawingPrompt || 'Create something beautiful!'}
          colorPalette={segment.colorPalette || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']}
          timeLimit={segment.timeLimit || 15}
          onComplete={handleTaskComplete}
        />
      );
    } else if (segment.gameType === 'writing') {
      return (
        <WritingInput
          prompt={segment.writingPrompt || 'Write something meaningful!'}
          wordLimit={segment.wordLimit || 100}
          timeLimit={segment.timeLimit || 15}
          onComplete={handleTaskComplete}
        />
      );
    }

    return null;
  };

  return (
    <View>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{segment.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.taskContainer}>
            {renderTask()}
          </View>

          {/* AI Judgment Loading */}
          {isJudging && (
            <View style={styles.judgingOverlay}>
              <View style={styles.judgingContainer}>
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899', '#F59E0B']}
                  style={styles.judgingGradient}
                >
                  <View style={styles.judgingContent}>
                    <Sparkles size={32} color="white" />
                    <Text style={styles.judgingTitle}>AI is reviewing your work...</Text>
                    <View style={styles.loadingDots}>
                      <View style={styles.loadingDot} />
                      <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                      <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* AI Judgment Results */}
          {showPostGameInfo && aiJudgment && (
            <View style={styles.postGameOverlay}>
              <View style={styles.postGameContainer}>
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899', '#F59E0B']}
                  style={styles.postGameGradient}
                >
                  <View style={styles.postGameContent}>
                    <View style={styles.postGameHeader}>
                      <Text style={styles.scoreText}>Score: {aiJudgment.score}/10</Text>
                      <Text style={styles.encouragementText}>{aiJudgment.encouragement}</Text>
                    </View>

                    <View style={styles.feedbackSection}>
                      <Text style={styles.feedbackTitle}>AI Feedback:</Text>
                      <Text style={styles.feedbackText}>{aiJudgment.feedback}</Text>
                    </View>

                    {aiJudgment.highlights && aiJudgment.highlights.length > 0 && (
                      <View style={styles.highlightsSection}>
                        <Text style={styles.highlightsTitle}>✨ What stood out:</Text>
                        {aiJudgment.highlights.map((highlight, index) => (
                          <Text key={index} style={styles.highlightItem}>• {highlight}</Text>
                        ))}
                      </View>
                    )}

                    {aiJudgment.improvements && aiJudgment.improvements.length > 0 && (
                      <View style={styles.improvementsSection}>
                        <Text style={styles.improvementsTitle}>💡 For next time:</Text>
                        {aiJudgment.improvements.map((improvement, index) => (
                          <Text key={index} style={styles.improvementItem}>• {improvement}</Text>
                        ))}
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.continueButton}
                      onPress={handleContinue}
                    >
                      <View style={styles.continueButtonContent}>
                        <Text style={styles.continueButtonText}>Continue Journey</Text>
                        <ArrowRight size={20} color="white" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </View>
          )}
        </LinearGradient>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  taskContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  judgingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  judgingContainer: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 24,
    overflow: 'hidden',
  },
  judgingGradient: {
    padding: 32,
  },
  judgingContent: {
    alignItems: 'center',
  },
  judgingTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
    opacity: 0.4,
  },
  loadingDotDelay1: {
    opacity: 0.7,
  },
  loadingDotDelay2: {
    opacity: 1,
  },
  postGameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  postGameContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  postGameGradient: {
    padding: 24,
  },
  postGameContent: {
    alignItems: 'center',
  },
  postGameHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  encouragementText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  feedbackSection: {
    width: '100%',
    marginBottom: 20,
  },
  feedbackTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedbackText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  highlightsSection: {
    width: '100%',
    marginBottom: 16,
  },
  highlightsTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  highlightItem: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  improvementsSection: {
    width: '100%',
    marginBottom: 24,
  },
  improvementsTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  improvementItem: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});