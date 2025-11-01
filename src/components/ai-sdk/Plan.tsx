import React, { useState } from 'react';
import { View, StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';
import { VStack, HStack, Text } from '@expo/ui/swift-ui';
import { Host } from '../common/SwiftUIHost';
import { useTheme } from '../../design-system';
import { GlassCard } from '../ui/glass';

export type PlanStep = {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  substeps?: string[];
  estimatedTime?: string;
};

export type PlanData = {
  id: string;
  title: string;
  description?: string;
  steps: PlanStep[];
  createdAt?: Date;
  updatedAt?: Date;
};

export interface PlanProps {
  plan: PlanData;
  variant?: 'default' | 'compact' | 'detailed';
  onStepPress?: (stepId: string) => void;
  collapsible?: boolean;
  testID?: string;
}

const statusIcons = {
  pending: '⏳',
  in_progress: '🔄',
  completed: '✅',
  failed: '❌',
};

const statusColors = {
  pending: '#6B7280',
  in_progress: '#3B82F6',
  completed: '#10B981',
  failed: '#EF4444',
};

/**
 * Plan component for displaying multi-step AI planning workflows
 *
 * @example
 * ```tsx
 * <Plan
 *   plan={examplePlan}
 *   variant="default"
 *   collapsible
 *   onStepPress={(stepId) => console.log('Step:', stepId)}
 * />
 * ```
 */
export function Plan({
  plan,
  variant = 'default',
  onStepPress,
  collapsible = true,
  testID,
}: PlanProps) {
  const theme = useTheme();
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const completedSteps = plan.steps.filter(s => s.status === 'completed').length;
  const progress = plan.steps.length > 0 ? (completedSteps / plan.steps.length) * 100 : 0;

  return (
    <GlassCard variant="regular" style={{ alignSelf: 'stretch' }} testID={testID}>
      <VStack spacing={variant === 'compact' ? 8 : 12}>
        {/* Plan Header */}
        <VStack spacing={4}>
          <RNText style={[styles.planTitle, { color: theme.colors.foreground.rgb }]}>
            📋 {plan.title}
          </RNText>
          {plan.description && variant !== 'compact' && (
            <RNText style={[styles.planDescription, { color: theme.colors.mutedForeground.rgb }]}>
              {plan.description}
            </RNText>
          )}
        </VStack>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.muted.rgb },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: theme.colors.primary.rgb,
                },
              ]}
            />
          </View>
          <RNText style={[styles.progressText, { color: theme.colors.mutedForeground.rgb }]}>
            {completedSteps} / {plan.steps.length} steps
          </RNText>
        </View>

        {/* Steps */}
        <VStack spacing={variant === 'compact' ? 6 : 8}>
          {plan.steps.map((step, index) => {
            const isExpanded = expandedSteps.has(step.id);
            const hasSubsteps = step.substeps && step.substeps.length > 0;
            const canExpand = collapsible && (hasSubsteps || step.description);

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
                      color: statusColors[step.status],
                      width: 2,
                      opacity: 0.5,
                    },
                  ]}
                  style={{ padding: 12 }}
                >
                  <VStack spacing={8}>
                    {/* Step Header */}
                    <HStack spacing={8} style={{ alignItems: 'center' }}>
                      <RNText style={{ fontSize: 18 }}>
                        {statusIcons[step.status]}
                      </RNText>
                      <View style={{ flex: 1 }}>
                        <RNText
                          style={[
                            styles.stepTitle,
                            { color: theme.colors.foreground.rgb },
                          ]}
                        >
                          {index + 1}. {step.title}
                        </RNText>
                        {step.estimatedTime && variant === 'detailed' && (
                          <RNText
                            style={[
                              styles.estimatedTime,
                              { color: theme.colors.mutedForeground.rgb },
                            ]}
                          >
                            ⏱ {step.estimatedTime}
                          </RNText>
                        )}
                      </View>
                      {canExpand && (
                        <RNText style={{ fontSize: 14, color: theme.colors.mutedForeground.rgb }}>
                          {isExpanded ? '▼' : '▶'}
                        </RNText>
                      )}
                    </HStack>

                    {/* Step Description */}
                    {step.description && (isExpanded || variant === 'detailed' && !collapsible) && (
                      <RNText
                        style={[
                          styles.stepDescription,
                          { color: theme.colors.mutedForeground.rgb },
                        ]}
                      >
                        {step.description}
                      </RNText>
                    )}

                    {/* Substeps */}
                    {hasSubsteps && (isExpanded || !collapsible) && (
                      <VStack spacing={4} style={{ marginLeft: 12 }}>
                        {step.substeps!.map((substep, subIndex) => (
                          <RNText
                            key={subIndex}
                            style={[
                              styles.substep,
                              { color: theme.colors.mutedForeground.rgb },
                            ]}
                          >
                            • {substep}
                          </RNText>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </Host>
              </TouchableOpacity>
            );
          })}
        </VStack>
      </VStack>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  substep: {
    fontSize: 12,
    lineHeight: 18,
  },
  estimatedTime: {
    fontSize: 11,
    marginTop: 2,
  },
});

