/**
 * Theme Helper
 *
 * Provides a static theme object for components that don't use hooks.
 * For hook-based components, use `useTheme()` from design-system instead.
 */

import { tokens } from './design-system/tokens';
import type { ColorToken } from './design-system/tokens';

// Helper to get RGB value from color token
const getRgb = (token: ColorToken): string => token.rgb;

// Helper for opacity to hex
export const opacityToHex = (opacity: number): string => {
  const hex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return hex.toUpperCase();
};

// Static theme object (uses light theme by default)
// For dynamic light/dark mode, use useTheme() hook instead
export const theme = {
  colors: {
    // Background colors
    background: {
      default: getRgb(tokens.colors.light.background),
      elevated: getRgb(tokens.colors.light.card),
    },

    // Surface colors
    surface: {
      default: getRgb(tokens.colors.light.card),
      elevated: getRgb(tokens.colors.light.popover),
    },

    // Text colors
    text: {
      primary: getRgb(tokens.colors.light.foreground),
      secondary: getRgb(tokens.colors.light.mutedForeground),
      tertiary: '#999999',
    },

    // Brand colors
    primary: getRgb(tokens.colors.light.primary),
    secondary: getRgb(tokens.colors.light.secondary),

    // Status colors
    success: '#22C55E',
    destructive: getRgb(tokens.colors.light.destructive),
    warning: '#F59E0B',

    // Border colors
    border: {
      default: getRgb(tokens.colors.light.border),
    },

    // Shadow
    shadow: {
      default: '#000000',
    },
  },

  // Spacing scale
  spacing: {
    xs: tokens.spacing.xs,
    sm: tokens.spacing.sm,
    md: tokens.spacing.md,
    lg: tokens.spacing.lg,
    xl: tokens.spacing.xl,
    '2xl': tokens.spacing['2xl'],
  },

  // Border radius
  borderRadius: {
    sm: tokens.radius.sm,
    md: tokens.radius.md,
    lg: tokens.radius.lg,
    xl: tokens.radius.xl,
  },

  // Typography
  typography: {
    title1: { fontSize: 28, fontWeight: '700' as const },
    title2: { fontSize: 22, fontWeight: '600' as const },
    title3: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 15, fontWeight: '400' as const },
    caption: { fontSize: 12, fontWeight: '400' as const },
  },

  // Glass effect helpers
  glass: {
    blur: (intensity: number) => ({
      // Note: This is a placeholder. Actual blur is handled by @expo/ui
      // For @expo/ui, use the glass modifiers directly in the component
    }),
    compositingGroup: {
      // Placeholder for compositing group
      // In @expo/ui, this is handled automatically
    },
  },
} as const;
