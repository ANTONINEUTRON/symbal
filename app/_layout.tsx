import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="edit-account" />
          <Stack.Screen name="premium" />
          <Stack.Screen name="achievements" />
          <Stack.Screen name="experience-manager" />
          <Stack.Screen name="rewards" />
          <Stack.Screen name="claim-reward" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}