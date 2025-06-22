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
        {/* Merge Edit button and Mood Display */}
        <TouchableOpacity style={styles.moodEditMergedContainer} onPress={onMoodPress}>
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.9)', 'rgba(236, 72, 153, 0.9)']}
            style={styles.moodEditGradient}
          >
            <View style={styles.moodButtonMerged}>
              <Edit3 size={16} color="white" />
            </View>
            <View style={styles.moodDisplayMerged}>
              <Text
                style={styles.moodText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                "
                {mood.length > 15 ? `${mood.slice(0, 15)}…` : mood}
                "
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Merge SYM chip and settings button */}
        <View style={styles.symSettingsContainer}>
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.9)', 'rgba(236, 72, 153, 0.9)']}
            style={styles.symChipMerged}
          >
            <Star size={16} color="#F59E0B" />
            <Text style={styles.symText}>{xp} SYM</Text>
          </LinearGradient>
          <TouchableOpacity
            style={styles.settingsButtonMerged}
            onPress={handleSettingsPress}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.settingsButtonGradientMerged}
            >
              <Settings size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  symSettingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symChipMerged: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsButtonMerged: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    marginLeft: 0,
  },
  settingsButtonGradientMerged: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
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
  moodEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    paddingRight: 8,
    marginLeft: 8,
    maxWidth: 220,
  },
  moodEditMergedContainer: {
    maxWidth: 220,
    flex: 1,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  moodButtonMerged: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEditGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    paddingRight: 8,
    flexWrap: 'wrap', // Allow wrapping
    minHeight: 36,    // Ensure minimum height for aesthetics
    maxWidth: 180,    // Prevent overflow on small screens
  },
  moodDisplayMerged: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    maxWidth: 120, // Increase if needed for longer moods
    justifyContent: 'center',
    flexShrink: 1, // Allow text to shrink/wrap
  },
});