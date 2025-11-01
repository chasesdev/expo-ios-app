import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../design-system';
import { GlassCard } from './glass';
import type { MaterialVariant } from '../../design-system/glass-tokens';
import { useGlassOptimization } from '../../hooks/useGlassOptimization';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'solid' | 'glass' | 'auto';
  glassVariant?: MaterialVariant;
  onPress?: () => void;
  style?: any;
  testID?: string;
}

/**
 * Card component with optional glass effect
 *
 * @example
 * ```tsx
 * // Solid card (default)
 * <Card>
 *   <Text>Content</Text>
 * </Card>
 *
 * // Glass card
 * <Card variant="glass" glassVariant="regular">
 *   <Text>Glass content</Text>
 * </Card>
 *
 * // Auto (respects accessibility settings)
 * <Card variant="auto">
 *   <Text>Adapts based on device/settings</Text>
 * </Card>
 * ```
 */
export function Card({
  children,
  variant = 'solid',
  glassVariant = 'regular',
  onPress,
  style,
  testID,
}: CardProps) {
  const theme = useTheme();
  const { shouldUseGlass } = useGlassOptimization();

  // Auto variant: use glass if supported and enabled
  const effectiveVariant = variant === 'auto'
    ? (shouldUseGlass ? 'glass' : 'solid')
    : variant;

  // Render glass card
  if (effectiveVariant === 'glass') {
    return (
      <GlassCard
        variant={glassVariant}
        onPress={onPress}
        testID={testID}
        style={style}
      >
        {children}
      </GlassCard>
    );
  }

  // Render solid card
  const CardWrapper = onPress ? Pressable : View;

  return (
    <CardWrapper
      onPress={onPress}
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card.rgb,
          borderColor: theme.colors.border.rgb,
          borderRadius: theme.radius.lg,
        },
        style,
      ]}
    >
      {children}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Elevation for Android (fallback)
    elevation: 2,
  },
});
