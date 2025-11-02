import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { tokens, lightColors, darkColors } from '../design-system/tokens';

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  colors: typeof lightColors;
  radius: typeof tokens.radius;
  spacing: typeof tokens.spacing;
  isDark: boolean;
}

/**
 * Hook to access the current theme based on device color scheme
 * Automatically switches between light and dark mode
 * Memoized for performance - prevents unnecessary re-renders
 */
export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return useMemo(() => ({
    colors: isDark ? darkColors : lightColors,
    radius: tokens.radius,
    spacing: tokens.spacing,
    isDark,
  }), [isDark]);
}

/**
 * Get colors for a specific color scheme
 */
export function getColors(scheme: ColorScheme) {
  return scheme === 'dark' ? darkColors : lightColors;
}
