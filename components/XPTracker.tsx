import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, CreditCard as Edit3 } from 'lucide-react-native';

interface XPTrackerProps {
  xp: number;
  currentStoryTitle: string;
  onThoughtPress: () => void;
}

export default function XPTracker({ xp, currentStoryTitle, onThoughtPress }: XPTrackerProps) {
  const level = Math.floor(xp / 50) + 1;
  const xpInCurrentLevel = xp % 50;
  const progressPercent = (xpInCurrentLevel / 50) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.xpSection}>
          <View style={styles.xpInfo}>
            <Star size={16} color="#F59E0B" />
            <Text style={styles.xpText}>{xp} XP</Text>
            <Text style={styles.levelText}>Lvl {level}</Text>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.thoughtButton} onPress={onThoughtPress}>
          <Edit3 size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.storyTitle} numberOfLines={1}>
        {currentStoryTitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpSection: {
    flex: 1,
    marginRight: 16,
  },
  xpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  xpText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  levelText: {
    color: '#8B5CF6',
    fontSize: 12,
    marginLeft: 8,
  },
  progressBar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    height: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  thoughtButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});