/**
 * InlineCitation Component
 *
 * Displays inline reference citations as tappable chips or superscripts.
 *
 * @example
 * ```tsx
 * import { InlineCitation } from '@/components/ai-sdk';
 *
 * <InlineCitation
 *   numbers={[1, 2]}
 *   variant="chip"
 *   onPress={() => console.log('View citation')}
 * />
 * ```
 */

import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { theme } from '../../theme';
import type { Source } from './Sources';

// Props interface
export interface InlineCitationProps {
  numbers: number[]; // Citation numbers (e.g., [1, 2, 3])
  sources?: Source[]; // Optional: full source data for preview
  variant?: 'superscript' | 'chip' | 'inline';
  showPreview?: boolean; // Show preview on press
  onPress?: (numbers: number[]) => void;
  testID?: string;
}

// Helper: Get glass effect values
const opacityToHex = (opacity: number): string => {
  const hex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return hex.toUpperCase();
};

// Helper: Format citation numbers
const formatCitationNumbers = (numbers: number[]): string => {
  if (numbers.length === 0) return '';
  if (numbers.length === 1) return `${numbers[0]}`;

  // Sort and group consecutive numbers
  const sorted = [...numbers].sort((a, b) => a - b);
  const groups: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    if (i < sorted.length && sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      if (start === end) {
        groups.push(`${start}`);
      } else if (end === start + 1) {
        groups.push(`${start},${end}`);
      } else {
        groups.push(`${start}-${end}`);
      }
      if (i < sorted.length) {
        start = sorted[i];
        end = sorted[i];
      }
    }
  }

  return groups.join(',');
};

// Preview Modal Component
interface CitationPreviewProps {
  numbers: number[];
  sources?: Source[];
  visible: boolean;
  onClose: () => void;
}

const CitationPreview: React.FC<CitationPreviewProps> = ({
  numbers,
  sources,
  visible,
  onClose,
}) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  const relevantSources = sources.filter((_, index) => numbers.includes(index + 1));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 400,
            maxHeight: '80%',
            backgroundColor: theme.colors.surface.elevated,
            borderRadius: theme.borderRadius.lg,
            shadowColor: theme.colors.shadow.default,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
            overflow: 'hidden',
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
              borderBottomColor: theme.colors.border.default,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.title3.fontSize,
                fontWeight: '600',
                color: theme.colors.text.primary,
              }}
            >
              Citation{relevantSources.length > 1 ? 's' : ''}
            </Text>
            <Pressable
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: theme.colors.text.primary }}>×</Text>
            </Pressable>
          </View>

          {/* Content */}
          <View style={{ padding: theme.spacing.md, gap: theme.spacing.md }}>
            {relevantSources.map((source, index) => (
              <View
                key={source.id}
                style={{
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
                  borderWidth: 1,
                  borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
                }}
              >
                <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
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
                      {numbers[index]}
                    </Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: theme.typography.body.fontSize,
                      fontWeight: '600',
                      color: theme.colors.text.primary,
                      lineHeight: 20,
                    }}
                  >
                    {source.title}
                  </Text>
                </View>
                {source.author && (
                  <Text
                    style={{
                      fontSize: theme.typography.caption.fontSize,
                      color: theme.colors.text.secondary,
                      marginBottom: 4,
                    }}
                  >
                    {source.author}
                  </Text>
                )}
                {source.citation && (
                  <Text
                    style={{
                      fontSize: theme.typography.caption.fontSize,
                      color: theme.colors.text.tertiary,
                      fontFamily: 'monospace',
                      lineHeight: 16,
                    }}
                  >
                    {source.citation}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// Main InlineCitation Component
export const InlineCitation: React.FC<InlineCitationProps> = ({
  numbers,
  sources,
  variant = 'chip',
  showPreview = true,
  onPress,
  testID = 'inline-citation',
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);

  if (numbers.length === 0) {
    return null;
  }

  const formattedNumbers = formatCitationNumbers(numbers);

  const handlePress = () => {
    if (onPress) {
      onPress(numbers);
    } else if (showPreview && sources) {
      setPreviewVisible(true);
    }
  };

  // Superscript variant - small text above baseline
  if (variant === 'superscript') {
    return (
      <>
        <Pressable
          testID={testID}
          onPress={handlePress}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            style={{
              fontSize: 10,
              lineHeight: 10,
              color: theme.colors.primary,
              fontWeight: '600',
              textDecorationLine: 'underline',
              verticalAlign: 'top',
            }}
          >
            [{formattedNumbers}]
          </Text>
        </Pressable>
        {showPreview && sources && (
          <CitationPreview
            numbers={numbers}
            sources={sources}
            visible={previewVisible}
            onClose={() => setPreviewVisible(false)}
          />
        )}
      </>
    );
  }

  // Inline variant - text style without background
  if (variant === 'inline') {
    return (
      <>
        <Pressable
          testID={testID}
          onPress={handlePress}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.primary,
              fontWeight: '600',
              textDecorationLine: 'underline',
            }}
          >
            [{formattedNumbers}]
          </Text>
        </Pressable>
        {showPreview && sources && (
          <CitationPreview
            numbers={numbers}
            sources={sources}
            visible={previewVisible}
            onClose={() => setPreviewVisible(false)}
          />
        )}
      </>
    );
  }

  // Chip variant (default) - glass background chip
  return (
    <>
      <Pressable
        testID={testID}
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: theme.borderRadius.sm,
          backgroundColor: pressed
            ? `${theme.colors.primary}${opacityToHex(0.3)}`
            : `${theme.colors.primary}${opacityToHex(0.15)}`,
          borderWidth: 1,
          borderColor: `${theme.colors.primary}${opacityToHex(0.3)}`,
        })}
      >
        <Text
          style={{
            fontSize: 11,
            color: theme.colors.primary,
            fontWeight: '700',
          }}
        >
          [{formattedNumbers}]
        </Text>
      </Pressable>
      {showPreview && sources && (
        <CitationPreview
          numbers={numbers}
          sources={sources}
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
        />
      )}
    </>
  );
};

