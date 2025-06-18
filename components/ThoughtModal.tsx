import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Send, Lightbulb } from 'lucide-react-native';

interface ThoughtModalProps {
  visible: boolean;
  currentThought: string;
  onClose: () => void;
  onUpdate: (thought: string) => void;
}

export default function ThoughtModal({ visible, currentThought, onClose, onUpdate }: ThoughtModalProps) {
  const [thought, setThought] = useState(currentThought);
  const [wordCount, setWordCount] = useState(0);

  // Update local state when currentThought prop changes
  useEffect(() => {
    setThought(currentThought);
    const words = currentThought.split(' ').filter(word => word.length > 0);
    setWordCount(words.length);
  }, [currentThought]);

  const handleTextChange = (text: string) => {
    const words = text.split(' ').filter(word => word.length > 0);
    if (words.length <= 3) {
      setThought(text);
      setWordCount(words.length);
    }
  };

  const handleSubmit = () => {
    if (thought.trim() && wordCount > 0) {
      onUpdate(thought.trim());
    }
  };

  const handleClose = () => {
    // Reset to current thought when closing without saving
    setThought(currentThought);
    const words = currentThought.split(' ').filter(word => word.length > 0);
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
                  <Lightbulb size={24} color="#8B5CF6" />
                  <Text style={styles.title}>Update Your Thought</Text>
                </View>
                <TouchableOpacity onPress={handleClose}>
                  <X size={24} color="white" />
                </TouchableOpacity>
              </View>

              <Text style={styles.description}>
                Your thoughts shape the story. Choose up to 3 words that will influence what happens next.
              </Text>

              <View style={styles.currentThoughtContainer}>
                <Text style={styles.currentThoughtLabel}>Current thought:</Text>
                <Text style={styles.currentThoughtText}>"{currentThought}"</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={thought}
                  onChangeText={handleTextChange}
                  placeholder="Enter your new thought..."
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
                    onPress={() => handleTextChange('hope courage light')}
                  >
                    <Text style={styles.exampleTagText}>hope courage light</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.exampleTag}
                    onPress={() => handleTextChange('mystery dark secrets')}
                  >
                    <Text style={styles.exampleTagText}>mystery dark secrets</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.exampleTag}
                    onPress={() => handleTextChange('adventure awaits now')}
                  >
                    <Text style={styles.exampleTagText}>adventure awaits now</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton, 
                  (!thought.trim() || wordCount === 0 || thought === currentThought) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!thought.trim() || wordCount === 0 || thought === currentThought}
              >
                <LinearGradient
                  colors={
                    thought.trim() && wordCount > 0 && thought !== currentThought 
                      ? ['#8B5CF6', '#EC4899'] 
                      : ['#6B7280', '#4B5563']
                  }
                  style={styles.submitButtonGradient}
                >
                  <Send size={20} color="white" />
                  <Text style={styles.submitButtonText}>Update Story</Text>
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
    fontWeight: 'bold',
    marginLeft: 12,
  },
  description: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  currentThoughtContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  currentThoughtLabel: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentThoughtText: {
    color: 'white',
    fontSize: 16,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  wordCount: {
    color: '#9CA3AF',
    fontSize: 12,
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
    marginBottom: 8,
  },
  exampleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  exampleTagText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
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
    fontWeight: 'bold',
    marginLeft: 8,
  },
});