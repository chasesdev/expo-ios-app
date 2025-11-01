import React from 'react';
import { Host, VStack } from '@expo/ui/swift-ui';
import { useTheme } from '../../../design-system';
import {
  MaterialVariant,
  getBlurForMaterial,
  getOpacityForMaterial,
  opacityToHex
} from '../../../design-system/glass-tokens';

export interface GlassCardProps {
  children: React.ReactNode;
  variant?: MaterialVariant;
  onPress?: () => void;
  testID?: string;
  style?: any;
}

/**
 * Frosted glass card component with configurable material intensity
 *
 * @example
 * ```tsx
 * <GlassCard variant="regular">
 *   <Text>Card content</Text>
 * </GlassCard>
 * ```
 */
export function GlassCard({
  children,
  variant = 'regular',
  onPress,
  testID,
  style,
}: GlassCardProps) {
  const theme = useTheme();

  const blurRadius = getBlurForMaterial(variant);
  const opacity = getOpacityForMaterial(variant);
  const opacityHex = opacityToHex(opacity);

  const borderOpacity = {
    ultraThin: 0.3,
    thin: 0.4,
    regular: 0.5,
    thick: 0.6,
    ultraThick: 0.7,
    bar: 0.5,
  }[variant];

  return (
    <Host
      testID={testID}
      modifiers={[
        {
          type: 'blur',
          radius: blurRadius,
        },
        {
          type: 'background',
          color: theme.colors.background.rgb + opacityHex,
        },
        {
          type: 'cornerRadius',
          radius: theme.radius.lg,
        },
        {
          type: 'border',
          color: theme.colors.border.rgb,
          width: 1,
          opacity: borderOpacity,
        },
        {
          type: 'shadow',
          color: '#00000015',
          radius: 20,
          x: 0,
          y: 10,
        },
        {
          type: 'compositingGroup',
        },
        ...(onPress ? [{ type: 'onTapGesture' as const }] : []),
      ]}
      style={{
        padding: theme.spacing.md,
        ...style,
      }}
      onTapGesture={onPress}
    >
      <VStack spacing={theme.spacing.sm}>
        {children}
      </VStack>
    </Host>
  );
}
