import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';

interface PlaceholderGameProps {
  gameType: string;
  onComplete: () => void;
}

export default function PlaceholderGame({ gameType, onComplete }: PlaceholderGameProps) {
  const getPlaceholderImage = () => {
    if (gameType === 'Crossword') {
      return 'https://images.pexels.com/photos/1181319/pexels-photo-1181319.jpeg';
    } else if (gameType === 'Sudoku') {
      return 'https://images.pexels.com/photos/1181318/pexels-photo-1181318.jpeg';
    }
    return 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{gameType} Challenge</Text>
      
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getPlaceholderImage() }}
          style={styles.placeholderImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.comingSoon}>Coming Soon</Text>
          <Text style={styles.description}>
            This {gameType.toLowerCase()} game is under development. 
            Click below to earn XP and continue your journey!
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          style={styles.completeButtonGradient}
        >
          <Play size={20} color="white" />
          <Text style={styles.completeButtonText}>Continue Journey</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    position: 'relative',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  comingSoon: {
    color: '#8B5CF6',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});