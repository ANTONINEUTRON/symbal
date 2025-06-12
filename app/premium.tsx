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
  Gift
} from 'lucide-react-native';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PremiumScreen() {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: Infinity,
      title: 'Unlimited Stories',
      description: 'Access to all premium story collections and unlimited gameplay',
      color: '#8B5CF6'
    },
    {
      icon: Zap,
      title: 'Advanced Games',
      description: 'Exclusive puzzle types and challenging mini-games',
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
      id: 'monthly',
      title: 'Monthly',
      price: '$9.99',
      period: '/month',
      description: 'Perfect for trying premium features',
      savings: null
    },
    {
      id: 'yearly',
      title: 'Yearly',
      price: '$79.99',
      period: '/year',
      description: 'Best value for dedicated storytellers',
      savings: 'Save 33%'
    }
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Simulate subscription process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Welcome to Premium!',
        'Your subscription has been activated. Enjoy unlimited access to all premium features!',
        [{ text: 'Start Exploring', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestorePurchases = () => {
    Alert.alert(
      'Restore Purchases',
      'We\'ll check for any existing premium subscriptions linked to your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', onPress: () => {} }
      ]
    );
  };

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
            Experience the full power of Symbal with unlimited stories, 
            exclusive content, and premium features
          </Text>
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

        {/* Pricing Plans */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          
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
                    <Text style={styles.planFeatureText}>All premium features</Text>
                  </View>
                  <View style={styles.planFeature}>
                    <Check size={16} color="#10B981" />
                    <Text style={styles.planFeatureText}>Unlimited access</Text>
                  </View>
                  <View style={styles.planFeature}>
                    <Check size={16} color="#10B981" />
                    <Text style={styles.planFeatureText}>Cancel anytime</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.subscribeButton, isLoading && styles.subscribeButtonLoading]}
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? ['#6B7280', '#4B5563'] : ['#F59E0B', '#EF4444', '#EC4899']}
            style={styles.subscribeButtonGradient}
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
                <Text style={styles.subscribeButtonText}>
                  Start Premium - {plans.find(p => p.id === selectedPlan)?.price}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

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
          
          <Text style={styles.footerNote}>
            Subscription automatically renews unless cancelled at least 24 hours before 
            the end of the current period.
          </Text>
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
  subscribeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  subscribeButtonLoading: {
    opacity: 0.8,
  },
  subscribeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  subscribeButtonText: {
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
  footerNote: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});