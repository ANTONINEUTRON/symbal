import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search, Filter, Trophy, Calendar, Tag, Star, Target, Zap } from 'lucide-react-native';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'Story' | 'Game' | 'Creation' | 'Social' | 'Special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpReward: number;
}

export default function AchievementsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const achievements: Achievement[] = [
    { id: '1', name: 'First Steps', description: 'Complete your first story', icon: '🚀', unlockedAt: '2024-12-01', category: 'Story', rarity: 'Common', xpReward: 10 },
    { id: '2', name: 'Truth Seeker', description: 'Master the true/false challenges', icon: '🔍', unlockedAt: '2024-12-02', category: 'Game', rarity: 'Common', xpReward: 15 },
    { id: '3', name: 'Word Master', description: 'Unscramble 10 words perfectly', icon: '📝', unlockedAt: '2024-12-03', category: 'Game', rarity: 'Rare', xpReward: 25 },
    { id: '4', name: 'Speed Demon', description: 'Complete a typing race in record time', icon: '⚡', unlockedAt: '2024-12-04', category: 'Game', rarity: 'Epic', xpReward: 50 },
    { id: '5', name: 'Puzzle Solver', description: 'Solve 5 passage puzzles', icon: '🧩', unlockedAt: '2024-12-05', category: 'Game', rarity: 'Common', xpReward: 20 },
    { id: '6', name: 'Explorer', description: 'Discover 10 new story paths', icon: '🗺️', unlockedAt: '2024-12-06', category: 'Story', rarity: 'Rare', xpReward: 30 },
    { id: '7', name: 'Perfectionist', description: 'Complete 5 games with 100% accuracy', icon: '💯', unlockedAt: '2024-12-07', category: 'Game', rarity: 'Epic', xpReward: 75 },
    { id: '8', name: 'Storyteller', description: 'Create your first custom experience', icon: '📚', unlockedAt: '2024-12-08', category: 'Creation', rarity: 'Rare', xpReward: 40 },
    { id: '9', name: 'Community Builder', description: 'Share 3 experiences with the community', icon: '🤝', unlockedAt: '2024-12-09', category: 'Social', rarity: 'Epic', xpReward: 60 },
    { id: '10', name: 'Legend', description: 'Reach level 10 in your journey', icon: '👑', unlockedAt: '2024-12-10', category: 'Special', rarity: 'Legendary', xpReward: 100 },
    { id: '11', name: 'Marathon Runner', description: 'Play for 5 consecutive days', icon: '🏃', unlockedAt: '2024-12-11', category: 'Special', rarity: 'Rare', xpReward: 35 },
    { id: '12', name: 'Quiz Master', description: 'Answer 50 quiz questions correctly', icon: '🎯', unlockedAt: '2024-12-12', category: 'Game', rarity: 'Common', xpReward: 20 }
  ];

  const categories = ['All', 'Story', 'Game', 'Creation', 'Social', 'Special'];
  const rarities = ['All', 'Common', 'Rare', 'Epic', 'Legendary'];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return '#9CA3AF';
      case 'Rare': return '#3B82F6';
      case 'Epic': return '#8B5CF6';
      case 'Legendary': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Story': return Star;
      case 'Game': return Target;
      case 'Creation': return Zap;
      case 'Social': return Trophy;
      case 'Special': return Trophy;
      default: return Trophy;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || achievement.category === selectedCategory;
    const matchesRarity = selectedRarity === 'All' || achievement.rarity === selectedRarity;
    
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const totalXP = achievements.reduce((sum, achievement) => sum + achievement.xpReward, 0);
  const categoryStats = categories.slice(1).map(category => ({
    name: category,
    count: achievements.filter(a => a.category === category).length,
    icon: getCategoryIcon(category)
  }));

  const renderAchievementCard = (achievement: Achievement) => (
    <View key={achievement.id} style={styles.achievementCard}>
      <View style={styles.cardHeader}>
        <View style={styles.achievementIconContainer}>
          <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
          <View style={[
            styles.rarityBadge,
            { backgroundColor: `${getRarityColor(achievement.rarity)}20` }
          ]}>
            <Text style={[
              styles.rarityText,
              { color: getRarityColor(achievement.rarity) }
            ]}>
              {achievement.rarity}
            </Text>
          </View>
        </View>
        
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementName}>{achievement.name}</Text>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
          
          <View style={styles.achievementMeta}>
            <View style={styles.metaItem}>
              <Calendar size={12} color="#9CA3AF" />
              <Text style={styles.metaText}>
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Tag size={12} color="#9CA3AF" />
              <Text style={styles.metaText}>{achievement.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Star size={12} color="#F59E0B" />
              <Text style={styles.metaText}>+{achievement.xpReward} XP</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFilterChips = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
        <View style={styles.chipSection}>
          <Text style={styles.chipSectionTitle}>Category</Text>
          <View style={styles.chipsRow}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.chipSection}>
          <Text style={styles.chipSectionTitle}>Rarity</Text>
          <View style={styles.chipsRow}>
            {rarities.map((rarity) => (
              <TouchableOpacity
                key={rarity}
                style={[
                  styles.filterChip,
                  selectedRarity === rarity && styles.filterChipActive,
                  rarity !== 'All' && { borderColor: getRarityColor(rarity) }
                ]}
                onPress={() => setSelectedRarity(rarity)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedRarity === rarity && styles.filterChipTextActive,
                  rarity !== 'All' && { color: getRarityColor(rarity) }
                ]}>
                  {rarity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
        <Text style={styles.headerTitle}>Achievements</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? '#8B5CF6' : 'white'} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search achievements..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
      {showFilters && renderFilterChips()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Trophy size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{achievements.length}</Text>
            <Text style={styles.statLabel}>Total Unlocked</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>{totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Target size={24} color="#EC4899" />
            <Text style={styles.statNumber}>
              {achievements.filter(a => a.rarity === 'Legendary').length}
            </Text>
            <Text style={styles.statLabel}>Legendary</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryGrid}>
            {categoryStats.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.name && styles.categoryCardActive
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <category.icon size={20} color="#8B5CF6" />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Achievements List */}
        <View style={styles.section}>
          <View style={styles.achievementsHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'All Achievements' : `${selectedCategory} Achievements`}
            </Text>
            <Text style={styles.achievementsCount}>
              {filteredAchievements.length} of {achievements.length}
            </Text>
          </View>
          
          {filteredAchievements.length === 0 ? (
            <View style={styles.emptyState}>
              <Trophy size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No achievements found</Text>
              <Text style={styles.emptyStateDescription}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          ) : (
            <View style={styles.achievementsList}>
              {filteredAchievements.map(renderAchievementCard)}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
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
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chipScrollView: {
    maxHeight: 120,
  },
  chipSection: {
    marginBottom: 16,
  },
  chipSectionTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: '#8B5CF6',
  },
  filterChipText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: 'white',
  },
  content: {
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (SCREEN_WIDTH - 60) / 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryCardActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
  },
  categoryName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  categoryCount: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 4,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementsCount: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  rarityBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  achievementMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});