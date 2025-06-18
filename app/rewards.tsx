import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Gift, 
  Trophy, 
  Star, 
  Clock, 
  Users, 
  Upload,
  FileText,
  Award,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Tag
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RewardClaim {
  id: string;
  experienceTitle: string;
  rewardType: 'regular' | 'text_input' | 'image_upload';
  status: 'pending' | 'approved' | 'rejected';
  claimedAt: string;
  submittedData?: string;
  imageUrl?: string;
  rewardCount: number;
  creatorBadge?: string;
}

interface CreatorExperience {
  id: string;
  title: string;
  description: string;
  plays: number;
  rating: number;
  rewardType: 'none' | 'regular' | 'text_input' | 'image_upload';
  rewardCount: number;
  rewardInstructions?: string;
  pendingClaims: number;
  totalClaimed: number;
  createdAt: string;
}

export default function RewardsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data for user reward claims
  const mockRewardClaims: RewardClaim[] = [
    {
      id: '1',
      experienceTitle: 'The Enchanted Forest Quest',
      rewardType: 'regular',
      status: 'approved',
      claimedAt: '2024-12-15',
      rewardCount: 50,
      creatorBadge: 'Forest Guardian'
    },
    {
      id: '2',
      experienceTitle: 'Photography Masterclass',
      rewardType: 'image_upload',
      status: 'pending',
      claimedAt: '2024-12-14',
      imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
      rewardCount: 150
    },
    {
      id: '3',
      experienceTitle: 'Creative Writing Challenge',
      rewardType: 'text_input',
      status: 'approved',
      claimedAt: '2024-12-13',
      submittedData: 'Username: @storyteller_jane | Link: https://medium.com/@jane/my-story',
      rewardCount: 100
    },
    {
      id: '4',
      experienceTitle: 'Code the Future',
      rewardType: 'text_input',
      status: 'rejected',
      claimedAt: '2024-12-12',
      submittedData: 'GitHub: github.com/user/project | Description: Simple todo app',
      rewardCount: 200
    }
  ];

  // Mock data for creator experiences (premium users only)
  const mockCreatorExperiences: CreatorExperience[] = [
    {
      id: '1',
      title: 'Digital Art Revolution',
      description: 'Create amazing digital artwork using modern tools and techniques.',
      plays: 92,
      rating: 4.9,
      rewardType: 'image_upload',
      rewardCount: 300,
      rewardInstructions: 'Submit your final artwork in high resolution.',
      pendingClaims: 5,
      totalClaimed: 23,
      createdAt: '2024-11-15'
    },
    {
      id: '2',
      title: 'Entrepreneurship Bootcamp',
      description: 'Build your startup from idea to launch.',
      plays: 78,
      rating: 4.5,
      rewardType: 'text_input',
      rewardCount: 500,
      rewardInstructions: 'Submit your business plan and pitch deck.',
      pendingClaims: 12,
      totalClaimed: 8,
      createdAt: '2024-11-10'
    },
    {
      id: '3',
      title: 'Sustainable Living Challenge',
      description: 'Adopt eco-friendly practices and reduce your environmental footprint.',
      plays: 203,
      rating: 4.6,
      rewardType: 'regular',
      rewardCount: 75,
      rewardInstructions: 'Complete all 30 daily challenges.',
      pendingClaims: 0,
      totalClaimed: 156,
      createdAt: '2024-11-05'
    }
  ];

  const isPremiumUser = false; // This would come from user data

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'regular': return Award;
      case 'text_input': return FileText;
      case 'image_upload': return Upload;
      default: return Gift;
    }
  };

  const handleViewClaim = (claim: RewardClaim) => {
    Alert.alert(
      'Claim Details',
      `Experience: ${claim.experienceTitle}\nReward: ${claim.rewardCount} tokens\nStatus: ${claim.status}\n${claim.submittedData ? `Data: ${claim.submittedData}` : ''}`,
      [{ text: 'OK' }]
    );
  };

  const handleReviewClaim = (experienceId: string, claimId: string, action: 'approve' | 'reject') => {
    Alert.alert(
      `${action === 'approve' ? 'Approve' : 'Reject'} Claim`,
      `Are you sure you want to ${action} this reward claim?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action === 'approve' ? 'Approve' : 'Reject',
          style: action === 'approve' ? 'default' : 'destructive',
          onPress: () => {
            Alert.alert('Success', `Claim has been ${action}d successfully!`);
          }
        }
      ]
    );
  };

  const renderUserRewardsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Gift size={24} color="#8B5CF6" />
          <Text style={styles.statNumber}>{mockRewardClaims.length}</Text>
          <Text style={styles.statLabel}>Total Claims</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle size={24} color="#10B981" />
          <Text style={styles.statNumber}>
            {mockRewardClaims.filter(c => c.status === 'approved').length}
          </Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>
            {mockRewardClaims.filter(c => c.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Reward Claims</Text>
        
        {mockRewardClaims.map((claim) => {
          const StatusIcon = getStatusIcon(claim.status);
          const RewardIcon = getRewardTypeIcon(claim.rewardType);
          
          return (
            <TouchableOpacity
              key={claim.id}
              style={styles.claimCard}
              onPress={() => handleViewClaim(claim)}
            >
              <View style={styles.claimHeader}>
                <View style={styles.claimIconContainer}>
                  <RewardIcon size={20} color="#8B5CF6" />
                </View>
                <View style={styles.claimInfo}>
                  <Text style={styles.claimTitle}>{claim.experienceTitle}</Text>
                  <Text style={styles.claimReward}>+{claim.rewardCount} tokens</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(claim.status)}20` }
                ]}>
                  <StatusIcon size={16} color={getStatusColor(claim.status)} />
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(claim.status) }
                  ]}>
                    {claim.status}
                  </Text>
                </View>
              </View>

              <View style={styles.claimMeta}>
                <View style={styles.metaItem}>
                  <Calendar size={12} color="#9CA3AF" />
                  <Text style={styles.metaText}>
                    {new Date(claim.claimedAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Tag size={12} color="#9CA3AF" />
                  <Text style={styles.metaText}>
                    {claim.rewardType.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              {claim.submittedData && (
                <View style={styles.submittedDataContainer}>
                  <Text style={styles.submittedDataLabel}>Submitted:</Text>
                  <Text style={styles.submittedDataText} numberOfLines={2}>
                    {claim.submittedData}
                  </Text>
                </View>
              )}

              {claim.imageUrl && (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: claim.imageUrl }} style={styles.submittedImage} />
                </View>
              )}

              {claim.creatorBadge && claim.status === 'approved' && (
                <View style={styles.badgeContainer}>
                  <Award size={16} color="#F59E0B" />
                  <Text style={styles.badgeText}>Badge: {claim.creatorBadge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderCreatorTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {!isPremiumUser ? (
        <View style={styles.premiumPrompt}>
          <LinearGradient
            colors={['#F59E0B', '#EF4444']}
            style={styles.premiumGradient}
          >
            <Trophy size={48} color="white" />
            <Text style={styles.premiumTitle}>Premium Feature</Text>
            <Text style={styles.premiumDescription}>
              Upgrade to Premium to create experiences with rewards and track user engagement.
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/premium')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : (
        <>
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Star size={24} color="#8B5CF6" />
              <Text style={styles.statNumber}>{mockCreatorExperiences.length}</Text>
              <Text style={styles.statLabel}>Experiences</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={24} color="#EC4899" />
              <Text style={styles.statNumber}>
                {mockCreatorExperiences.reduce((sum, exp) => sum + exp.plays, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Plays</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>
                {mockCreatorExperiences.reduce((sum, exp) => sum + exp.pendingClaims, 0)}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Experiences</Text>
            
            {mockCreatorExperiences.map((experience) => {
              const RewardIcon = getRewardTypeIcon(experience.rewardType);
              
              return (
                <View key={experience.id} style={styles.experienceCard}>
                  <View style={styles.experienceHeader}>
                    <View style={styles.experienceIconContainer}>
                      <RewardIcon size={20} color="#8B5CF6" />
                    </View>
                    <View style={styles.experienceInfo}>
                      <Text style={styles.experienceTitle}>{experience.title}</Text>
                      <Text style={styles.experienceDescription} numberOfLines={2}>
                        {experience.description}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.experienceStats}>
                    <View style={styles.statItem}>
                      <Users size={14} color="#9CA3AF" />
                      <Text style={styles.statText}>{experience.plays} plays</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Star size={14} color="#F59E0B" />
                      <Text style={styles.statText}>{experience.rating}</Text>
                    </View>
                    {experience.rewardType !== 'none' && (
                      <View style={styles.statItem}>
                        <Gift size={14} color="#8B5CF6" />
                        <Text style={styles.statText}>{experience.rewardCount} rewards</Text>
                      </View>
                    )}
                  </View>

                  {experience.rewardType !== 'none' && (
                    <View style={styles.rewardProgress}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Reward Claims</Text>
                        <Text style={styles.progressNumbers}>
                          {experience.totalClaimed}/{experience.rewardCount}
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill,
                            { width: `${(experience.totalClaimed / experience.rewardCount) * 100}%` }
                          ]} 
                        />
                      </View>
                      
                      {experience.pendingClaims > 0 && (
                        <TouchableOpacity
                          style={styles.reviewButton}
                          onPress={() => handleReviewClaim(experience.id, 'claim1', 'approve')}
                        >
                          <Eye size={16} color="#F59E0B" />
                          <Text style={styles.reviewButtonText}>
                            Review {experience.pendingClaims} Claims
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );

  if (!user) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <View style={styles.authPrompt}>
          <Gift size={64} color="#8B5CF6" />
          <Text style={styles.authTitle}>Sign In Required</Text>
          <Text style={styles.authDescription}>
            Sign in to view your reward claims and manage your experiences.
          </Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push('/auth')}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.authButtonGradient}
            >
              <Text style={styles.authButtonText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

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
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 0 && styles.tabButtonActive]}
          onPress={() => setActiveTab(0)}
        >
          <Gift size={20} color={activeTab === 0 ? 'white' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 0 && styles.tabTextActive]}>
            My Claims
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.tabButtonActive]}
          onPress={() => setActiveTab(1)}
        >
          <Trophy size={20} color={activeTab === 1 ? 'white' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}>
            Creator Hub
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 0 ? renderUserRewardsTab() : renderCreatorTab()}
      </View>
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
  statsSection: {
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
    fontSize: 20,
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
  claimCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  claimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  claimIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  claimInfo: {
    flex: 1,
  },
  claimTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  claimReward: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  claimMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  submittedDataContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  submittedDataLabel: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  submittedDataText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 18,
  },
  imageContainer: {
    marginTop: 12,
  },
  submittedImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    gap: 6,
  },
  badgeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
  },
  experienceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  experienceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  experienceDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 18,
  },
  experienceStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  rewardProgress: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  progressNumbers: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    height: 8,
    marginBottom: 12,
  },
  progressFill: {
    backgroundColor: '#8B5CF6',
    height: '100%',
    borderRadius: 4,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  reviewButtonText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
  },
  premiumPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  premiumGradient: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  premiumTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  premiumDescription: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  authTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  authDescription: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  authButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  authButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});