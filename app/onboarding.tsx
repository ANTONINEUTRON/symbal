import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Play, Star, Zap } from 'lucide-react-native';
import { loadStoriesFromCache } from '@/lib/storyCache';
import { useAIStoryGeneration } from '@/hooks/useAIStoryGeneration';

export default function OnboardingScreen() {
  const { generateStory } = useAIStoryGeneration();

  useEffect(() => {
    (async () => {
      const cached = await loadStoriesFromCache();
      if (cached.length === 0) {
        // Generate and cache a story in the background, but don't block UI
        try {
          const newStories = await generateStory('creative inspiration', 0);
          // Save to cache
          const { saveStoriesToCache } = await import('@/lib/storyCache');
          saveStoriesToCache(newStories);
        } catch (e) {
          // Ignore errors, onboarding UI should not be blocked
        }
      }
    })();
  }, []);

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      {/* Bolt Badge */}
      <Image 
        source={require('../assets/images/bolt_icon.png')} 
        style={styles.badgeImage} 
      />

      <View style={styles.content}>
        <View>
          <View style={styles.header}>
          <Star size={60} color="#8B5CF6" />
          <Text style={styles.title}>Welcome to Symbal</Text>
          <Text style={styles.subtitle}>
            Where AI-powered creativity meets personalized storytelling. Transform your thoughts into interactive adventures with drawing and writing challenges.
          </Text>
        </View>

        <View>
          <View style={styles.feature}>
            <Zap size={32} color="#EC4899" />
            <Text style={styles.featureText}>Stories & Creative Tasks</Text>
          </View>
          <View style={styles.feature}>
            <Play size={32} color="#3B82F6" />
            <Text style={styles.featureText}>Interactive Drawing & Writing Challenges</Text>
          </View>
          <View style={styles.feature}>
            <Star size={32} color="#10B981" />
            <Text style={styles.featureText}>Earn SYM, Unlock Premium Features</Text>
          </View>
        </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.replace('/')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Begin Your Creative Journey</Text>
            <Play size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badgeImage: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Quicksand-Bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  features: {
    marginBottom: 40,
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    marginLeft: 16,
    flex: 1,
    lineHeight: 22,
  },
  heroImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 40,
  },
  startButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginRight: 8,
  },
});