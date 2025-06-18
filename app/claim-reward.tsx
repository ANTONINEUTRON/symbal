import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Gift, 
  Award, 
  FileText, 
  Upload, 
  Camera,
  Send,
  Info,
  Star
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface RewardExperience {
  id: string;
  title: string;
  description: string;
  rewardType: 'regular' | 'text_input' | 'image_upload';
  rewardCount: number;
  rewardInstructions: string;
  creatorName: string;
  creatorBadge?: string;
}

export default function ClaimRewardScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock experience data - in real app, this would be fetched based on params.experienceId
  const mockExperience: RewardExperience = {
    id: '1',
    title: 'Photography Masterclass',
    description: 'Master the art of photography with hands-on challenges. Capture stunning images using professional techniques.',
    rewardType: 'image_upload',
    rewardCount: 150,
    rewardInstructions: 'Upload your best 3 photos from the assignments. Images will be judged on composition, lighting, and creativity.',
    creatorName: 'Alex Photography',
    creatorBadge: 'Photo Master'
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add your image',
      [
        { text: 'Camera', onPress: () => setSelectedImage('https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg') },
        { text: 'Gallery', onPress: () => setSelectedImage('https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSubmitClaim = async () => {
    if (mockExperience.rewardType === 'text_input' && !textInput.trim()) {
      Alert.alert('Error', 'Please provide the required text information.');
      return;
    }

    if (mockExperience.rewardType === 'image_upload' && !selectedImage) {
      Alert.alert('Error', 'Please upload an image to claim this reward.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Claim Submitted!',
        `Your reward claim for "${mockExperience.title}" has been submitted successfully. You'll be notified once it's reviewed.`,
        [
          { 
            text: 'View My Claims', 
            onPress: () => router.push('/rewards')
          },
          { 
            text: 'Continue', 
            onPress: () => router.back()
          }
        ]
      );
    }, 2000);
  };

  const getRewardTypeInfo = () => {
    switch (mockExperience.rewardType) {
      case 'regular':
        return {
          icon: Award,
          title: 'Creator Badge Reward',
          description: 'Complete the experience to earn the creator\'s exclusive badge.',
          color: '#10B981'
        };
      case 'text_input':
        return {
          icon: FileText,
          title: 'Text Verification Required',
          description: 'Provide the requested information for manual verification.',
          color: '#8B5CF6'
        };
      case 'image_upload':
        return {
          icon: Upload,
          title: 'Image Submission Required',
          description: 'Upload an image as proof of completion for verification.',
          color: '#EC4899'
        };
      default:
        return {
          icon: Gift,
          title: 'Reward',
          description: 'Claim your reward',
          color: '#9CA3AF'
        };
    }
  };

  const rewardInfo = getRewardTypeInfo();
  const RewardIcon = rewardInfo.icon;

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
            You need to be signed in to claim rewards.
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
        <Text style={styles.headerTitle}>Claim Reward</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Experience Info */}
        <View style={styles.experienceCard}>
          <Text style={styles.experienceTitle}>{mockExperience.title}</Text>
          <Text style={styles.experienceDescription}>
            {mockExperience.description}
          </Text>
          
          <View style={styles.creatorInfo}>
            <Text style={styles.creatorLabel}>Created by</Text>
            <Text style={styles.creatorName}>{mockExperience.creatorName}</Text>
          </View>
        </View>

        {/* Reward Info */}
        <View style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <View style={[
              styles.rewardIconContainer,
              { backgroundColor: `${rewardInfo.color}20` }
            ]}>
              <RewardIcon size={24} color={rewardInfo.color} />
            </View>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardTitle}>{rewardInfo.title}</Text>
              <Text style={styles.rewardDescription}>{rewardInfo.description}</Text>
            </View>
          </View>

          <View style={styles.rewardValue}>
            <Star size={20} color="#F59E0B" />
            <Text style={styles.rewardValueText}>+{mockExperience.rewardCount} tokens</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <Info size={20} color="#8B5CF6" />
            <Text style={styles.instructionsTitle}>Instructions</Text>
          </View>
          <Text style={styles.instructionsText}>
            {mockExperience.rewardInstructions}
          </Text>
        </View>

        {/* Submission Form */}
        <View style={styles.submissionCard}>
          <Text style={styles.submissionTitle}>Submit Your Claim</Text>
          
          {mockExperience.rewardType === 'regular' && (
            <View style={styles.regularRewardInfo}>
              <Award size={32} color="#10B981" />
              <Text style={styles.regularRewardTitle}>Automatic Reward</Text>
              <Text style={styles.regularRewardDescription}>
                This reward will be automatically granted upon completion. 
                {mockExperience.creatorBadge && ` You'll receive the "${mockExperience.creatorBadge}" badge.`}
              </Text>
            </View>
          )}

          {mockExperience.rewardType === 'text_input' && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Required Information</Text>
              <TextInput
                style={styles.textInput}
                value={textInput}
                onChangeText={setTextInput}
                placeholder="Enter the requested information..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.inputHint}>
                Provide all requested details as specified in the instructions above.
              </Text>
            </View>
          )}

          {mockExperience.rewardType === 'image_upload' && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Upload Image</Text>
              
              {selectedImage ? (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={handleImagePicker}
                  >
                    <Camera size={16} color="#8B5CF6" />
                    <Text style={styles.changeImageText}>Change Image</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleImagePicker}
                >
                  <Upload size={32} color="#8B5CF6" />
                  <Text style={styles.uploadButtonText}>Select Image</Text>
                  <Text style={styles.uploadButtonHint}>
                    Choose from camera or gallery
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (mockExperience.rewardType === 'text_input' && !textInput.trim()) ||
              (mockExperience.rewardType === 'image_upload' && !selectedImage) ||
              isSubmitting
                ? styles.submitButtonDisabled
                : null
            ]}
            onPress={handleSubmitClaim}
            disabled={
              (mockExperience.rewardType === 'text_input' && !textInput.trim()) ||
              (mockExperience.rewardType === 'image_upload' && !selectedImage) ||
              isSubmitting
            }
          >
            <LinearGradient
              colors={
                (mockExperience.rewardType === 'text_input' && !textInput.trim()) ||
                (mockExperience.rewardType === 'image_upload' && !selectedImage) ||
                isSubmitting
                  ? ['#6B7280', '#4B5563']
                  : ['#8B5CF6', '#EC4899']
              }
              style={styles.submitButtonGradient}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingDot} />
                  <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                  <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
                </View>
              ) : (
                <>
                  <Send size={20} color="white" />
                  <Text style={styles.submitButtonText}>
                    {mockExperience.rewardType === 'regular' ? 'Claim Reward' : 'Submit for Review'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
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
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  experienceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  experienceTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  experienceDescription: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginRight: 8,
  },
  creatorName: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
  },
  rewardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rewardDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 18,
  },
  rewardValue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  rewardValueText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionsCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  instructionsText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
  },
  submissionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  submissionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  regularRewardInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  regularRewardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  regularRewardDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  inputHint: {
    color: '#9CA3AF',
    fontSize: 12,
    fontStyle: 'italic',
  },
  imagePreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  changeImageText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderStyle: 'dashed',
    paddingVertical: 40,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  uploadButtonHint: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 2,
    opacity: 0.4,
  },
  loadingDotDelay1: {
    opacity: 0.7,
  },
  loadingDotDelay2: {
    opacity: 1,
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
  bottomSpacing: {
    height: 40,
  },
});