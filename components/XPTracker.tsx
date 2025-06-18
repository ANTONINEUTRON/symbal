import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, CreditCard as Edit3, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';

interface XPTrackerProps {
  xp: number;
  currentStoryTitle: string;
  onThoughtPress: () => void;
}

export default function XPTracker({ xp, currentStoryTitle, onThoughtPress }: XPTrackerProps) {
  const { isSignedIn } = useAuth();
  const { progress } = useUserProgress();

  const handleProfilePress = () => {
    if (isSignedIn) {
      router.push('/profile');
    } else {
      router.push('/auth');
    }
  };

  // Get current thought from database or use default
  const currentThought = isSignedIn ? (progress?.current_thought || 'adventure begins now') : 'adventure begins now';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.thoughtButton} onPress={onThoughtPress}>
          <Edit3 size={16} color="white" />
        </TouchableOpacity>
        
        <View style={styles.centerSection}>
          <View style={styles.symSection}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.9)', 'rgba(236, 72, 153, 0.9)']}
              style={styles.symChip}
            >
              <Star size={16} color="#F59E0B" />
              <Text style={styles.symText}>{xp} SYM</Text>
            </LinearGradient>
          </View>
          
          {/* Current Thought Display */}
          <TouchableOpacity style={styles.thoughtDisplay} onPress={onThoughtPress}>
            <Text style={styles.thoughtText} numberOfLines={1} ellipsizeMode="tail">
              "{currentThought}"
            </Text>
          </TouchableOpacity>
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
  },
  thoughtButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  symSection: {
    marginBottom: 8,
  },
  symChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  symText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  thoughtDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 200,
  },
  thoughtText: {
    color: 'white',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
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
});