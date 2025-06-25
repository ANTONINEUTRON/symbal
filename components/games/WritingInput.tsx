import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PenTool, Check } from 'lucide-react-native';

interface WritingInputProps {
  prompt: string;
  wordLimit: number;
  timeLimit: number;
  onComplete: (text: string) => void;
}

export default function WritingInput({ prompt, wordLimit, timeLimit, onComplete }: WritingInputProps) {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Update word count when text changes
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [text]);

  const handleTextChange = (newText: string) => {
    const words = newText.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length <= wordLimit) {
      setText(newText);
    }
  };

  const handleComplete = () => {
    if (text.trim()) {
      onComplete(text.trim());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCountColor = () => {
    const percentage = wordCount / wordLimit;
    if (percentage >= 0.9) return '#EF4444'; // Red when near limit
    if (percentage >= 0.7) return '#F59E0B'; // Orange when getting close
    return '#10B981'; // Green when safe
  };

  // Add a flag to check if the user is typing
  const isTyping = text.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.promptContainer}>
          <PenTool size={20} color="#8B5CF6" />
          <Text style={styles.prompt}>{prompt}</Text>
        </View>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Writing Area */}
      <View style={styles.writingContainer}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={handleTextChange}
          placeholder="Start writing your creative piece here..."
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
          autoFocus
        />
        
        {/* Word Count */}
        <View style={styles.wordCountContainer}>
          <Text style={[styles.wordCount, { color: getWordCountColor() }]}>
            {wordCount} / {wordLimit} characters
          </Text>
          {wordCount >= wordLimit && (
            <Text style={styles.limitReached}>Word limit reached!</Text>
          )}
        </View>
      </View>

      {/* Writing Tips */}
      {!isTyping && (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Writing Tips:</Text>
          <Text style={styles.tip}>• Let your imagination flow freely</Text>
          <Text style={styles.tip}>• Don't worry about perfection</Text>
          <Text style={styles.tip}>• Express your unique voice</Text>
          <Text style={styles.tip}>• Have fun with the creative process!</Text>
        </View>
      )}

      {/* Complete Button */}
      <TouchableOpacity
        style={[
          styles.completeButton,
          (!text.trim() || wordCount === 0) && styles.completeButtonDisabled
        ]}
        onPress={handleComplete}
        disabled={!text.trim() || wordCount === 0}
      >
        <LinearGradient
          colors={text.trim() && wordCount > 0 ? ['#10B981', '#059669'] : ['#6B7280', '#4B5563']}
          style={styles.completeButtonGradient}
        >
          <Check size={20} color="white" />
          <Text style={styles.completeButtonText}>Complete Writing</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  promptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 16,
  },
  prompt: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    marginLeft: 8,
    lineHeight: 22,
  },
  timer: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  writingContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  wordCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  wordCount: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  limitReached: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    fontStyle: 'italic',
  },
  tipsContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  tipsTitle: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 8,
  },
  tip: {
    color: '#E5E7EB',
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 18,
    marginBottom: 4,
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
});