import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Play, Star, Zap } from 'lucide-react-native';

export default function OnboardingScreen() {
  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Star size={60} color="#8B5CF6" />
          <Text style={styles.title}>Welcome to Symbal</Text>
          <Text style={styles.subtitle}>
            Where your thoughts shape reality and every story becomes an adventure
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Zap size={32} color="#EC4899" />
            <Text style={styles.featureText}>Interactive story games</Text>
          </View>
          <View style={styles.feature}>
            <Play size={32} color="#3B82F6" />
            <Text style={styles.featureText}>Swipe-based navigation</Text>
          </View>
          <View style={styles.feature}>
            <Star size={32} color="#10B981" />
            <Text style={styles.featureText}>Earn XP and grow</Text>
          </View>
        </View>

        <Image
          source={{ uri: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg' }}
          style={styles.heroImage}
        />

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.replace('/')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Begin Your Journey</Text>
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
  content: {
    flex: 1,
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
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    marginLeft: 16,
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