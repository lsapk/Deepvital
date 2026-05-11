import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Heart, Settings } from 'lucide-react-native';
import { useTheme } from '@/constants/Colors';
import { Platform } from 'react-native';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: Platform.OS === 'ios' ? 95 : 75,
          paddingBottom: Platform.OS === 'ios' ? 35 : 15,
          paddingTop: 12,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 25,
          borderWidth: 1,
          borderColor: theme.border,
        },
        tabBarLabelStyle: {
          fontFamily: 'System',
          fontWeight: '600',
          fontSize: 10,
          marginBottom: 4,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'HEALTH',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'MORE',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
