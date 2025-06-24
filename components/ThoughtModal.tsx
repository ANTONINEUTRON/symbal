import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Send, Heart } from 'lucide-react-native';

interface ThoughtModalProps {
  visible: boolean;
  currentMood: string;
  onClose: () => void;
  onUpdate: (mood: string) => void;
}

export default function ThoughtModal({ visible, currentMood, onClose, onUpdate }: ThoughtModalProps) {
  const [mood, setMood] = useState(currentMood);
  const [wordCount, setWordCount] = useState(0);

  // Update local state when currentMood prop changes
  useEffect(() => {
    setMood(currentMood);
    const words = currentMood.split(' ').filter(word => word.length > 0);
    setWordCount(words.length);
  }, [currentMood]);

  const handleTextChange = (text: string) => {
    const words = text.split(' ').filter(word => word.length > 0);
    if (words.length <= 3) {
      setMood(text);
      setWordCount(words.length);
    }
  };

  const handleSubmit = () => {
    if (mood.trim() && wordCount > 0) {
      onUpdate(mood.trim());
    }
  };

  const handleClose = () => {
    // Reset to current mood when closing without saving
    setMood(currentMood);
    const words = currentMood.split(' ').filter(word => word.length > 0);
    setWordCount(words.length);
    onClose();
  };

  return (
    <View>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <LinearGradient
              colors={['#1a1a2e', '#16213e']}
              style={styles.content}
            >
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Heart size={24} color="#EC4899" />
                  <Text style={styles.title}>Update Your Mood</Text>
                </View>
                <TouchableOpacity onPress={handleClose}>
                  <X size={24} color="white" />
                </TouchableOpacity>
              </View>

              <Text style={styles.description}>
                Your mood shapes your creative journey. Choose up to 3 words that capture how you're feeling right now.
              </Text>

              <View style={styles.currentMoodContainer}>
                <Text style={styles.currentMoodLabel}>Current mood:</Text>
                <Text style={styles.currentMoodText}>"{currentMood}"</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={mood}
                  onChangeText={handleTextChange}
                  placeholder="Enter your current mood..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  maxLength={50}
                  autoFocus
                />
                <Text style={[
                  styles.wordCount,
                  wordCount > 3 ? styles.wordCountError : wordCount === 3 ? styles.wordCountGood : {}
                ]}>
                  {wordCount}/3 words
                </Text>
              </View>

              <View style={styles.exampleContainer}>
                <Text style={styles.exampleLabel}>Examples:</Text>
                <View style={styles.exampleTags}>
                  <TouchableOpacity 
                    style={styles.exampleTag}
                    onPress={() => handleTextChange('creative inspired energetic')}
                  >
                    <Text style={styles.exampleTagText}>creative inspired energetic</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.exampleTag}
                    onPress={() => handleTextChange('calm peaceful reflective')}
                  >
                    <Text style={styles.exampleTagText}>calm peaceful reflective</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.exampleTag}
                    onPress={() => handleTextChange('adventurous bold curious')}
                  >
                    <Text style={styles.exampleTagText}>adventurous bold curious</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton, 
                  (!mood.trim() || wordCount === 0 || mood === currentMood) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!mood.trim() || wordCount === 0 || mood === currentMood}
              >
                <LinearGradient
                  colors={
                    mood.trim() && wordCount > 0 && mood !== currentMood 
                      ? ['#EC4899', '#8B5CF6'] 
                      : ['#6B7280', '#4B5563']
                  }
                  style={styles.submitButtonGradient}
                >
                  <Send size={20} color="white" />
                  <Text style={styles.submitButtonText}>Update Creative Journey</Text>
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    marginLeft: 12,
  },
  description: {
    color: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
    marginBottom: 20,
  },
  currentMoodContainer: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EC4899',
  },
  currentMoodLabel: {
    color: '#EC4899',
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 4,
  },
  currentMoodText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  wordCount: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'right',
    marginTop: 8,
  },
  wordCountError: {
    color: '#EF4444',
  },
  wordCountGood: {
    color: '#10B981',
  },
  exampleContainer: {
    marginBottom: 24,
  },
  exampleLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    marginBottom: 8,
  },
  exampleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleTag: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  exampleTagText: {
    color: '#EC4899',
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    marginLeft: 8,
  },
});