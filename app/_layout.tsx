import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initDatabase, getDatabase } from '@/services/database';
import { useRouter, useSegments } from 'expo-router';
import { FloatingAIAssistant } from '@/components/FloatingAIAssistant';
import { View } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function setup() {
      await initDatabase();
      const db = await getDatabase();
      const result = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_settings WHERE key = ?', ['onboarding_completed']);

      const inTabsGroup = segments[0] === '(tabs)';

      if (!result && inTabsGroup) {
        router.replace('/onboarding');
      } else if (result && segments[0] === 'onboarding') {
        router.replace('/(tabs)');
      }
    }
    setup();
  }, [segments]);

  const showFloatingAI = segments[0] === '(tabs)';

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
      {showFloatingAI && <FloatingAIAssistant />}
    </View>
  );
}
