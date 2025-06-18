import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Lightbulb, Trophy, Star } from 'lucide-react-native';
import { StorySegment } from '@/types';
import { gameContent } from '@/data/storyData';

interface PostGameInfoModalProps {
  visible: boolean;
  segment: StorySegment;
  onClose: () => void;
}

export default function PostGameInfoModal({ visible, segment, onClose }: PostGameInfoModalProps) {
  const getPostGameFact = () => {
    return segment.postGameFact ||
      gameContent.postGameFacts?.[segment.gameType] ||
      'Great job! You\'re building valuable cognitive skills with every game you play.';
  };

  const getGameTypeDisplayName = () => {
    return segment.gameType.replace('-', ' ').toUpperCase();
  };

  return (
    <View>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <LinearGradient
              colors={['#1a1a2e', '#16213e', '#0f3460']}
              style={styles.content}
            >
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Trophy size={24} color="#F59E0B" />
                  <Text style={styles.title}>Game Completed!</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="white" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.gameInfoSection}>
                  <Text style={styles.gameTitle}>{segment.title}</Text>
                  <View style={styles.gameDetails}>
                    <View style={styles.gameDetailItem}>
                      <Text style={styles.gameDetailLabel}>Game Type</Text>
                      <Text style={styles.gameDetailValue}>{getGameTypeDisplayName()}</Text>
                    </View>
                    <View style={styles.gameDetailItem}>
                      <Text style={styles.gameDetailLabel}>SYM Earned</Text>
                      <View style={styles.symContainer}>
                        <Star size={16} color="#F59E0B" />
                        <Text style={styles.gameDetailValue}>+{segment.xpReward}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.factSection}>
                  <View style={styles.factHeader}>
                    <Lightbulb size={28} color="#8B5CF6" />
                    <Text style={styles.factTitle}>Did You Know?</Text>
                  </View>

                  <View style={styles.factContainer}>
                    <LinearGradient
                      colors={['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)']}
                      style={styles.factGradient}
                    >
                      <Text style={styles.factText}>
                        {getPostGameFact()}
                      </Text>
                    </LinearGradient>
                  </View>
                </View>

                <View style={styles.encouragementSection}>
                  <Text style={styles.encouragementText}>
                    Keep playing to unlock more insights and build your cognitive skills!
                    Every game you complete makes you smarter and more resilient.
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.continueButton} onPress={onClose}>
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  style={styles.continueButtonGradient}
                >
                  <Text style={styles.continueButtonText}>Continue Journey</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
  },
  gameInfoSection: {
    marginBottom: 24,
  },
  gameTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  gameDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  gameDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  gameDetailLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  gameDetailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  symContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  factSection: {
    marginBottom: 24,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  factTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  factContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  factGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  factText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  encouragementSection: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  encouragementText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  continueButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});