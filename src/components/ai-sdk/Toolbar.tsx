/**
 * Toolbar Component
 *
 * Displays a toolbar with icon buttons and glass background.
 *
 * @example
 * ```tsx
 * import { Toolbar } from '@/components/ai-sdk';
 *
 * <Toolbar
 *   items={[
 *     { id: '1', icon: '🏠', label: 'Home', onPress: () => {} },
 *     { id: '2', icon: '🔍', label: 'Search', onPress: () => {} },
 *   ]}
 *   position="bottom"
 * />
 * ```
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { theme } from '../../theme';

// Toolbar item structure
export interface ToolbarItem {
  id: string;
  icon: string;
  label?: string;
  badge?: number | string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

// Props interface
export interface ToolbarProps {
  items: ToolbarItem[];
  position?: 'top' | 'bottom';
  variant?: 'default' | 'compact';
  showLabels?: boolean;
  dividerAfter?: string[]; // IDs of items that should have a divider after them
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

// Individual Toolbar Button Component
interface ToolbarButtonProps {
  item: ToolbarItem;
  variant: 'default' | 'compact';
  showLabel: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ item, variant, showLabel }) => {
  const isDisabled = item.disabled;
  const isActive = item.active;

  const iconSize = variant === 'compact' ? 20 : 24;
  const buttonSize = variant === 'compact' ? 40 : 48;

  return (
    <Pressable
      onPress={item.onPress}
      disabled={isDisabled}
      style={({ pressed }) => ({
        alignItems: 'center',
        justifyContent: 'center',
        gap: variant === 'compact' ? 2 : 4,
        paddingHorizontal: variant === 'compact' ? theme.spacing.xs : theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
        backgroundColor: isActive
          ? `${theme.colors.primary}${opacityToHex(0.15)}`
          : pressed
          ? `${theme.colors.surface.default}${opacityToHex(0.3)}`
          : 'transparent',
        opacity: isDisabled ? 0.4 : 1,
        minWidth: buttonSize,
        position: 'relative',
      })}
    >
      {/* Icon */}
      <View style={{ position: 'relative' }}>
        <Text style={{ fontSize: iconSize }}>{item.icon}</Text>
        {/* Badge */}
        {item.badge !== undefined && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -8,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: theme.colors.destructive,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '700',
                color: '#FFFFFF',
              }}
            >
              {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
            </Text>
          </View>
        )}
      </View>

      {/* Label */}
      {showLabel && item.label && (
        <Text
          numberOfLines={1}
          style={{
            fontSize: variant === 'compact' ? 10 : 11,
            fontWeight: isActive ? '600' : '500',
            color: isActive ? theme.colors.primary : theme.colors.text.secondary,
          }}
        >
          {item.label}
        </Text>
      )}
    </Pressable>
  );
};

