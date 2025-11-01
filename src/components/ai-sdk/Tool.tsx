/**
 * Tool Component
 *
 * Displays AI tool/function calls with status, parameters, and results.
 *
 * @example
 * ```tsx
 * import { Tool } from '@/components/ai-sdk';
 *
 * <Tool
 *   name="search_web"
 *   description="Search the web for information"
 *   status="running"
 *   parameters={{ query: "React Native" }}
 *   variant="default"
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';

// Tool status
export type ToolStatus = 'idle' | 'running' | 'success' | 'error';

// Tool data structure
export interface ToolData {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status: ToolStatus;
  parameters?: Record<string, any>;
  result?: any;
  error?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in milliseconds
}

// Props interface
export interface ToolProps {
  tool?: ToolData; // Full tool data
  name?: string; // Fallback name
  description?: string; // Fallback description
  icon?: string; // Fallback icon
  status?: ToolStatus; // Fallback status
  parameters?: Record<string, any>; // Fallback parameters
  result?: any; // Fallback result
  error?: string; // Fallback error
  variant?: 'default' | 'compact' | 'minimal';
  showParameters?: boolean;
  showResult?: boolean;
  onPress?: (tool: ToolData) => void;
  testID?: string;
}

// Helper: Get status icon and color
const getStatusConfig = (status: ToolStatus): { icon: string; color: string; label: string } => {
  switch (status) {
    case 'running':
      return { icon: '⏳', color: theme.colors.primary, label: 'Running' };
    case 'success':
      return { icon: '✓', color: theme.colors.success, label: 'Success' };
    case 'error':
      return { icon: '✗', color: theme.colors.destructive, label: 'Error' };
    case 'idle':
    default:
      return { icon: '○', color: theme.colors.text.tertiary, label: 'Idle' };
  }
};

// Helper: Get default icon for tool name
const getDefaultToolIcon = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('search')) return '🔍';
  if (lowerName.includes('code') || lowerName.includes('program')) return '💻';
  if (lowerName.includes('web') || lowerName.includes('http')) return '🌐';
  if (lowerName.includes('file') || lowerName.includes('read') || lowerName.includes('write')) return '📄';
  if (lowerName.includes('image') || lowerName.includes('photo')) return '🖼️';
  if (lowerName.includes('data') || lowerName.includes('database')) return '📊';
  if (lowerName.includes('email') || lowerName.includes('mail')) return '📧';
  if (lowerName.includes('calendar') || lowerName.includes('schedule')) return '📅';
  if (lowerName.includes('calculate') || lowerName.includes('math')) return '🔢';
  return '🔧';
};

// Helper: Format duration
const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

// Helper: Format parameter value
const formatParamValue = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === 'object') return '{...}';
  return String(value);
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

export const Tool: React.FC<ToolProps> = ({
  tool,
  name,
  description,
  icon,
  status,
  parameters,
  result,
  error,
  variant = 'default',
  showParameters = true,
  showResult = true,
  onPress,
  testID = 'tool',
}) => {
  const [resultExpanded, setResultExpanded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Merge tool data with individual props
  const finalName = name || tool?.name || 'Unknown Tool';
  const finalDescription = description || tool?.description || '';
  const finalIcon = icon || tool?.icon || getDefaultToolIcon(finalName);
  const finalStatus = status || tool?.status || 'idle';
  const finalParameters = parameters || tool?.parameters || {};
  const finalResult = result || tool?.result;
  const finalError = error || tool?.error;
  const duration = tool?.duration;

  const statusConfig = getStatusConfig(finalStatus);
  const paramCount = Object.keys(finalParameters).length;

  // Simulate elapsed time for running status
  useEffect(() => {
    if (finalStatus === 'running') {
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setElapsedTime(0);
    }
  }, [finalStatus]);

  const handlePress = () => {
    if (onPress && tool) {
      onPress(tool);
    }
  };

  // Minimal variant - inline status badge
  if (variant === 'minimal') {
    return (
      <View
        testID={testID}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.xs,
          paddingVertical: theme.spacing.xs,
        }}
      >
        <Text style={{ fontSize: 14 }}>{finalIcon}</Text>
        <Text
          style={{
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.text.primary,
            fontWeight: '500',
          }}
        >
          {finalName}
        </Text>
        <View
          style={{
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: `${statusConfig.color}${opacityToHex(0.15)}`,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: statusConfig.color,
              fontWeight: '600',
            }}
          >
            {statusConfig.icon} {statusConfig.label}
          </Text>
        </View>
      </View>
    );
  }

  // Compact variant - glass chip with status
  if (variant === 'compact') {
    return (
      <Pressable
        testID={testID}
        onPress={handlePress}
        disabled={!onPress}
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
        {/* Icon */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18 }}>{finalIcon}</Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: theme.typography.body.fontSize,
              fontWeight: '600',
              color: theme.colors.text.primary,
            }}
          >
            {finalName}
          </Text>
          {finalDescription && (
            <Text
              numberOfLines={1}
              style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.secondary,
                marginTop: 2,
              }}
            >
              {finalDescription}
            </Text>
          )}
        </View>

        {/* Status */}
        {finalStatus === 'running' ? (
          <ActivityIndicator size="small" color={statusConfig.color} />
        ) : (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: `${statusConfig.color}${opacityToHex(0.2)}`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 12, color: statusConfig.color }}>
              {statusConfig.icon}
            </Text>
          </View>
        )}
      </Pressable>
    );
  }

  // Default variant - full card with details
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
          alignItems: 'flex-start',
          gap: theme.spacing.sm,
          padding: theme.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: `${theme.colors.border.default}${opacityToHex(0.2)}`,
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: theme.borderRadius.md,
            backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.6)}`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 24 }}>{finalIcon}</Text>
        </View>

        {/* Name & Description */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: theme.typography.title3.fontSize,
              fontWeight: '600',
              color: theme.colors.text.primary,
              marginBottom: 4,
            }}
          >
            {finalName}
          </Text>
          {finalDescription && (
            <Text
              style={{
                fontSize: theme.typography.body.fontSize,
                color: theme.colors.text.secondary,
                lineHeight: 18,
              }}
            >
              {finalDescription}
            </Text>
          )}
        </View>

        {/* Status Badge */}
        <View
          style={{
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: 4,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: `${statusConfig.color}${opacityToHex(0.2)}`,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {finalStatus === 'running' ? (
            <ActivityIndicator size="small" color={statusConfig.color} />
          ) : (
            <Text style={{ fontSize: 12, color: statusConfig.color }}>
              {statusConfig.icon}
            </Text>
          )}
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: statusConfig.color,
              fontWeight: '600',
            }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Parameters */}
      {showParameters && paramCount > 0 && (
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
            PARAMETERS
          </Text>
          <View style={{ gap: theme.spacing.xs }}>
            {Object.entries(finalParameters).map(([key, value]) => (
              <View
                key={key}
                style={{
                  flexDirection: 'row',
                  gap: theme.spacing.xs,
                }}
              >
                <Text
                  style={{
                    fontSize: theme.typography.body.fontSize,
                    color: theme.colors.text.secondary,
                    fontFamily: 'monospace',
                  }}
                >
                  {key}:
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: theme.typography.body.fontSize,
                    color: theme.colors.text.primary,
                    fontFamily: 'monospace',
                  }}
                  numberOfLines={1}
                >
                  {formatParamValue(value)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Result */}
      {showResult && finalResult && finalStatus === 'success' && (
        <View style={{ padding: theme.spacing.md }}>
          <Pressable
            onPress={() => setResultExpanded(!resultExpanded)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.tertiary,
                fontWeight: '600',
              }}
            >
              RESULT
            </Text>
            <Text style={{ fontSize: 12, color: theme.colors.text.tertiary }}>
              {resultExpanded ? '▲' : '▼'}
            </Text>
          </Pressable>
          {resultExpanded && (
            <View
              style={{
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.4)}`,
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.body.fontSize,
                  color: theme.colors.text.primary,
                  fontFamily: 'monospace',
                  lineHeight: 18,
                }}
              >
                {typeof finalResult === 'string'
                  ? finalResult
                  : JSON.stringify(finalResult, null, 2)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Error */}
      {finalError && finalStatus === 'error' && (
        <View
          style={{
            padding: theme.spacing.md,
            backgroundColor: `${theme.colors.destructive}${opacityToHex(0.1)}`,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.destructive,
              fontWeight: '600',
              marginBottom: theme.spacing.xs,
            }}
          >
            ERROR
          </Text>
          <Text
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.destructive,
              lineHeight: 18,
            }}
          >
            {finalError}
          </Text>
        </View>
      )}

      {/* Footer - Duration/Timing */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.md,
          paddingTop: theme.spacing.sm,
        }}
      >
        <Text
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.tertiary,
          }}
        >
          {finalStatus === 'running'
            ? `Running for ${formatDuration(elapsedTime)}`
            : duration
            ? `Completed in ${formatDuration(duration)}`
            : ''}
        </Text>
      </View>
    </View>
  );
};

// Example tools for testing
export const exampleTools: ToolData[] = [
  {
    id: '1',
    name: 'search_web',
    description: 'Search the web for information',
    icon: '🔍',
    status: 'success',
    parameters: {
      query: 'React Native best practices',
      maxResults: 10,
    },
    result: 'Found 10 results about React Native best practices',
    duration: 1250,
  },
  {
    id: '2',
    name: 'read_file',
    description: 'Read contents of a file',
    icon: '📄',
    status: 'running',
    parameters: {
      path: '/Users/john/documents/report.pdf',
      encoding: 'utf-8',
    },
    startTime: new Date(),
  },
  {
    id: '3',
    name: 'calculate',
    description: 'Perform mathematical calculations',
    icon: '🔢',
    status: 'error',
    parameters: {
      expression: '2 + 2 * invalid',
    },
    error: 'Invalid expression: unexpected token "invalid"',
  },
  {
    id: '4',
    name: 'generate_image',
    description: 'Generate an image from text prompt',
    icon: '🖼️',
    status: 'idle',
    parameters: {
      prompt: 'A serene mountain landscape at sunset',
      size: '1024x1024',
    },
  },
];
