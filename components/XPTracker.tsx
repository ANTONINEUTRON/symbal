import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, CreditCard as Edit3, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface XPTrackerProps {
  xp: number;
  currentStoryTitle: string;
  onThoughtPress: () => void;
}

export default function XPTracker({ xp, currentStoryTitle, onThoughtPress }: XPTrackerProps) {
  const level = Math.floor(xp / 50) + 1;
  const { isSignedIn } = useAuth();

  const handleProfilePress = () => {
    if (isSignedIn) {
      router.push('/profile');
    } else {
      router.push('/auth');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.thoughtButton} onPress={onThoughtPress}>
          <Edit3 size={16} color="white" />
        </TouchableOpacity>
        
        <View style={styles.xpSection}>
          <View style={styles.xpInfo}>
            <Star size={16} color="#F59E0B" />
            <Text style={styles.xpText}>{xp} XP</Text>
            <Text style={styles.levelText}>Lvl {level}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={handleProfilePress}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.profileButtonGradient}
          >
            <User size={20} color="white" />
          </LinearGradient>
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
  thoughtButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpSection: {
    flex: 1,
    marginHorizontal: 16,
  },
  xpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileButtonGradient: {
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