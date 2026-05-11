import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase, getDatabase } from '@/services/database';
import { FloatingAIAssistant } from '@/components/FloatingAIAssistant';

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    async function checkNavigation() {
      if (isLoading) return;

      const db = await initDatabase().then(() => getDatabase());
      const onboardingCompleted = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_settings WHERE key = ?', ['onboarding_completed']);

      const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'onboarding';

      if (!session && inAuthGroup) {
        router.replace('/auth');
      } else if (session && segments[0] === 'auth') {
        if (onboardingCompleted?.value === 'true') {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/onboarding');
        }
      } else if (session && segments[0] === 'onboarding' && onboardingCompleted?.value === 'true') {
        router.replace('/(tabs)/home');
      }
    }
    checkNavigation().catch(console.error);
  }, [session, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootLayoutNav />
        <FloatingAIAssistant />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