// Main Toolbar Component
export const Toolbar: React.FC<ToolbarProps> = ({
  items,
  position = 'bottom',
  variant = 'default',
  showLabels = true,
  dividerAfter = [],
  testID = 'toolbar',
}) => {
  if (items.length === 0) {
    return null;
  }

  const isTop = position === 'top';
  const isBottom = position === 'bottom';

  return (
    <View
      testID={testID}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: variant === 'compact' ? theme.spacing.sm : theme.spacing.md,
        paddingVertical: variant === 'compact' ? theme.spacing.xs : theme.spacing.sm,
        paddingTop: isTop ? theme.spacing.lg + theme.spacing.sm : undefined,
        paddingBottom: isBottom ? theme.spacing.lg + theme.spacing.sm : undefined,
        ...theme.glass.blur(getBlurForMaterial('thick')),
        backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.95)}`,
        borderTopWidth: isBottom ? 1 : 0,
        borderBottomWidth: isTop ? 1 : 0,
        borderColor: `${theme.colors.border.default}${opacityToHex(0.2)}`,
        shadowColor: theme.colors.shadow.default,
        shadowOffset: { width: 0, height: isBottom ? -2 : 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        ...theme.glass.compositingGroup,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: theme.spacing.xs,
        }}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <ToolbarButton item={item} variant={variant} showLabel={showLabels} />
            {/* Divider */}
            {dividerAfter.includes(item.id) && index < items.length - 1 && (
              <View
                style={{
                  width: 1,
                  height: variant === 'compact' ? 24 : 32,
                  backgroundColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
                  marginHorizontal: theme.spacing.xs,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

// Example toolbars for testing
export const exampleToolbars = {
  bottomNavigation: [
    {
      id: 'home',
      icon: '🏠',
      label: 'Home',
      active: true,
      onPress: () => console.log('Home'),
    },
    {
      id: 'search',
      icon: '🔍',
      label: 'Search',
      onPress: () => console.log('Search'),
    },
    {
      id: 'notifications',
      icon: '🔔',
      label: 'Notifications',
      badge: 5,
      onPress: () => console.log('Notifications'),
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile',
      onPress: () => console.log('Profile'),
    },
  ],

  chatToolbar: [
    {
      id: 'attach',
      icon: '📎',
      label: 'Attach',
      onPress: () => console.log('Attach'),
    },
    {
      id: 'camera',
      icon: '📷',
      label: 'Camera',
      onPress: () => console.log('Camera'),
    },
    {
      id: 'voice',
      icon: '🎤',
      label: 'Voice',
      onPress: () => console.log('Voice'),
    },
    {
      id: 'stickers',
      icon: '😊',
      label: 'Stickers',
      onPress: () => console.log('Stickers'),
    },
  ],

  editorToolbar: [
    {
      id: 'bold',
      icon: '𝐁',
      onPress: () => console.log('Bold'),
    },
    {
      id: 'italic',
      icon: '𝘐',
      onPress: () => console.log('Italic'),
    },
    {
      id: 'underline',
      icon: 'U̲',
      onPress: () => console.log('Underline'),
    },
    {
      id: 'link',
      icon: '🔗',
      onPress: () => console.log('Link'),
    },
    {
      id: 'image',
      icon: '🖼️',
      onPress: () => console.log('Image'),
    },
    {
      id: 'code',
      icon: '💻',
      onPress: () => console.log('Code'),
    },
  ],

  mediaToolbar: [
    {
      id: 'play',
      icon: '▶️',
      label: 'Play',
      active: true,
      onPress: () => console.log('Play'),
    },
    {
      id: 'prev',
      icon: '⏮️',
      label: 'Previous',
      onPress: () => console.log('Previous'),
    },
    {
      id: 'next',
      icon: '⏭️',
      label: 'Next',
      onPress: () => console.log('Next'),
    },
    {
      id: 'shuffle',
      icon: '🔀',
      label: 'Shuffle',
      onPress: () => console.log('Shuffle'),
    },
    {
      id: 'repeat',
      icon: '🔁',
      label: 'Repeat',
      onPress: () => console.log('Repeat'),
    },
  ],

  withDividers: [
    {
      id: 'undo',
      icon: '↶',
      label: 'Undo',
      onPress: () => console.log('Undo'),
    },
    {
      id: 'redo',
      icon: '↷',
      label: 'Redo',
      onPress: () => console.log('Redo'),
    },
    {
      id: 'cut',
      icon: '✂️',
      label: 'Cut',
      onPress: () => console.log('Cut'),
    },
    {
      id: 'copy',
      icon: '📋',
      label: 'Copy',
      onPress: () => console.log('Copy'),
    },
    {
      id: 'paste',
      icon: '📄',
      label: 'Paste',
      onPress: () => console.log('Paste'),
    },
  ],
};

// Example: Multiple Toolbars
export const ExampleToolbarsDemo: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.default }}>
      {/* Content area */}
      <View style={{ flex: 1, padding: theme.spacing.lg, gap: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: theme.typography.title2.fontSize,
            fontWeight: '600',
            color: theme.colors.text.primary,
          }}
        >
          Toolbar Examples
        </Text>

        <View style={{ gap: theme.spacing.md }}>
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.text.secondary,
            }}
          >
            Bottom Navigation (shown at bottom)
          </Text>
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.text.secondary,
            }}
          >
            Chat Toolbar (shown at bottom)
          </Text>
        </View>
      </View>

      {/* Top Toolbar */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <Toolbar
          items={exampleToolbars.editorToolbar}
          position="top"
          variant="compact"
          showLabels={false}
        />
      </View>

      {/* Bottom Toolbar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Toolbar
          items={exampleToolbars.bottomNavigation}
          position="bottom"
          variant="default"
          showLabels={true}
        />
      </View>
    </View>
  );
};