// Example Data
export const examplePlans: PlanData[] = [
  {
    id: 'plan-1',
    title: 'Implement User Authentication',
    description: 'Add OAuth 2.0 authentication flow with JWT tokens',
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'step-1',
        title: 'Set up authentication provider',
        description: 'Configure OAuth provider (Google, GitHub, etc.)',
        status: 'completed',
        estimatedTime: '30 min',
        substeps: [
          'Register application with provider',
          'Obtain client ID and secret',
          'Configure redirect URLs',
        ],
      },
      {
        id: 'step-2',
        title: 'Create authentication endpoints',
        description: 'Build login, logout, and token refresh endpoints',
        status: 'in_progress',
        estimatedTime: '1 hour',
        substeps: [
          'POST /auth/login',
          'POST /auth/logout',
          'POST /auth/refresh',
          'GET /auth/me',
        ],
      },
      {
        id: 'step-3',
        title: 'Implement JWT token handling',
        description: 'Generate, validate, and refresh JWT tokens',
        status: 'pending',
        estimatedTime: '45 min',
        substeps: [
          'Install JWT library',
          'Create token generation function',
          'Add token validation middleware',
          'Implement refresh token logic',
        ],
      },
      {
        id: 'step-4',
        title: 'Add protected routes middleware',
        description: 'Protect routes that require authentication',
        status: 'pending',
        estimatedTime: '20 min',
      },
      {
        id: 'step-5',
        title: 'Write tests and documentation',
        status: 'pending',
        estimatedTime: '40 min',
        substeps: [
          'Unit tests for auth functions',
          'Integration tests for endpoints',
          'API documentation',
          'Usage examples',
        ],
      },
    ],
  },
  {
    id: 'plan-2',
    title: 'Optimize Database Queries',
    description: 'Improve query performance and add caching',
    createdAt: new Date(),
    steps: [
      {
        id: 'step-1',
        title: 'Identify slow queries',
        status: 'completed',
        estimatedTime: '15 min',
      },
      {
        id: 'step-2',
        title: 'Add database indexes',
        status: 'completed',
        estimatedTime: '30 min',
      },
      {
        id: 'step-3',
        title: 'Implement Redis caching',
        status: 'in_progress',
        estimatedTime: '1.5 hours',
      },
      {
        id: 'step-4',
        title: 'Add query result pagination',
        status: 'pending',
        estimatedTime: '45 min',
      },
    ],
  },
  {
    id: 'plan-3',
    title: 'Deploy to Production',
    description: 'Complete production deployment checklist',
    createdAt: new Date(),
    steps: [
      {
        id: 'step-1',
        title: 'Run all tests',
        status: 'completed',
        estimatedTime: '5 min',
      },
      {
        id: 'step-2',
        title: 'Update environment variables',
        status: 'completed',
        estimatedTime: '10 min',
      },
      {
        id: 'step-3',
        title: 'Build production bundle',
        status: 'completed',
        estimatedTime: '15 min',
      },
      {
        id: 'step-4',
        title: 'Deploy to staging',
        status: 'completed',
        estimatedTime: '10 min',
      },
      {
        id: 'step-5',
        title: 'Run smoke tests',
        status: 'failed',
        estimatedTime: '5 min',
        description: 'API health check failed - investigating',
      },
    ],
  },
];
