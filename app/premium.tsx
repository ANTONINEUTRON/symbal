import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Crown, 
  Star, 
  Zap, 
  Infinity,
  Shield,
  Sparkles,
  Check,
  Gift,
  ExternalLink
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useUserProgress } from '@/hooks/useUserProgress';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PremiumScreen() {
  const { progress, isPremium, premiumXpThreshold } = useUserProgress();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const currentSYM = progress?.xp || 0;

  const features = [
    {
      icon: Infinity,
      title: 'Experience Manager',
      description: 'Create and manage custom story experiences with unlimited creativity',
      color: '#8B5CF6'
    },
    {
      icon: Zap,
      title: 'Advanced Games',
      description: 'Access to exclusive puzzle types and challenging mini-games',
      color: '#EC4899'
    },
    {
      icon: Star,
      title: 'Priority Support',
      description: '24/7 premium customer support and faster response times',
      color: '#F59E0B'
    },
    {
      icon: Shield,
      title: 'Ad-Free Experience',
      description: 'Enjoy uninterrupted storytelling without any advertisements',
      color: '#10B981'
    },
    {
      icon: Sparkles,
      title: 'Early Access',
      description: 'Be the first to experience new features and story releases',
      color: '#EF4444'
    },
    {
      icon: Gift,
      title: 'Exclusive Content',
      description: 'Premium-only stories, characters, and special events',
      color: '#8B5CF6'
    }
  ];

  const plans = [
    {
      id: 'sym_200k',
      title: '200,000 SYM',
      price: '$5.00',
      period: 'one-time',
      description: 'Perfect for unlocking premium features',
      savings: null,
      symAmount: 200000
    },
    {
      id: 'sym_3m',
      title: '3,000,000 SYM',
      price: '$50.00',
      period: 'one-time',
      description: 'Best value for dedicated storytellers',
      savings: 'Save 67%',
      symAmount: 3000000
    }
  ];

  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      // Show RevenueCat integration instructions
      Alert.alert(
        'RevenueCat Integration Required',
        'To implement mobile payments and subscriptions, you\'ll need to:\n\n' +
        '1. Export your Expo project locally\n' +
        '2. Install RevenueCat SDK\n' +
        '3. Configure Apple App Store / Google Play billing\n' +
        '4. Set up product IDs and entitlements\n\n' +
        'RevenueCat handles all the complex billing logic for mobile apps.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Learn More', 
            onPress: () => {
              Alert.alert(
                'RevenueCat Documentation',
                'Visit the RevenueCat documentation for Expo integration:\n\nhttps://www.revenuecat.com/docs/getting-started/installation/expo\n\nNote: This requires native code and won\'t work in the browser preview.',
                [{ text: 'OK' }]
              );
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestorePurchases = () => {
    Alert.alert(
      'Restore Purchases',
      'We\'ll check for any existing premium purchases linked to your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', onPress: () => {} }
      ]
    );
  };

  if (isPremium) {
    return (
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Premium</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.premiumActiveContainer}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.premiumActiveGradient}
          >
            <Crown size={64} color="white" />
            <Text style={styles.premiumActiveTitle}>Premium Activated!</Text>
            <Text style={styles.premiumActiveDescription}>
              You have {currentSYM.toLocaleString()} SYM and access to all premium features.
            </Text>
            
            <View style={styles.premiumActiveFeatures}>
              <Text style={styles.premiumActiveFeaturesTitle}>✨ Your Premium Benefits:</Text>
              <Text style={styles.premiumActiveFeature}>• Experience Manager unlocked</Text>
              <Text style={styles.premiumActiveFeature}>• Create unlimited custom stories</Text>
              <Text style={styles.premiumActiveFeature}>• Access to exclusive content</Text>
              <Text style={styles.premiumActiveFeature}>• Priority support</Text>
            </View>

            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => router.push('/experience-manager')}
            >
              <View style={styles.manageButtonContent}>
                <Sparkles size={20} color="white" />
                <Text style={styles.manageButtonText}>Open Experience Manager</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.back()}
            >
              <Text style={styles.continueButtonText}>Continue Creating</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0a0a0a', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <LinearGradient
              colors={['#F59E0B', '#EF4444', '#EC4899']}
              style={styles.crownBackground}
            >
              <Crown size={48} color="white" />
            </LinearGradient>
          </View>
          
          <Text style={styles.heroTitle}>Unlock Premium</Text>
          <Text style={styles.heroSubtitle}>
            Experience the full power of Symbal with the Experience Manager, 
            exclusive content, and premium features
          </Text>

          {/* Current Progress */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{currentSYM.toLocaleString()}</Text>
                <Text style={styles.progressStatLabel}>Current SYM</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{premiumXpThreshold.toLocaleString()}</Text>
                <Text style={styles.progressStatLabel}>Required</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>
                  {Math.max(0, premiumXpThreshold - currentSYM).toLocaleString()}
                </Text>
                <Text style={styles.progressStatLabel}>Needed</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                style={[
                  styles.progressFill, 
                  { width: `${Math.min((currentSYM / premiumXpThreshold) * 100, 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round((currentSYM / premiumXpThreshold) * 100)}% to Premium
            </Text>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                  <feature.icon size={24} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* SYM Purchase Options */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Purchase SYM</Text>
          <Text style={styles.pricingSubtitle}>
            Earn SYM through gameplay or purchase to unlock premium features instantly
          </Text>
          
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.savings && (
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>{plan.savings}</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <View style={styles.planPricing}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                </View>
                
                <Text style={styles.planDescription}>{plan.description}</Text>
                
                <View style={styles.planFeatures}>
                  <View style={styles.planFeature}>
                    <Check size={16} color="#10B981" />
                    <Text style={styles.planFeatureText}>
                      {plan.symAmount.toLocaleString()} SYM instantly
                    </Text>
                  </View>
                  <View style={styles.planFeature}>
                    <Check size={16} color="#10B981" />
                    <Text style={styles.planFeatureText}>
                      {plan.symAmount >= premiumXpThreshold ? 'Premium features unlocked' : 'Progress toward premium'}
                    </Text>
                  </View>
                  <View style={styles.planFeature}>
                    <Check size={16} color="#10B981" />
                    <Text style={styles.planFeatureText}>One-time purchase</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[styles.purchaseButton, isLoading && styles.purchaseButtonLoading]}
          onPress={handlePurchase}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? ['#6B7280', '#4B5563'] : ['#F59E0B', '#EF4444', '#EC4899']}
            style={styles.purchaseButtonGradient}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingDot} />
                <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
              </View>
            ) : (
              <>
                <Crown size={20} color="white" />
                <Text style={styles.purchaseButtonText}>
                  Purchase {plans.find(p => p.id === selectedPlan)?.title} - {plans.find(p => p.id === selectedPlan)?.price}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Alternative: Earn SYM */}
        <View style={styles.alternativeSection}>
          <Text style={styles.alternativeTitle}>💡 Prefer to Earn SYM?</Text>
          <Text style={styles.alternativeDescription}>
            Continue playing creative tasks to earn up to 10 SYM per game. 
            Complete {Math.ceil((premiumXpThreshold - currentSYM) / 10)} more games to unlock premium!
          </Text>
          <TouchableOpacity
            style={styles.earnButton}
            onPress={() => router.back()}
          >
            <Text style={styles.earnButtonText}>Continue Playing</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleRestorePurchases}>
            <Text style={styles.footerLink}>Restore Purchases</Text>
          </TouchableOpacity>
          
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.footerText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.revenueCatNote}>
            <ExternalLink size={16} color="#8B5CF6" />
            <Text style={styles.revenueCatText}>
              Mobile payments powered by RevenueCat
            </Text>
          </View>
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  crownContainer: {
    marginBottom: 24,
  },
  crownBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  progressTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressStatLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  progressBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    height: 12,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  pricingSection: {
    marginBottom: 32,
  },
  pricingSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  savingsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPeriod: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  planDescription: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 16,
  },
  planFeatures: {
    gap: 8,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planFeatureText: {
    color: 'white',
    fontSize: 14,
  },
  purchaseButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  purchaseButtonLoading: {
    opacity: 0.8,
  },
  purchaseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
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
  alternativeSection: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  alternativeTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  alternativeDescription: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  earnButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  earnButton: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  premiumActiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  premiumActiveGradient: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  premiumActiveTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  premiumActiveDescription: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  premiumActiveFeatures: {
    width: '100%',
    marginBottom: 32,
  },
  premiumActiveFeaturesTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  premiumActiveFeature: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  manageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  manageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    paddingVertical: 8,
  },
  continueButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  footerLink: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  footerSeparator: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  revenueCatNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  revenueCatText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});