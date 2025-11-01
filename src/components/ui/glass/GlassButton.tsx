import React, { useState } from 'react';
import { Text as RNText, View } from 'react-native';
import { Host } from '../../common/SwiftUIHost';
import { useTheme } from '../../../design-system';
import { glassTokens, opacityToHex } from '../../../design-system/glass-tokens';

export type GlassButtonStyle = 'primary' | 'secondary' | 'destructive' | 'ghost';

export interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: GlassButtonStyle;
  icon?: string; // SF Symbol name
  fullWidth?: boolean;
  disabled?: boolean;
  testID?: string;
  buttonStyle?: any; // Custom style overrides
}

/**
 * Interactive glass button with press animation and haptic feedback
 *
 * @example
 * ```tsx
 * <GlassButton
 *   title="Submit"
 *   style="primary"
 *   onPress={() => console.log('Pressed')}
 * />
 * ```
 */
export function GlassButton({
  title,
  onPress,
  style = 'primary',
  icon,
  fullWidth = false,
  disabled = false,
  testID,
  buttonStyle,
}: GlassButtonProps) {
  const theme = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const getForegroundColor = () => {
    switch (style) {
      case 'primary':
        return theme.colors.primaryForeground.rgb;
      case 'secondary':
        return theme.colors.secondaryForeground.rgb;
      case 'destructive':
        return theme.colors.destructiveForeground.rgb;
      case 'ghost':
        return theme.colors.foreground.rgb;
    }
  };

  const getBackgroundColor = () => {
    switch (style) {
      case 'primary':
        return theme.colors.primary.rgb;
      case 'secondary':
        return theme.colors.secondary.rgb;
      case 'destructive':
        return theme.colors.destructive.rgb;
      case 'ghost':
        return theme.colors.background.rgb + opacityToHex(0.05);
    }
  };

  return (
    <Host
      testID={testID}
      modifiers={[
        ...(style !== 'ghost'
          ? [
              {
                type: 'background' as const,
                color: getBackgroundColor(),
              },
            ]
          : []),
        {
          type: 'blur',
          radius: glassTokens.blur.medium,
        },
        {
          type: 'cornerRadius',
          radius: 100, // Capsule shape
        },
        {
          type: 'border',
          color: theme.colors.border.rgb,
          width: 1,
          opacity: 0.5,
        },
        {
          type: 'shadow',
          color: '#00000010',
          radius: 4,
          x: 0,
          y: 2,
        },
        {
          type: 'scaleEffect',
          scale: isPressed ? 0.95 : 1.0,
        },
        {
          type: 'animation',
          animation: {
            type: 'spring',
            response: glassTokens.performance.springResponse,
            dampingFraction: glassTokens.performance.springDampingFraction,
          },
          animatedValue: isPressed,
        },
        {
          type: 'compositingGroup',
        },
        {
          type: 'onTapGesture',
        },
      ]}
      style={{
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        ...(fullWidth ? { width: '100%' } : {}),
        opacity: disabled ? 0.5 : 1,
        ...buttonStyle,
      }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onTapGesture={disabled ? undefined : onPress}
    >
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
        {icon && (
          <RNText style={{ color: getForegroundColor(), fontSize: 16 }}>
            {icon}
          </RNText>
        )}
        <RNText style={{ color: getForegroundColor(), fontWeight: '500', fontSize: 14 }}>
          {title}
        </RNText>
      </View>
    </Host>
  );
}
