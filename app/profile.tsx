import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Dimensions,
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Star, 
  Trophy, 
  Target, 
  RotateCcw, 
  ArrowLeft, 
  LogOut,
  Settings,
  Bell,
  Shield,
  FileText,
  Trash2,
  MessageSquare,
  Plus,
  Sparkles
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const userStats = {
    xp: 150,
    level: 3,
    gamesCompleted: 12,
    storiesUnlocked: 8,
    achievements: [
      { name: 'First Steps', description: 'Complete your first story', icon: '🚀' },
      { name: 'Truth Seeker', description: 'Master the true/false challenges', icon: '🔍' },
      { name: 'Word Master', description: 'Unscramble 10 words perfectly', icon: '📝' },
      { name: 'Speed Demon', description: 'Complete a typing race in record time', icon: '⚡' },
      { name: 'Puzzle Solver', description: 'Solve 5 passage puzzles', icon: '🧩' }
    ]
  };

  const settingsItems = [
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Story updates and achievements',
      type: 'toggle',
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled
    },
    {
      icon: Shield,
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      type: 'link',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy content would be shown here.')
    },
    {
      icon: FileText,
      title: 'Terms of Service',
      subtitle: 'Terms and conditions',
      type: 'link',
      onPress: () => Alert.alert('Terms of Service', 'Terms of service content would be shown here.')
    },
    {
      icon: MessageSquare,
      title: 'Send Feedback',
      subtitle: 'Help us improve Symbal',
      type: 'link',
      onPress: () => Alert.alert('Feedback', 'Feedback form would open here.')
    },
    {
      icon: Trash2,
      title: 'Delete Account',
      subtitle: 'Permanently remove your account',
      type: 'danger',
      onPress: () => {
        Alert.alert(
          'Delete Account',
          'Are you sure you want to permanently delete your account? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {} }
          ]
        );
      }
    }
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const handleFabPress = () => {
    Alert.alert(
      'Quick Actions',
      'What would you like to do?',
      [
        { text: 'Start New Story', onPress: () => router.push('/') },
        { text: 'View Achievements', onPress: () => setActiveTab(0) },
        { text: 'Settings', onPress: () => setActiveTab(1) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // If user is not signed in, redirect to auth
  if (!user) {
    router.replace('/auth');
    return null;
  }

  const renderAchievementsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        </View>
        <Text style={styles.username}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
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
            <View style={styles.achievementIcon}>
              <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
            <Trophy size={20} color="#F59E0B" />
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
  );

  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.settingsHeader}>
        <Settings size={32} color="#8B5CF6" />
        <Text style={styles.settingsTitle}>Settings</Text>
        <Text style={styles.settingsSubtitle}>Customize your Symbal experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.settingsItem,
              item.type === 'danger' && styles.settingsItemDanger
            ]}
            onPress={item.onPress}
            disabled={item.type === 'toggle'}
          >
            <View style={styles.settingsItemLeft}>
              <View style={[
                styles.settingsItemIcon,
                item.type === 'danger' && styles.settingsItemIconDanger
              ]}>
                <item.icon 
                  size={20} 
                  color={item.type === 'danger' ? '#EF4444' : '#8B5CF6'} 
                />
              </View>
              <View style={styles.settingsItemContent}>
                <Text style={[
                  styles.settingsItemTitle,
                  item.type === 'danger' && styles.settingsItemTitleDanger
                ]}>
                  {item.title}
                </Text>
                <Text style={styles.settingsItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            
            {item.type === 'toggle' && (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: '#374151', true: '#8B5CF6' }}
                thumbColor={item.value ? '#EC4899' : '#9CA3AF'}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.accountInfo}>
          <Text style={styles.accountLabel}>Email</Text>
          <Text style={styles.accountValue}>{user.email}</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountLabel}>Member Since</Text>
          <Text style={styles.accountValue}>December 2024</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountLabel}>Account Type</Text>
          <Text style={styles.accountValue}>Free</Text>
        </View>
      </View>

      <View style={styles.signOutSection}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.signOutButtonGradient}
          >
            <LogOut size={20} color="white" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

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
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 0 && styles.tabButtonActive]}
          onPress={() => setActiveTab(0)}
        >
          <Trophy size={20} color={activeTab === 0 ? 'white' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 0 && styles.tabTextActive]}>
            Achievements
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.tabButtonActive]}
          onPress={() => setActiveTab(1)}
        >
          <Settings size={20} color={activeTab === 1 ? 'white' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 0 ? renderAchievementsTab() : renderSettingsTab()}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleFabPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#8B5CF6', '#EC4899', '#F59E0B']}
          style={styles.fabGradient}
        >
          <Sparkles size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
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
  headerSpacer: {
    width: 40,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  tabContent: {
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
  email: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 8,
  },
  level: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 32,
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 18,
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
    marginBottom: 100, // Extra space for FAB
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
  settingsHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  settingsTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  settingsSubtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  settingsItemDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsItemIconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingsItemTitleDanger: {
    color: '#EF4444',
  },
  settingsItemSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 18,
  },
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  accountLabel: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  accountValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutSection: {
    marginBottom: 100, // Extra space for FAB
  },
  signOutButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  signOutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});