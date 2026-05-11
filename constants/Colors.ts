import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    background: '#FBF9F6',
    surface: '#FFFFFF',
    text: '#1C1C1E',
    secondaryText: '#8E8E93',
    primary: '#007AFF',
    border: '#F2F2F7',
    card: '#FFFFFF',
    accent: '#FF2D55',
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    secondaryText: '#8E8E93',
    primary: '#0A84FF',
    border: '#38383A',
    card: '#1C1C1E',
    accent: '#FF375F',
  },
};

export function useTheme() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? 'light'];
}
