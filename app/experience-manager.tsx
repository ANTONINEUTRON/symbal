import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Star,
  Clock,
  Users,
  Sparkles,
  Save,
  X,
  Image as ImageIcon,
  Palette
} from 'lucide-react-native';
import { router } from 'expo-router';

interface Experience {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  plays: number;
  rating: number;
  isPublic: boolean;
  createdAt: string;
}

export default function ExperienceManagerScreen() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'The Enchanted Forest',
      description: 'A magical journey through an ancient woodland filled with mystical creatures and hidden secrets.',
      imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
      difficulty: 'Medium',
      estimatedTime: '15-20 min',
      plays: 127,
      rating: 4.8,
      isPublic: true,
      createdAt: '2024-12-01'
    },
    {
      id: '2',
      title: 'Space Station Alpha',
      description: 'Navigate through a futuristic space station while solving puzzles and uncovering alien mysteries.',
      imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
      difficulty: 'Hard',
      estimatedTime: '25-30 min',
      plays: 89,
      rating: 4.6,
      isPublic: false,
      createdAt: '2024-11-28'
    }
  ]);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    estimatedTime: '',
    isPublic: true
  });

  const handleCreateNew = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'Easy',
      estimatedTime: '',
      isPublic: true
    });
    setEditingExperience(null);
    setCreateModalVisible(true);
  };

  const handleEdit = (experience: Experience) => {
    setFormData({
      title: experience.title,
      description: experience.description,
      difficulty: experience.difficulty,
      estimatedTime: experience.estimatedTime,
      isPublic: experience.isPublic
    });
    setEditingExperience(experience);
    setCreateModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (editingExperience) {
      // Update existing experience
      setExperiences(prev => prev.map(exp => 
        exp.id === editingExperience.id 
          ? { ...exp, ...formData }
          : exp
      ));
      Alert.alert('Success', 'Experience updated successfully!');
    } else {
      // Create new experience
      const newExperience: Experience = {
        id: Date.now().toString(),
        ...formData,
        imageUrl: 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg',
        plays: 0,
        rating: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setExperiences(prev => [newExperience, ...prev]);
      Alert.alert('Success', 'New experience created successfully!');
    }

    setCreateModalVisible(false);
  };

  const handleDelete = (experienceId: string) => {
    Alert.alert(
      'Delete Experience',
      'Are you sure you want to delete this experience? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
            Alert.alert('Success', 'Experience deleted successfully');
          }
        }
      ]
    );
  };

  const handlePlay = (experience: Experience) => {
    Alert.alert(
      'Play Experience',
      `Start playing "${experience.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Play', 
          onPress: () => {
            // Update play count
            setExperiences(prev => prev.map(exp => 
              exp.id === experience.id 
                ? { ...exp, plays: exp.plays + 1 }
                : exp
            ));
            router.push('/');
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const renderExperienceCard = (experience: Experience) => (
    <View key={experience.id} style={styles.experienceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardImagePlaceholder}>
          <ImageIcon size={32} color="#9CA3AF" />
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {experience.title}
            </Text>
            <View style={[
              styles.difficultyBadge, 
              { backgroundColor: `${getDifficultyColor(experience.difficulty)}20` }
            ]}>
              <Text style={[
                styles.difficultyText,
                { color: getDifficultyColor(experience.difficulty) }
              ]}>
                {experience.difficulty}
              </Text>
            </View>
          </View>
          
          <Text style={styles.cardDescription} numberOfLines={2}>
            {experience.description}
          </Text>
          
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Clock size={14} color="#9CA3AF" />
              <Text style={styles.statText}>{experience.estimatedTime}</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={14} color="#9CA3AF" />
              <Text style={styles.statText}>{experience.plays} plays</Text>
            </View>
            {experience.rating > 0 && (
              <View style={styles.statItem}>
                <Star size={14} color="#F59E0B" />
                <Text style={styles.statText}>{experience.rating}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handlePlay(experience)}
        >
          <Play size={16} color="#8B5CF6" />
          <Text style={styles.actionButtonText}>Play</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(experience)}
        >
          <Edit size={16} color="#10B981" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(experience.id)}
        >
          <Trash2 size={16} color="#EF4444" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreateModal = () => (
    <Modal
      visible={createModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingExperience ? 'Edit Experience' : 'Create New Experience'}
          </Text>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setCreateModalVisible(false)}
          >
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Title *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Enter experience title"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Description *</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Describe your experience"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Difficulty</Text>
            <View style={styles.difficultySelector}>
              {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyOption,
                    formData.difficulty === level && styles.difficultyOptionSelected,
                    { borderColor: getDifficultyColor(level) }
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                >
                  <Text style={[
                    styles.difficultyOptionText,
                    formData.difficulty === level && { color: getDifficultyColor(level) }
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Estimated Time</Text>
            <TextInput
              style={styles.formInput}
              value={formData.estimatedTime}
              onChangeText={(text) => setFormData(prev => ({ ...prev, estimatedTime: text }))}
              placeholder="e.g., 15-20 min"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.toggleSection}>
              <View>
                <Text style={styles.formLabel}>Make Public</Text>
                <Text style={styles.toggleDescription}>
                  Allow other users to discover and play your experience
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  formData.isPublic && styles.toggleActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
              >
                <View style={[
                  styles.toggleThumb,
                  formData.isPublic && styles.toggleThumbActive
                ]} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.saveButtonGradient}
            >
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>
                {editingExperience ? 'Update Experience' : 'Create Experience'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.modalBottomSpacing} />
        </ScrollView>
      </LinearGradient>
    </Modal>
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
        <Text style={styles.headerTitle}>Experience Manager</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateNew}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Sparkles size={32} color="#8B5CF6" />
          <Text style={styles.introTitle}>Create & Manage Experiences</Text>
          <Text style={styles.introDescription}>
            Design custom story experiences that will be integrated into your personal journey. 
            Create unique narratives, puzzles, and adventures.
          </Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{experiences.length}</Text>
            <Text style={styles.statLabel}>Total Experiences</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {experiences.reduce((sum, exp) => sum + exp.plays, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Plays</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {experiences.filter(exp => exp.isPublic).length}
            </Text>
            <Text style={styles.statLabel}>Public</Text>
          </View>
        </View>

        <View style={styles.experiencesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Experiences</Text>
            <TouchableOpacity 
              style={styles.createSmallButton}
              onPress={handleCreateNew}
            >
              <Plus size={16} color="#8B5CF6" />
              <Text style={styles.createSmallButtonText}>New</Text>
            </TouchableOpacity>
          </View>

          {experiences.length === 0 ? (
            <View style={styles.emptyState}>
              <Palette size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No Experiences Yet</Text>
              <Text style={styles.emptyStateDescription}>
                Create your first custom experience to get started
              </Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={handleCreateNew}>
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  style={styles.emptyStateButtonGradient}
                >
                  <Plus size={20} color="white" />
                  <Text style={styles.emptyStateButtonText}>Create Experience</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.experiencesList}>
              {experiences.map(renderExperienceCard)}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {renderCreateModal()}
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
  createButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  introTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  introDescription: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  experiencesSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  createSmallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  createSmallButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  experiencesList: {
    gap: 16,
  },
  experienceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultyBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
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
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyOption: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  difficultyOptionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  difficultyOptionText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#374151',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#8B5CF6',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBottomSpacing: {
    height: 40,
  },
  bottomSpacing: {
    height: 40,
  },
});