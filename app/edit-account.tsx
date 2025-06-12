import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Camera,
  Save,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function EditAccountScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (isChangingPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }

      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Your account has been updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Change Avatar',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => {} },
        { text: 'Choose from Gallery', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Account</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {formData.name.charAt(0).toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={handleChangeAvatar}
              >
                <Camera size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Tap to change avatar</Text>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputWrapper, errors.name && styles.inputWrapperError]}>
                <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#6B7280"
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  placeholder="Enter your email"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
          </View>

          {/* Password Section */}
          <View style={styles.section}>
            <View style={styles.passwordHeader}>
              <Text style={styles.sectionTitle}>Password</Text>
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setIsChangingPassword(!isChangingPassword)}
              >
                <Text style={styles.togglePasswordText}>
                  {isChangingPassword ? 'Cancel' : 'Change Password'}
                </Text>
              </TouchableOpacity>
            </View>

            {isChangingPassword && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Current Password</Text>
                  <View style={[styles.inputWrapper, errors.currentPassword && styles.inputWrapperError]}>
                    <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={formData.currentPassword}
                      onChangeText={(text) => updateFormData('currentPassword', text)}
                      placeholder="Enter current password"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showCurrentPassword}
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={20} color="#9CA3AF" />
                      ) : (
                        <Eye size={20} color="#9CA3AF" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <View style={[styles.inputWrapper, errors.newPassword && styles.inputWrapperError]}>
                    <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={formData.newPassword}
                      onChangeText={(text) => updateFormData('newPassword', text)}
                      placeholder="Enter new password"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} color="#9CA3AF" />
                      ) : (
                        <Eye size={20} color="#9CA3AF" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm New Password</Text>
                  <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputWrapperError]}>
                    <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={formData.confirmPassword}
                      onChangeText={(text) => updateFormData('confirmPassword', text)}
                      placeholder="Confirm new password"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color="#9CA3AF" />
                      ) : (
                        <Eye size={20} color="#9CA3AF" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                </View>
              </>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonLoading]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#6B7280', '#4B5563'] : ['#8B5CF6', '#EC4899']}
              style={styles.saveButtonGradient}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingDot} />
                  <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                  <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
                </View>
              ) : (
                <>
                  <Save size={20} color="white" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1a1a2e',
  },
  avatarHint: {
    color: '#9CA3AF',
    fontSize: 14,
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  togglePasswordButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  togglePasswordText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputWrapperError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 16,
    paddingRight: 16,
  },
  eyeButton: {
    padding: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveButtonLoading: {
    opacity: 0.8,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
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
  bottomSpacing: {
    height: 40,
  },
});