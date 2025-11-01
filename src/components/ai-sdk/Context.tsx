/**
 * Context Component
 *
 * Displays contextual information with expandable sections.
 *
 * @example
 * ```tsx
 * import { Context } from '@/components/ai-sdk';
 *
 * <Context
 *   items={contextItems}
 *   variant="default"
 *   collapsible
 *   onItemPress={(item) => console.log(item)}
 * />
 * ```
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { theme } from '../../theme';

// Context item types
export type ContextType = 'file' | 'conversation' | 'data' | 'search' | 'memory' | 'other';

// Context item structure
export interface ContextItem {
  id: string;
  type: ContextType;
  title: string;
  description?: string;
  content?: string; // Preview/excerpt
  source?: string;
  timestamp?: Date;
  size?: number; // For files, in bytes
  metadata?: Record<string, any>;
}

// Props interface
export interface ContextProps {
  items: ContextItem[];
  variant?: 'default' | 'compact' | 'inline';
  collapsible?: boolean;
  defaultExpanded?: boolean;
  showPreviews?: boolean;
  maxPreviewLines?: number;
  onItemPress?: (item: ContextItem) => void;
  onItemRemove?: (item: ContextItem) => void;
  testID?: string;
}

// Helper: Get icon for context type
const getContextIcon = (type: ContextType): string => {
  switch (type) {
    case 'file':
      return '📄';
    case 'conversation':
      return '💬';
    case 'data':
      return '📊';
    case 'search':
      return '🔍';
    case 'memory':
      return '🧠';
    case 'other':
    default:
      return '📎';
  }
};

// Helper: Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Helper: Format timestamp
const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

// Individual Context Item Component
interface ContextItemViewProps {
  item: ContextItem;
  variant: 'default' | 'compact' | 'inline';
  showPreview: boolean;
  maxPreviewLines: number;
  onPress?: (item: ContextItem) => void;
  onRemove?: (item: ContextItem) => void;
}

const ContextItemView: React.FC<ContextItemViewProps> = ({
  item,
  variant,
  showPreview,
  maxPreviewLines,
  onPress,
  onRemove,
}) => {
  const [previewExpanded, setPreviewExpanded] = useState(false);

  const icon = getContextIcon(item.type);
  const hasPreview = showPreview && item.content;

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const handleRemove = (e: any) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(item);
    }
  };

  // Inline variant - simple chip
  if (variant === 'inline') {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: 4,
          borderRadius: theme.borderRadius.sm,
          backgroundColor: pressed
            ? `${theme.colors.surface.elevated}${opacityToHex(0.9)}`
            : `${theme.colors.surface.elevated}${opacityToHex(0.7)}`,
          borderWidth: 1,
          borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
        })}
      >
        <Text style={{ fontSize: 12 }}>{icon}</Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.primary,
            fontWeight: '500',
          }}
        >
          {item.title}
        </Text>
        {onRemove && (
          <Pressable onPress={handleRemove} style={{ marginLeft: 4 }}>
            <Text style={{ fontSize: 12, color: theme.colors.text.tertiary }}>×</Text>
          </Pressable>
        )}
      </Pressable>
    );
  }

  // Compact variant - horizontal layout
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
            ? `${theme.colors.surface.elevated}${opacityToHex(0.8)}`
            : `${theme.colors.surface.elevated}${opacityToHex(0.6)}`,
          borderWidth: 1,
          borderColor: `${theme.colors.border.default}${opacityToHex(0.2)}`,
        })}
      >
        {/* Icon */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16 }}>{icon}</Text>
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
            {item.title}
          </Text>
          {item.description && (
            <Text
              numberOfLines={1}
              style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.secondary,
                marginTop: 2,
              }}
            >
              {item.description}
            </Text>
          )}
        </View>

        {/* Metadata */}
        <View style={{ alignItems: 'flex-end' }}>
          {item.timestamp && (
            <Text
              style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.tertiary,
              }}
            >
              {formatTimestamp(item.timestamp)}
            </Text>
          )}
          {item.size && (
            <Text
              style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.tertiary,
                marginTop: 2,
              }}
            >
              {formatFileSize(item.size)}
            </Text>
          )}
        </View>

        {/* Remove button */}
        {onRemove && (
          <Pressable
            onPress={handleRemove}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: theme.colors.text.tertiary }}>×</Text>
          </Pressable>
        )}
      </Pressable>
    );
  }

  // Default variant - full card
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
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
          {/* Icon */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: theme.borderRadius.md,
              backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.6)}`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 20 }}>{icon}</Text>
          </View>

          {/* Title & Description */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: theme.typography.body.fontSize,
                fontWeight: '600',
                color: theme.colors.text.primary,
                lineHeight: 18,
              }}
            >
              {item.title}
            </Text>
            {item.description && (
              <Text
                numberOfLines={2}
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.text.secondary,
                  marginTop: 4,
                  lineHeight: 16,
                }}
              >
                {item.description}
              </Text>
            )}
          </View>

          {/* Remove button */}
          {onRemove && (
            <Pressable
              onPress={handleRemove}
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

        {/* Metadata */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>
          {item.source && (
            <View
              style={{
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 2,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.text.secondary,
                }}
              >
                {item.source}
              </Text>
            </View>
          )}
          {item.timestamp && (
            <View
              style={{
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 2,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.text.secondary,
                }}
              >
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
          )}
          {item.size && (
            <View
              style={{
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 2,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: `${theme.colors.surface.default}${opacityToHex(0.5)}`,
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.text.secondary,
                }}
              >
                {formatFileSize(item.size)}
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {/* Preview */}
      {hasPreview && (
        <View style={{ marginTop: theme.spacing.sm }}>
          <Text
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.text.secondary,
              lineHeight: 18,
              fontFamily: 'monospace',
            }}
            numberOfLines={previewExpanded ? undefined : maxPreviewLines}
          >
            {item.content}
          </Text>
          {item.content && item.content.split('\n').length > maxPreviewLines && (
            <Pressable
              onPress={() => setPreviewExpanded(!previewExpanded)}
              style={{ marginTop: theme.spacing.xs }}
            >
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.primary,
                  fontWeight: '600',
                }}
              >
                {previewExpanded ? 'Show less' : 'Show more'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

// Main Context Component
export const Context: React.FC<ContextProps> = ({
  items,
  variant = 'default',
  collapsible = false,
  defaultExpanded = true,
  showPreviews = true,
  maxPreviewLines = 3,
  onItemPress,
  onItemRemove,
  testID = 'context',
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (items.length === 0) {
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
        {items.map((item) => (
          <ContextItemView
            key={item.id}
            item={item}
            variant={variant}
            showPreview={false}
            maxPreviewLines={maxPreviewLines}
            onPress={onItemPress}
            onRemove={onItemRemove}
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
          <Text style={{ fontSize: 20 }}>📋</Text>
          <Text
            style={{
              fontSize: theme.typography.title3.fontSize,
              fontWeight: '600',
              color: theme.colors.text.primary,
            }}
          >
            Context
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
              {items.length}
            </Text>
          </View>
        </View>
        {collapsible && (
          <Text style={{ fontSize: 16, color: theme.colors.text.secondary }}>
            {expanded ? '▲' : '▼'}
          </Text>
        )}
      </Pressable>

      {/* Items List */}
      {expanded && (
        <View style={{ padding: theme.spacing.md, gap: theme.spacing.md }}>
          {items.map((item) => (
            <ContextItemView
              key={item.id}
              item={item}
              variant={variant}
              showPreview={showPreviews}
              maxPreviewLines={maxPreviewLines}
              onPress={onItemPress}
              onRemove={onItemRemove}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Example context items for testing
export const exampleContextItems: ContextItem[] = [
  {
    id: '1',
    type: 'file',
    title: 'UserAuthentication.ts',
    description: 'Authentication service with JWT support',
    content: `import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
}`,
    source: 'src/services',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    size: 2458,
  },
  {
    id: '2',
    type: 'conversation',
    title: 'Previous discussion about API design',
    description: 'Conversation about RESTful API best practices',
    content: 'User: What are the best practices for designing RESTful APIs?\nAssistant: RESTful API design involves using proper HTTP methods, status codes, and resource naming conventions...',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    type: 'search',
    title: 'Search results: React Native performance',
    description: 'Web search results about optimizing React Native apps',
    content: 'Found 10 relevant articles about React Native performance optimization, including memoization, virtualization, and bundle size reduction techniques.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  },
  {
    id: '4',
    type: 'data',
    title: 'User Analytics Data',
    description: 'Monthly active user statistics',
    content: `{
  "totalUsers": 15234,
  "activeUsers": 8912,
  "newUsers": 456,
  "retention": 0.85
}`,
    source: 'analytics.db',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    size: 1024,
  },
];
