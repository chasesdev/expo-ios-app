/**
 * OpenInChat Component
 *
 * Displays a call-to-action button/card to open content in a chat interface.
 *
 * @example
 * ```tsx
 * import { OpenInChat } from '@/components/ai-sdk';
 *
 * <OpenInChat
 *   title="Continue this conversation"
 *   description="Open in chat to get personalized help"
 *   variant="card"
 *   onPress={() => console.log('Open in chat')}
 * />
 * ```
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { theme } from '../../theme';

// Props interface
export interface OpenInChatProps {
  title?: string;
  description?: string;
  icon?: string;
  buttonLabel?: string;
  variant?: 'button' | 'card' | 'banner';
  dismissible?: boolean;
  preview?: string; // Preview of content to be opened
  onPress: () => void;
  onDismiss?: () => void;
  testID?: string;
}

// Helper: Get glass effect values
const getBlurForMaterial = (variant: string): number => {
  switch (variant) {
    case 'thin':
      return 10;
    case 'regular':
      return 20;
    case 'thick':
      return 30;
    default:
      return 20;
  }
};

const opacityToHex = (opacity: number): string => {
  const hex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return hex.toUpperCase();
};

export const OpenInChat: React.FC<OpenInChatProps> = ({
  title = 'Open in Chat',
  description,
  icon = '💬',
  buttonLabel = 'Open Chat',
  variant = 'card',
  dismissible = false,
  preview,
  onPress,
  onDismiss,
  testID = 'open-in-chat',
}) => {
  // Button variant - simple CTA button
  if (variant === 'button') {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.sm,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.borderRadius.md,
          backgroundColor: pressed
            ? `${theme.colors.primary}${opacityToHex(0.9)}`
            : theme.colors.primary,
          shadowColor: theme.colors.shadow.default,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        })}
      >
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        <Text
          style={{
            fontSize: theme.typography.body.fontSize,
            fontWeight: '600',
            color: '#FFFFFF',
          }}
        >
          {buttonLabel}
        </Text>
      </Pressable>
    );
  }

  // Banner variant - horizontal banner with dismiss
  if (variant === 'banner') {
    return (
      <View
        testID={testID}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          padding: theme.spacing.md,
          ...theme.glass.blur(getBlurForMaterial('thin')),
          backgroundColor: `${theme.colors.primary}${opacityToHex(0.15)}`,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: `${theme.colors.primary}${opacityToHex(0.3)}`,
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: `${theme.colors.primary}${opacityToHex(0.2)}`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: theme.typography.body.fontSize,
              fontWeight: '600',
              color: theme.colors.text.primary,
            }}
          >
            {title}
          </Text>
          {description && (
            <Text
              numberOfLines={1}
              style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.secondary,
                marginTop: 2,
              }}
            >
              {description}
            </Text>
          )}
        </View>

        {/* Action Button */}
        <Pressable
          onPress={onPress}
          style={({ pressed }) => ({
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: pressed
              ? `${theme.colors.primary}${opacityToHex(0.9)}`
              : theme.colors.primary,
          })}
        >
          <Text
            style={{
              fontSize: theme.typography.body.fontSize,
              fontWeight: '600',
              color: '#FFFFFF',
            }}
          >
            Open
          </Text>
        </Pressable>

        {/* Dismiss Button */}
        {dismissible && onDismiss && (
          <Pressable
            onPress={onDismiss}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>×</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // Card variant (default) - full card with preview
  return (
    <View
      testID={testID}
      style={{
        borderRadius: theme.borderRadius.lg,
        ...theme.glass.blur(getBlurForMaterial('regular')),
        backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.8)}`,
        borderWidth: 1,
        borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
        shadowColor: theme.colors.shadow.default,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
        ...theme.glass.compositingGroup,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: `${theme.colors.border.default}${opacityToHex(0.2)}`,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          {/* Icon */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${theme.colors.primary}${opacityToHex(0.2)}`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 20 }}>{icon}</Text>
          </View>

          {/* Title */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: theme.typography.title3.fontSize,
                fontWeight: '600',
                color: theme.colors.text.primary,
              }}
            >
              {title}
            </Text>
            {description && (
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.text.secondary,
                  marginTop: 2,
                }}
              >
                {description}
              </Text>
            )}
          </View>
        </View>

        {/* Dismiss Button */}
        {dismissible && onDismiss && (
          <Pressable
            onPress={onDismiss}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>×</Text>
          </Pressable>
        )}
      </View>

      {/* Preview */}
      {preview && (
        <View
          style={{
            padding: theme.spacing.md,
            backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.3)}`,
            borderBottomWidth: 1,
            borderBottomColor: `${theme.colors.border.default}${opacityToHex(0.2)}`,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.text.tertiary,
              fontWeight: '600',
              marginBottom: theme.spacing.xs,
            }}
          >
            PREVIEW
          </Text>
          <Text
            numberOfLines={3}
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.text.secondary,
              lineHeight: 20,
              fontFamily: 'monospace',
            }}
          >
            {preview}
          </Text>
        </View>
      )}

      {/* Action Button */}
      <View style={{ padding: theme.spacing.md }}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => ({
            paddingVertical: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            backgroundColor: pressed
              ? `${theme.colors.primary}${opacityToHex(0.9)}`
              : theme.colors.primary,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            shadowColor: theme.colors.shadow.default,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 2,
          })}
        >
          <Text style={{ fontSize: 18 }}>{icon}</Text>
          <Text
            style={{
              fontSize: theme.typography.body.fontSize,
              fontWeight: '600',
              color: '#FFFFFF',
            }}
          >
            {buttonLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

// Example use cases
export const exampleOpenInChat = {
  simpleButton: {
    variant: 'button' as const,
    onPress: () => console.log('Open chat'),
  },

  bannerWithDismiss: {
    title: 'Need help?',
    description: 'Chat with our AI assistant',
    variant: 'banner' as const,
    dismissible: true,
    onPress: () => console.log('Open chat'),
    onDismiss: () => console.log('Dismissed'),
  },

  cardWithPreview: {
    title: 'Continue in Chat',
    description: 'Get personalized assistance with your code',
    preview:
      'function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}',
    variant: 'card' as const,
    buttonLabel: 'Open in Chat',
    onPress: () => console.log('Open chat'),
  },

  cardWithoutPreview: {
    title: 'Ask About This Topic',
    description: 'Learn more in an interactive conversation',
    icon: '🤖',
    variant: 'card' as const,
    buttonLabel: 'Start Chatting',
    dismissible: true,
    onPress: () => console.log('Open chat'),
    onDismiss: () => console.log('Dismissed'),
  },

  helpBanner: {
    title: 'Stuck on something?',
    description: "Let's chat about it",
    icon: '💡',
    variant: 'banner' as const,
    onPress: () => console.log('Open chat'),
  },
};

// Example: Different variants
export const ExampleOpenInChatVariants: React.FC = () => {
  return (
    <View style={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}>
      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Button Variant
        </Text>
        <OpenInChat {...exampleOpenInChat.simpleButton} />
      </View>

      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Banner Variant (Dismissible)
        </Text>
        <OpenInChat {...exampleOpenInChat.bannerWithDismiss} />
      </View>

      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Card Variant (With Preview)
        </Text>
        <OpenInChat {...exampleOpenInChat.cardWithPreview} />
      </View>

      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Card Variant (Without Preview, Dismissible)
        </Text>
        <OpenInChat {...exampleOpenInChat.cardWithoutPreview} />
      </View>

      <View>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Help Banner
        </Text>
        <OpenInChat {...exampleOpenInChat.helpBanner} />
      </View>
    </View>
  );
};
