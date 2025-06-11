import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Trophy, Target, RotateCcw, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const userStats = {
    xp: 150,
    level: 3,
    gamesCompleted: 12,
    storiesUnlocked: 8,
    achievements: ['First Steps', 'Truth Seeker', 'Word Master']
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>S</Text>
            </LinearGradient>
          </View>
          <Text style={styles.username}>Story Explorer</Text>
          <Text style={styles.level}>Level {userStats.level}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Star size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>{userStats.xp}</Text>
            <Text style={styles.statLabel}>XP Earned</Text>
          </View>
          
          <View style={styles.statCard}>
            <Trophy size={24} color="#EC4899" />
            <Text style={styles.statNumber}>{userStats.gamesCompleted}</Text>
            <Text style={styles.statLabel}>Games Won</Text>
          </View>
          
          <View style={styles.statCard}>
            <Target size={24} color="#10B981" />
            <Text style={styles.statNumber}>{userStats.storiesUnlocked}</Text>
            <Text style={styles.statLabel}>Stories</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {userStats.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Trophy size={20} color="#F59E0B" />
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Journey Controls</Text>
          
          <TouchableOpacity style={styles.controlButton}>
            <RotateCcw size={20} color="#8B5CF6" />
            <Text style={styles.controlText}>Restart Journey</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Target size={20} color="#EC4899" />
            <Text style={styles.controlText}>Pause Adventure</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress to Next Level</Text>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={[styles.progressFill, { width: '60%' }]}
            />
          </View>
          <Text style={styles.progressText}>60/100 XP</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  username: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  level: {
    color: '#8B5CF6',
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  achievementText: {
    color: 'white',
    marginLeft: 12,
    fontSize: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  controlText: {
    color: 'white',
    marginLeft: 12,
    fontSize: 16,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    height: 16,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressText: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
});