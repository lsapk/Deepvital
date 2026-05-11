import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/hooks/useAuth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase } from '@/services/database';
import { FloatingAIAssistant } from '@/components/FloatingAIAssistant';

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <FloatingAIAssistant />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
