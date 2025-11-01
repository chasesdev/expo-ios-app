import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Host, VStack, HStack } from '@expo/ui/swift-ui';
import { useTheme } from '../../design-system';
import { GlassCard } from '../ui/glass';

export type ReasoningData = {
  id: string;
  thought: string;
  evidence?: string[];
  confidence?: number; // 0-1
  type?: 'analysis' | 'inference' | 'conclusion' | 'question';
  timestamp?: Date;
};

export interface ReasoningProps {
  reasoning: ReasoningData[];
  variant?: 'default' | 'compact';
  showTimestamps?: boolean;
  testID?: string;
}

const typeConfig = {
  analysis: { icon: '🔍', label: 'Analysis', color: '#3B82F6' },
  inference: { icon: '💭', label: 'Inference', color: '#8B5CF6' },
  conclusion: { icon: '💡', label: 'Conclusion', color: '#10B981' },
  question: { icon: '❓', label: 'Question', color: '#F59E0B' },
};

/**
 * Reasoning component for displaying AI thinking process
 */
export function Reasoning({
  reasoning,
  variant = 'default',
  showTimestamps = false,
  testID,
}: ReasoningProps) {
  const theme = useTheme();

  return (
    <GlassCard variant="regular" style={{ alignSelf: 'stretch' }} testID={testID}>
      <VStack spacing={variant === 'compact' ? 8 : 12}>
        <RNText style={[styles.title, { color: theme.colors.foreground.rgb }]}>
          🤔 Reasoning Process
        </RNText>

        <VStack spacing={variant === 'compact' ? 6 : 10}>
          {reasoning.map((item, index) => {
            const config = item.type ? typeConfig[item.type] : typeConfig.analysis;
            const confidenceColor = !item.confidence ? '#6B7280' :
              item.confidence >= 0.8 ? '#10B981' :
              item.confidence >= 0.6 ? '#F59E0B' : '#EF4444';

            return (
              <Host
                key={item.id}
                modifiers={[
                  { type: 'background', color: theme.colors.muted.rgb },
                  { type: 'cornerRadius', radius: theme.radius.md },
                  { type: 'border', color: config.color, width: 1, opacity: 0.3 },
                ]}
                style={{ padding: 12 }}
              >
                <VStack spacing={8}>
                  <HStack spacing={8} style={{ alignItems: 'center' }}>
                    <RNText style={{ fontSize: 18 }}>{config.icon}</RNText>
                    <RNText style={[styles.typeLabel, { color: config.color }]}>
                      {config.label}
                    </RNText>
                    {typeof item.confidence === 'number' && (
                      <RNText style={[styles.confidence, { color: confidenceColor }]}>
                        {Math.round(item.confidence * 100)}%
                      </RNText>
                    )}
                  </HStack>

                  <RNText style={[styles.thought, { color: theme.colors.foreground.rgb }]}>
                    {item.thought}
                  </RNText>

                  {item.evidence && item.evidence.length > 0 && (
                    <VStack spacing={4}>
                      {item.evidence.map((ev, idx) => (
                        <RNText key={idx} style={[styles.evidence, { color: theme.colors.mutedForeground.rgb }]}>
                          • {ev}
                        </RNText>
                      ))}
                    </VStack>
                  )}

                  {showTimestamps && item.timestamp && (
                    <RNText style={[styles.timestamp, { color: theme.colors.mutedForeground.rgb }]}>
                      {item.timestamp.toLocaleTimeString()}
                    </RNText>
                  )}
                </VStack>
              </Host>
            );
          })}
        </VStack>
      </VStack>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  typeLabel: { fontSize: 12, fontWeight: '600' },
  confidence: { fontSize: 11, fontWeight: '600', marginLeft: 'auto' },
  thought: { fontSize: 13, lineHeight: 19 },
  evidence: { fontSize: 12, lineHeight: 17 },
  timestamp: { fontSize: 10, marginTop: 4 },
});

export const exampleReasoning: ReasoningData[] = [
  {
    id: 'r1',
    type: 'analysis',
    thought: 'The error occurs in the authentication middleware',
    evidence: ['Stack trace points to auth.js:45', 'Error: "Invalid token"', 'Only happens with expired tokens'],
    confidence: 0.9,
    timestamp: new Date(),
  },
  {
    id: 'r2',
    type: 'inference',
    thought: 'The token validation logic is not checking expiration correctly',
    evidence: ['Token decode succeeds but validation fails', 'exp claim exists in token'],
    confidence: 0.75,
    timestamp: new Date(),
  },
  {
    id: 'r3',
    type: 'conclusion',
    thought: 'Fix: Add explicit expiration check before validation',
    confidence: 0.85,
    timestamp: new Date(),
  },
];