// Example: Text with inline citations
export const ExampleTextWithCitations: React.FC = () => {
  // Example sources for the citations
  const exampleSources: Source[] = [
    {
      id: '1',
      type: 'academic',
      title: 'Attention Is All You Need',
      author: 'Vaswani et al.',
      date: '2017-06-12',
      citation: 'Vaswani, A., et al. (2017). Attention is all you need.',
    },
    {
      id: '2',
      type: 'article',
      title: 'The State of AI in 2025',
      author: 'Sarah Chen',
      date: '2025-01-15',
      citation: 'Chen, S. (2025). The State of AI in 2025.',
    },
    {
      id: '3',
      type: 'web',
      title: 'React Native Documentation',
      author: 'Meta Open Source',
      date: '2025-10-01',
      citation: 'Meta Open Source. (2025). React Native Documentation.',
    },
  ];

  return (
    <View style={{ padding: theme.spacing.md }}>
      <Text
        style={{
          fontSize: theme.typography.body.fontSize,
          color: theme.colors.text.primary,
          lineHeight: 24,
        }}
      >
        The Transformer architecture{' '}
        <InlineCitation numbers={[1]} sources={exampleSources} variant="chip" />{' '}
        revolutionized natural language processing. Recent advances in AI{' '}
        <InlineCitation numbers={[2]} sources={exampleSources} variant="chip" />{' '}
        have made these models more accessible. Modern frameworks{' '}
        <InlineCitation numbers={[3]} sources={exampleSources} variant="chip" />{' '}
        enable developers to build cross-platform applications with ease.
      </Text>

      <View style={{ marginTop: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Examples of different variants:
        </Text>
        <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <Text style={{ fontSize: 12, color: theme.colors.text.tertiary }}>Chip:</Text>
            <InlineCitation numbers={[1]} sources={exampleSources} variant="chip" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <Text style={{ fontSize: 12, color: theme.colors.text.tertiary }}>Inline:</Text>
            <InlineCitation numbers={[2]} sources={exampleSources} variant="inline" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <Text style={{ fontSize: 12, color: theme.colors.text.tertiary }}>Superscript:</Text>
            <InlineCitation numbers={[3]} sources={exampleSources} variant="superscript" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <Text style={{ fontSize: 12, color: theme.colors.text.tertiary }}>Multiple:</Text>
            <InlineCitation numbers={[1, 2, 3]} sources={exampleSources} variant="chip" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <Text style={{ fontSize: 12, color: theme.colors.text.tertiary }}>Range:</Text>
            <InlineCitation numbers={[1, 2, 3, 4, 5]} sources={exampleSources} variant="chip" />
          </View>
        </View>
      </View>
    </View>
  );
};
