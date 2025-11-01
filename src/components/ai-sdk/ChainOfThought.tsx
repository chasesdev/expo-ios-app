import React, { useState } from 'react';
import { View, StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';
import { Host, VStack, HStack } from '@expo/ui/swift-ui';
import { useTheme } from '../../design-system';
import { GlassCard } from '../ui/glass';

export type ThoughtStep = {
  id: string;
  title: string;
  content: string;
  confidence?: number; // 0-1
  reasoning?: string[];
  timestamp?: Date;
};

export type ChainOfThoughtData = {
  id: string;
  title: string;
  description?: string;
  steps: ThoughtStep[];
  finalConclusion?: string;
  createdAt?: Date;
};

export interface ChainOfThoughtProps {
  data: ChainOfThoughtData;
  variant?: 'default' | 'compact' | 'detailed';
  collapsible?: boolean;
  onStepPress?: (stepId: string) => void;
  testID?: string;
}

/**
 * Chain of Thought component for displaying AI reasoning steps
 *
 * @example
 * ```tsx
 * <ChainOfThought
 *   data={exampleChainOfThought}
 *   variant="default"
 *   collapsible
 *   onStepPress={(id) => console.log('Step:', id)}
 * />
 * ```
 */
export function ChainOfThought({
  data,
  variant = 'default',
  collapsible = true,
  onStepPress,
  testID,
}: ChainOfThoughtProps) {
  const theme = useTheme();
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(
    collapsible ? new Set() : new Set(data.steps.map(s => s.id))
  );

  const toggleStep = (stepId: string) => {
    if (!collapsible) return;
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return theme.colors.mutedForeground.rgb;
    if (confidence >= 0.8) return '#10B981';
    if (confidence >= 0.6) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <GlassCard variant="regular" style={{ alignSelf: 'stretch' }} testID={testID}>
      <VStack spacing={variant === 'compact' ? 10 : 14}>
        {/* Header */}
        <VStack spacing={4}>
          <RNText style={[styles.title, { color: theme.colors.foreground.rgb }]}>
            🧠 {data.title}
          </RNText>
          {data.description && variant !== 'compact' && (
            <RNText style={[styles.description, { color: theme.colors.mutedForeground.rgb }]}>
              {data.description}
            </RNText>
          )}
        </VStack>

        {/* Thought Steps */}
        <VStack spacing={variant === 'compact' ? 6 : 10}>
          {data.steps.map((step, index) => {
            const isExpanded = expandedSteps.has(step.id);
            const hasReasoning = step.reasoning && step.reasoning.length > 0;
            const canExpand = collapsible && hasReasoning;

            return (
              <TouchableOpacity
                key={step.id}
                onPress={() => {
                  if (canExpand) {
                    toggleStep(step.id);
                  }
                  onStepPress?.(step.id);
                }}
                activeOpacity={canExpand || onStepPress ? 0.7 : 1}
              >
                <Host
                  modifiers={[
                    {
                      type: 'background',
                      color: theme.colors.muted.rgb,
                    },
                    {
                      type: 'cornerRadius',
                      radius: theme.radius.md,
                    },
                    {
                      type: 'border',
                      color: theme.colors.border.rgb,
                      width: 1,
                      opacity: 0.5,
                    },
                  ]}
                  style={{ padding: 12 }}
                >
                  <VStack spacing={8}>
                    {/* Step Header */}
                    <HStack spacing={8} style={{ alignItems: 'flex-start' }}>
                      {/* Step Number */}
                      <Host
                        modifiers={[
                          {
                            type: 'background',
                            color: theme.colors.primary.rgb,
                          },
                          {
                            type: 'cornerRadius',
                            radius: 12,
                          },
                        ]}
                        style={{
                          width: 24,
                          height: 24,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <RNText style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                          {index + 1}
                        </RNText>
                      </Host>

                      {/* Content */}
                      <View style={{ flex: 1 }}>
                        <RNText style={[styles.stepTitle, { color: theme.colors.foreground.rgb }]}>
                          {step.title}
                        </RNText>
                        <RNText style={[styles.stepContent, { color: theme.colors.mutedForeground.rgb }]}>
                          {step.content}
                        </RNText>

                        {/* Confidence */}
                        {typeof step.confidence === 'number' && variant !== 'compact' && (
                          <HStack spacing={8} style={{ marginTop: 6, alignItems: 'center' }}>
                            <RNText
                              style={[
                                styles.confidenceText,
                                { color: getConfidenceColor(step.confidence) },
                              ]}
                            >
                              {Math.round(step.confidence * 100)}% confident
                            </RNText>
                            <View
                              style={[
                                styles.confidenceBar,
                                { backgroundColor: theme.colors.background.rgb },
                              ]}
                            >
                              <View
                                style={[
                                  styles.confidenceFill,
                                  {
                                    width: `${step.confidence * 100}%`,
                                    backgroundColor: getConfidenceColor(step.confidence),
                                  },
                                ]}
                              />
                            </View>
                          </HStack>
                        )}
                      </View>

                      {/* Expand Icon */}
                      {canExpand && (
                        <RNText style={{ fontSize: 12, color: theme.colors.mutedForeground.rgb }}>
                          {isExpanded ? '▼' : '▶'}
                        </RNText>
                      )}
                    </HStack>

                    {/* Reasoning Details */}
                    {hasReasoning && (isExpanded || !collapsible) && (
                      <View
                        style={[
                          styles.reasoningContainer,
                          { backgroundColor: theme.colors.background.rgb },
                        ]}
                      >
                        <RNText style={[styles.reasoningTitle, { color: theme.colors.foreground.rgb }]}>
                          Reasoning:
                        </RNText>
                        <VStack spacing={4}>
                          {step.reasoning!.map((reason, idx) => (
                            <RNText
                              key={idx}
                              style={[styles.reasoningItem, { color: theme.colors.mutedForeground.rgb }]}
                            >
                              • {reason}
                            </RNText>
                          ))}
                        </VStack>
                      </View>
                    )}
                  </VStack>
                </Host>
              </TouchableOpacity>
            );
          })}
        </VStack>

        {/* Final Conclusion */}
        {data.finalConclusion && variant !== 'compact' && (
          <Host
            modifiers={[
              {
                type: 'background',
                color: theme.colors.primary.rgb + '15',
              },
              {
                type: 'cornerRadius',
                radius: theme.radius.md,
              },
              {
                type: 'border',
                color: theme.colors.primary.rgb,
                width: 1,
                opacity: 0.3,
              },
            ]}
            style={{ padding: 12 }}
          >
            <VStack spacing={4}>
              <RNText style={[styles.conclusionTitle, { color: theme.colors.primary.rgb }]}>
                💡 Conclusion
              </RNText>
              <RNText style={[styles.conclusionText, { color: theme.colors.foreground.rgb }]}>
                {data.finalConclusion}
              </RNText>
            </VStack>
          </Host>
        )}
      </VStack>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  stepContent: {
    fontSize: 13,
    lineHeight: 19,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  confidenceBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  reasoningContainer: {
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  reasoningTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  reasoningItem: {
    fontSize: 12,
    lineHeight: 17,
  },
  conclusionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  conclusionText: {
    fontSize: 13,
    lineHeight: 19,
  },
});

// Example Data
export const exampleChainOfThought: ChainOfThoughtData[] = [
  {
    id: 'cot-1',
    title: 'Analyzing User Authentication Bug',
    description: 'Step-by-step reasoning to identify the root cause',
    createdAt: new Date(),
    steps: [
      {
        id: 'step-1',
        title: 'Identify the symptom',
        content: 'Users are being logged out randomly after 5-10 minutes of activity',
        confidence: 0.95,
        reasoning: [
          'Multiple user reports confirm this behavior',
          'Issue occurs across different browsers',
          'No pattern related to specific user actions',
        ],
        timestamp: new Date(),
      },
      {
        id: 'step-2',
        title: 'Check session management',
        content: 'The session timeout is set to 30 minutes, so premature logout shouldn\'t happen',
        confidence: 0.9,
        reasoning: [
          'Configuration shows session.maxAge = 1800000 (30 minutes)',
          'Session store is configured correctly',
          'Redis connection is stable',
        ],
        timestamp: new Date(),
      },
      {
        id: 'step-3',
        title: 'Investigate JWT token expiration',
        content: 'JWT tokens are expiring after 10 minutes, not matching the session timeout',
        confidence: 0.85,
        reasoning: [
          'Token expiry is set to 600 seconds (10 minutes) in auth config',
          'No refresh token mechanism implemented',
          'This explains the 5-10 minute logout pattern',
        ],
        timestamp: new Date(),
      },
      {
        id: 'step-4',
        title: 'Verify refresh token implementation',
        content: 'Refresh token logic exists but is not being called by the frontend',
        confidence: 0.75,
        reasoning: [
          'Backend has /auth/refresh endpoint',
          'Frontend interceptor is missing the refresh call',
          'Token expiry is not being detected client-side',
        ],
        timestamp: new Date(),
      },
    ],
    finalConclusion: 'The bug is caused by a mismatch between JWT token expiration (10 min) and session timeout (30 min), combined with missing refresh token logic in the frontend. Solution: Either extend JWT expiry to match session timeout, or implement automatic token refresh in the frontend interceptor.',
  },
  {
    id: 'cot-2',
    title: 'Optimizing Database Query Performance',
    description: 'Analyzing slow query and proposing solutions',
    createdAt: new Date(),
    steps: [
      {
        id: 'step-1',
        title: 'Measure current performance',
        content: 'Query takes 3.5 seconds on average with 10,000 records',
        confidence: 1.0,
        reasoning: [
          'Consistent measurements across multiple runs',
          'Performance degrades linearly with record count',
        ],
      },
      {
        id: 'step-2',
        title: 'Analyze query execution plan',
        content: 'Full table scan detected - no index on the filtered column',
        confidence: 0.9,
        reasoning: [
          'EXPLAIN shows "Seq Scan" instead of "Index Scan"',
          'Filter column "created_at" has no index',
          'Table has 50,000+ rows',
        ],
      },
      {
        id: 'step-3',
        title: 'Propose indexing strategy',
        content: 'Add composite index on (user_id, created_at) for optimal performance',
        confidence: 0.85,
        reasoning: [
          'Query filters by user_id AND sorts by created_at',
          'Composite index can serve both operations',
          'Expected to reduce query time to <100ms',
        ],
      },
    ],
    finalConclusion: 'Create a composite index on (user_id, created_at) to optimize the query. Expected improvement: 3.5s → ~50ms (98% faster).',
  },
];
