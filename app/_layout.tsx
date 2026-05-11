import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase } from '@/services/database';
import { FloatingAIAssistant } from '@/components/FloatingAIAssistant';

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'onboarding';

    if (!session && inAuthGroup) {
      router.replace('/auth');
    } else if (session && segments[0] === 'auth') {
      router.replace('/onboarding');
    }
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
