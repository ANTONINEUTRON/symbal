import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, CreditCard as Edit3, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';

interface XPTrackerProps {
  xp: number;
  currentMood: string;
  onMoodPress: () => void;
}

export default function XPTracker({ xp, currentMood, onMoodPress }: XPTrackerProps) {
  const { isSignedIn } = useAuth();
  const { progress } = useUserProgress();

  const handleSettingsPress = () => {
    if (isSignedIn) {
      router.push('/profile');
    } else {
      router.push('/auth');
    }
  };

  // Get current mood from database or use default
  const mood = isSignedIn ? (progress?.mood || 'creative inspiration') : 'creative inspiration';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.moodButton} onPress={onMoodPress}>
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
          
          {/* Current Mood Display */}
          <TouchableOpacity style={styles.moodDisplay} onPress={onMoodPress}>
            <Text style={styles.moodText} numberOfLines={1} ellipsizeMode="tail">
              "{mood}"
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={handleSettingsPress}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.settingsButtonGradient}
          >
            <Settings size={20} color="white" />
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
  moodButton: {
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
  moodDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 200,
  },
  moodText: {
    color: 'white',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  settingsButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingsButtonGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});