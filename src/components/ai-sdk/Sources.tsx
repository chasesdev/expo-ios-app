/**
 * Sources Component
 *
 * Displays a list of sources/citations with collapsible sections and metadata.
 *
 * @example
 * ```tsx
 * import { Sources } from '@/components/ai-sdk';
 *
 * <Sources
 *   sources={exampleSources}
 *   variant="default"
 *   collapsible
 *   onSourceClick={(source) => console.log(source)}
 * />
 * ```
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, Linking } from 'react-native';
import { theme } from '../../theme';

// Source data structure
export interface Source {
  id: string;
  type: 'web' | 'academic' | 'book' | 'article' | 'documentation' | 'other';
  title: string;
  url?: string;
  author?: string;
  date?: string;
  publisher?: string;
  excerpt?: string;
  citation?: string; // Formatted citation
}

// Props interface
export interface SourcesProps {
  sources: Source[];
  variant?: 'default' | 'compact' | 'inline';
  collapsible?: boolean;
  defaultExpanded?: boolean;
  showNumbers?: boolean;
  showExcerpts?: boolean;
  onSourceClick?: (source: Source) => void;
  onCopyCitation?: (source: Source) => void;
  testID?: string;
}

// Helper: Get icon for source type
const getSourceIcon = (type: Source['type']): string => {
  switch (type) {
    case 'web':
      return '🌐';
    case 'academic':
      return '📚';
    case 'book':
      return '📖';
    case 'article':
      return '📰';
    case 'documentation':
      return '📄';
    case 'other':
    default:
      return '📎';
  }
};

// Helper: Format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

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

// Individual Source Item Component
interface SourceItemProps {
  source: Source;
  index: number;
  variant: 'default' | 'compact' | 'inline';
  showNumber: boolean;
  showExcerpt: boolean;
  onPress?: (source: Source) => void;
  onCopy?: (source: Source) => void;
}

const SourceItem: React.FC<SourceItemProps> = ({
  source,
  index,
  variant,
  showNumber,
  showExcerpt,
  onPress,
  onCopy,
}) => {
  const [excerptExpanded, setExcerptExpanded] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress(source);
    } else if (source.url) {
      Linking.openURL(source.url).catch(() => {
        Alert.alert('Error', 'Could not open URL');
      });
    }
  };

  const handleCopy = () => {
    if (onCopy) {
      onCopy(source);
    } else {
      Alert.alert('Copied', 'Citation copied to clipboard');
    }
  };

  const icon = getSourceIcon(source.type);

  // Inline variant - simple text with icon
  if (variant === 'inline') {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.xs,
          paddingVertical: theme.spacing.xs,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        {showNumber && (
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.text.tertiary,
              fontWeight: '600',
              minWidth: 20,
            }}
          >
            [{index + 1}]
          </Text>
        )}
        <Text style={{ fontSize: 14 }}>{icon}</Text>
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.primary,
            textDecorationLine: 'underline',
          }}
        >
          {source.title}
        </Text>
      </Pressable>
    );
  }

  // Compact variant - glass chip style
  if (variant === 'compact') {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          padding: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
          backgroundColor: pressed
            ? `${theme.colors.surface.elevated}${opacityToHex(0.9)}`
            : `${theme.colors.surface.elevated}${opacityToHex(0.7)}`,
          borderWidth: 1,
          borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
        })}
      >
        {showNumber && (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600' }}>
              {index + 1}
            </Text>
          </View>
        )}
        <Text style={{ fontSize: 16 }}>{icon}</Text>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.text.primary,
              fontWeight: '500',
            }}
          >
            {source.title}
          </Text>
          {source.author && (
            <Text
              numberOfLines={1}
              style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.secondary,
                marginTop: 2,
              }}
            >
              {source.author}
            </Text>
          )}
        </View>
        <Pressable
          onPress={handleCopy}
          style={{
            width: 32,
            height: 32,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 14 }}>📋</Text>
        </Pressable>
      </Pressable>
    );
  }

  // Default variant - full card with details
  return (
    <View
      style={{
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.6)}`,
        borderWidth: 1,
        borderColor: `${theme.colors.border.default}${opacityToHex(0.2)}`,
      }}
    >
      {/* Header */}
      <Pressable onPress={handlePress}>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          {showNumber && (
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: '600' }}>
                {index + 1}
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 20 }}>{icon}</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: theme.typography.body.fontSize,
                fontWeight: '600',
                color: theme.colors.text.primary,
                lineHeight: 20,
              }}
            >
              {source.title}
            </Text>
            {source.author && (
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.text.secondary,
                  marginTop: 4,
                }}
              >
                {source.author}
              </Text>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs, marginTop: 4 }}>
              {source.date && (
                <Text
                  style={{
                    fontSize: theme.typography.caption.fontSize,
                    color: theme.colors.text.tertiary,
                  }}
                >
                  {formatDate(source.date)}
                </Text>
              )}
              {source.publisher && (
                <>
                  {source.date && (
                    <Text style={{ color: theme.colors.text.tertiary, fontSize: 10 }}>•</Text>
                  )}
                  <Text
                    style={{
                      fontSize: theme.typography.caption.fontSize,
                      color: theme.colors.text.tertiary,
                    }}
                  >
                    {source.publisher}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* URL */}
        {source.url && (
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.primary,
              marginTop: theme.spacing.sm,
              textDecorationLine: 'underline',
            }}
            numberOfLines={1}
          >
            {source.url}
          </Text>
        )}
      </Pressable>

      {/* Excerpt */}
      {showExcerpt && source.excerpt && (
        <View style={{ marginTop: theme.spacing.sm }}>
          <Text
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.text.secondary,
              lineHeight: 20,
            }}
            numberOfLines={excerptExpanded ? undefined : 3}
          >
            {source.excerpt}
          </Text>
          {source.excerpt.length > 150 && (
            <Pressable onPress={() => setExcerptExpanded(!excerptExpanded)} style={{ marginTop: 4 }}>
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.primary,
                  fontWeight: '600',
                }}
              >
                {excerptExpanded ? 'Show less' : 'Show more'}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Citation */}
      {source.citation && (
        <View
          style={{
            marginTop: theme.spacing.sm,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.4)}`,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.text.secondary,
              fontFamily: 'monospace',
              lineHeight: 16,
            }}
          >
            {source.citation}
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: pressed
              ? `${theme.colors.surface.default}${opacityToHex(0.8)}`
              : `${theme.colors.surface.default}${opacityToHex(0.6)}`,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: theme.spacing.xs,
          })}
        >
          <Text style={{ fontSize: 14 }}>📋</Text>
          <Text
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.text.primary,
              fontWeight: '500',
            }}
          >
            Copy Citation
          </Text>
        </Pressable>
        {source.url && (
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => ({
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm,
              backgroundColor: pressed
                ? `${theme.colors.primary}${opacityToHex(0.9)}`
                : theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <Text style={{ fontSize: 14 }}>↗️</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

// Main Sources Component
export const Sources: React.FC<SourcesProps> = ({
  sources,
  variant = 'default',
  collapsible = false,
  defaultExpanded = true,
  showNumbers = true,
  showExcerpts = true,
  onSourceClick,
  onCopyCitation,
  testID = 'sources',
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (sources.length === 0) {
    return null;
  }

  // Inline variant - horizontal scroll chips
  if (variant === 'inline') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        }}
        testID={testID}
      >
        {sources.map((source, index) => (
          <SourceItem
            key={source.id}
            source={source}
            index={index}
            variant={variant}
            showNumber={showNumbers}
            showExcerpt={false}
            onPress={onSourceClick}
            onCopy={onCopyCitation}
          />
        ))}
      </ScrollView>
    );
  }

  // Default and Compact variants - vertical list with glass container
  return (
    <View
      testID={testID}
      style={{
        ...theme.glass.blur(getBlurForMaterial('regular')),
        backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.8)}`,
        borderRadius: theme.borderRadius.lg,
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
      <Pressable
        onPress={collapsible ? () => setExpanded(!expanded) : undefined}
        disabled={!collapsible}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.md,
          borderBottomWidth: expanded ? 1 : 0,
          borderBottomColor: `${theme.colors.border.default}${opacityToHex(0.2)}`,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <Text style={{ fontSize: 20 }}>📚</Text>
          <Text
            style={{
              fontSize: theme.typography.title3.fontSize,
              fontWeight: '600',
              color: theme.colors.text.primary,
            }}
          >
            Sources
          </Text>
          <View
            style={{
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: 2,
              borderRadius: theme.borderRadius.sm,
              backgroundColor: `${theme.colors.primary}${opacityToHex(0.2)}`,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.primary,
                fontWeight: '600',
              }}
            >
              {sources.length}
            </Text>
          </View>
        </View>
        {collapsible && (
          <Text style={{ fontSize: 16, color: theme.colors.text.secondary }}>
            {expanded ? '▲' : '▼'}
          </Text>
        )}
      </Pressable>

      {/* Sources List */}
      {expanded && (
        <View style={{ padding: theme.spacing.md, gap: theme.spacing.md }}>
          {sources.map((source, index) => (
            <SourceItem
              key={source.id}
              source={source}
              index={index}
              variant={variant}
              showNumber={showNumbers}
              showExcerpt={showExcerpts}
              onPress={onSourceClick}
              onCopy={onCopyCitation}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Example sources for testing
export const exampleSources: Source[] = [
  {
    id: '1',
    type: 'academic',
    title: 'Attention Is All You Need',
    author: 'Vaswani et al.',
    date: '2017-06-12',
    publisher: 'NeurIPS',
    url: 'https://arxiv.org/abs/1706.03762',
    excerpt:
      'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.',
    citation: 'Vaswani, A., et al. (2017). Attention is all you need. In Advances in neural information processing systems (pp. 5998-6008).',
  },
  {
    id: '2',
    type: 'web',
    title: 'React Native Documentation',
    author: 'Meta Open Source',
    date: '2025-10-01',
    publisher: 'React Native',
    url: 'https://reactnative.dev',
    excerpt:
      'React Native combines the best parts of native development with React, a best-in-class JavaScript library for building user interfaces. Use a little—or a lot. You can use React Native today in your existing Android and iOS projects or you can create a whole new app from scratch.',
    citation: 'Meta Open Source. (2025). React Native Documentation. Retrieved from https://reactnative.dev',
  },
  {
    id: '3',
    type: 'article',
    title: 'The State of AI in 2025',
    author: 'Sarah Chen',
    date: '2025-01-15',
    publisher: 'Tech Review',
    url: 'https://techreview.com/ai-2025',
    excerpt:
      'Artificial intelligence has made tremendous strides in 2024, with large language models becoming more capable, efficient, and accessible. The focus has shifted from pure scale to better reasoning, multimodal understanding, and practical deployment.',
    citation: 'Chen, S. (2025, January 15). The State of AI in 2025. Tech Review.',
  },
  {
    id: '4',
    type: 'documentation',
    title: 'TypeScript Handbook',
    author: 'Microsoft',
    date: '2025-09-01',
    publisher: 'TypeScript',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    excerpt:
      'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. TypeScript adds additional syntax to JavaScript to support a tighter integration with your editor.',
    citation: 'Microsoft. (2025). TypeScript Handbook. Retrieved from https://www.typescriptlang.org',
  },
];
