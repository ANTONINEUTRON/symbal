import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Send } from 'lucide-react-native';

interface ThoughtModalProps {
  visible: boolean;
  currentThought: string;
  onClose: () => void;
  onUpdate: (thought: string) => void;
}

export default function ThoughtModal({ visible, currentThought, onClose, onUpdate }: ThoughtModalProps) {
  const [thought, setThought] = useState(currentThought);
  const [wordCount, setWordCount] = useState(currentThought.split(' ').filter(w => w.length > 0).length);

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#1a1a2e', '#16213e']}
            style={styles.content}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Update Your Thought</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.description}>
              Your thoughts shape the story. Choose 3 words that will influence what happens next.
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={thought}
                onChangeText={handleTextChange}
                placeholder="Enter your thought..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={50}
              />
              <Text style={[
                styles.wordCount,
                wordCount > 3 ? styles.wordCountError : wordCount === 3 ? styles.wordCountGood : {}
              ]}>
                {wordCount}/3 words
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (!thought.trim() || wordCount === 0) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!thought.trim() || wordCount === 0}
            >
              <LinearGradient
                colors={thought.trim() && wordCount > 0 ? ['#8B5CF6', '#EC4899'] : ['#6B7280', '#4B5563']}
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
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
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