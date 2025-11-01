import React from 'react';
import { HStack, VStack, Text } from '@expo/ui/swift-ui';
import { Host } from '../common/SwiftUIHost';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../design-system';
import {
  MaterialVariant,
  getBlurForMaterial,
  getOpacityForMaterial,
  opacityToHex,
} from '../../design-system/glass-tokens';

export interface SuggestionOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface SuggestionProps {
  options: SuggestionOption[];
  onSelect: (option: SuggestionOption) => void;
  variant?: 'default' | 'compact' | 'inline';
  layout?: 'horizontal' | 'vertical' | 'grid';
  title?: string;
  showIcons?: boolean;
  multiSelect?: boolean;
  selectedIds?: string[];
  testID?: string;
}

/**
 * AI SDK Suggestion component with chip-style buttons
 *
 * Displays a list of suggestion options that users can tap to quickly
 * select predefined responses or actions. Supports multiple layouts
 * and glass effects.
 *
 * @example
 * ```tsx
 * <Suggestion
 *   options={[
 *     { id: '1', label: 'Tell me more', icon: '💬' },
 *     { id: '2', label: 'Show examples', icon: '📚' },
 *   ]}
 *   onSelect={(option) => console.log(option)}
 * />
 * ```
 */
export function Suggestion({
  options,
  onSelect,
  variant = 'default',
  layout = 'horizontal',
  title,
  showIcons = true,
  multiSelect = false,
  selectedIds = [],
  testID,
}: SuggestionProps) {
  const theme = useTheme();

  const glassVariant: MaterialVariant = 'ultraThin';
  const blurRadius = getBlurForMaterial(glassVariant);
  const opacity = getOpacityForMaterial(glassVariant);
  const opacityHex = opacityToHex(opacity);

  const isSelected = (id: string) => selectedIds.includes(id);

  const renderSuggestionChip = (option: SuggestionOption) => {
    const selected = isSelected(option.id);

    if (variant === 'compact') {
      return (
        <TouchableOpacity key={option.id} onPress={() => onSelect(option)}>
          <Host
            modifiers={[
              {
                type: 'background',
                color: selected
                  ? theme.colors.primary.rgb
                  : theme.colors.muted.rgb,
              },
              { type: 'cornerRadius', radius: theme.radius.sm },
            ]}
            style={{ paddingHorizontal: 10, paddingVertical: 6 }}
          >
            <HStack spacing={4} style={{ alignItems: 'center' }}>
              {showIcons && option.icon && (
                <Text style={{ fontSize: 12 }}>{option.icon}</Text>
              )}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: selected ? '#FFFFFF' : theme.colors.foreground.rgb,
                }}
              >
                {option.label}
              </Text>
            </HStack>
          </Host>
        </TouchableOpacity>
      );
    }

    if (variant === 'inline') {
      return (
        <TouchableOpacity key={option.id} onPress={() => onSelect(option)}>
          <Host
            modifiers={[
              {
                type: 'background',
                color: selected
                  ? theme.colors.primary.rgb + '20'
                  : 'transparent',
              },
              {
                type: 'border',
                color: selected ? theme.colors.primary.rgb : theme.colors.border.rgb,
                width: 1,
                opacity: selected ? 0.6 : 0.3,
              },
              { type: 'cornerRadius', radius: theme.radius.sm },
            ]}
            style={{ paddingHorizontal: 12, paddingVertical: 8 }}
          >
            <HStack spacing={6} style={{ alignItems: 'center' }}>
              {showIcons && option.icon && (
                <Text style={{ fontSize: 14 }}>{option.icon}</Text>
              )}
              <Text style={{ fontSize: 13, fontWeight: '500' }}>
                {option.label}
              </Text>
            </HStack>
          </Host>
        </TouchableOpacity>
      );
    }

    // Default variant - glass chip
    return (
      <TouchableOpacity key={option.id} onPress={() => onSelect(option)}>
        <Host
          modifiers={[
            { type: 'blur', radius: blurRadius },
            {
              type: 'background',
              color: selected
                ? theme.colors.primary.rgb + '40'
                : theme.colors.background.rgb + opacityHex,
            },
            {
              type: 'border',
              color: selected ? theme.colors.primary.rgb : theme.colors.border.rgb,
              width: selected ? 1.5 : 1,
              opacity: selected ? 0.8 : 0.3,
            },
            { type: 'cornerRadius', radius: theme.radius.md },
            {
              type: 'shadow',
              color: '#00000005',
              radius: 8,
              x: 0,
              y: 2,
            },
            { type: 'compositingGroup' },
          ]}
          style={{ padding: theme.spacing.sm }}
        >
          <VStack spacing={4}>
            <HStack spacing={8} style={{ alignItems: 'center' }}>
              {showIcons && option.icon && (
                <Text style={{ fontSize: 18 }}>{option.icon}</Text>
              )}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: selected ? theme.colors.primary.rgb : theme.colors.foreground.rgb,
                }}
              >
                {option.label}
              </Text>
            </HStack>
            {option.description && (
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.mutedForeground.rgb,
                  lineHeight: 16,
                }}
              >
                {option.description}
              </Text>
            )}
          </VStack>
        </Host>
      </TouchableOpacity>
    );
  };

  // Horizontal scrollable layout
  if (layout === 'horizontal') {
    return (
      <Host testID={testID}>
        <VStack spacing={8}>
          {title && (
            <Text style={{ fontSize: 13, fontWeight: '500', paddingHorizontal: theme.spacing.xs }}>
              {title}
            </Text>
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: theme.spacing.xs, gap: 8 }}
          >
            {options.map((option) => renderSuggestionChip(option))}
          </ScrollView>
        </VStack>
      </Host>
    );
  }

  // Vertical list layout
  if (layout === 'vertical') {
    return (
      <Host testID={testID} style={{ padding: theme.spacing.xs }}>
        <VStack spacing={8}>
          {title && (
            <Text style={{ fontSize: 14, fontWeight: '600' }}>
              {title}
            </Text>
          )}
          {options.map((option) => renderSuggestionChip(option))}
        </VStack>
      </Host>
    );
  }

  // Grid layout
  return (
    <Host testID={testID} style={{ padding: theme.spacing.xs }}>
      <VStack spacing={12}>
        {title && (
          <Text style={{ fontSize: 14, fontWeight: '600' }}>
            {title}
          </Text>
        )}
        <Host style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {options.map((option) => renderSuggestionChip(option))}
        </Host>
      </VStack>
    </Host>
  );
}

// Example suggestions for testing
export const exampleSuggestions: SuggestionOption[] = [
  {
    id: '1',
    label: 'Tell me more',
    icon: '💬',
    description: 'Get more details about this topic',
  },
  {
    id: '2',
    label: 'Show examples',
    icon: '📚',
    description: 'See practical code examples',
  },
  {
    id: '3',
    label: 'Explain differently',
    icon: '🔄',
    description: 'Rephrase the explanation',
  },
  {
    id: '4',
    label: 'Start over',
    icon: '🆕',
    description: 'Begin a new conversation',
  },
];

export const quickActionSuggestions: SuggestionOption[] = [
  {
    id: 'code',
    label: 'Write code',
    icon: '💻',
  },
  {
    id: 'explain',
    label: 'Explain',
    icon: '📖',
  },
  {
    id: 'debug',
    label: 'Debug',
    icon: '🐛',
  },
  {
    id: 'optimize',
    label: 'Optimize',
    icon: '⚡',
  },
  {
    id: 'test',
    label: 'Write tests',
    icon: '🧪',
  },
];
