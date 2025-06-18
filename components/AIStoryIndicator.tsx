import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AIStoryIndicatorProps {
  isAIGenerated?: boolean;
  isGenerating?: boolean;
}

export default function AIStoryIndicator({ isAIGenerated = false, isGenerating = false }: AIStoryIndicatorProps) {
  if (!isAIGenerated && !isGenerating) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.8)', 'rgba(236, 72, 153, 0.8)']}
        style={styles.badge}
      >
        {isGenerating ? (
          <>
            <Zap size={12} color="white" />
            <Text style={styles.text}>Generating...</Text>
          </>
        ) : (
          <>
            <Sparkles size={12} color="white" />
            <Text style={styles.text}>AI Story</Text>
          </>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  text: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});