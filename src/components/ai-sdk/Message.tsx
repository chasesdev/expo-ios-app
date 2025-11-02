import React, { useState } from 'react';
import { Image } from '@expo/ui/swift-ui';
import { Host } from '../common/SwiftUIHost';
import { TouchableOpacity, View, Text as RNText, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../design-system';
import {
  MaterialVariant,
  getBlurForMaterial,
  getOpacityForMaterial,
  opacityToHex,
} from '../../design-system/glass-tokens';

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

export interface MessageReaction {
  type: 'thumbsUp' | 'thumbsDown' | 'heart' | 'star';
  count: number;
  users?: string[];
}

export interface MessageProps {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  author?: {
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
  };
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  isEdited?: boolean;
  editedAt?: string;
  isBookmarked?: boolean;
  isFlagged?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showStatus?: boolean;
  showActions?: boolean;
  allowReactions?: boolean;
  allowEditing?: boolean;
  allowDeletion?: boolean;
  allowBookmark?: boolean;
  allowFlag?: boolean;
  allowShare?: boolean;
  onCopy?: () => void;
  onEdit?: (content: string) => void;
  onDelete?: () => void;
  onReact?: (reaction: string) => void;
  onBookmark?: () => void;
  onFlag?: () => void;
  onShare?: () => void;
  onRetry?: () => void;
  testID?: string;
}

/**
 * AI SDK Message component with glass effects
 *
 * Displays a message in a conversation with support for different roles,
 * attachments, reactions, and interactive features.
 *
 * @example
 * ```tsx
 * <Message
 *   id="1"
 *   role="assistant"
 *   content="Hello! How can I help you today?"
 *   timestamp={new Date().toISOString()}
 *   author={{ name: 'AI Assistant' }}
 * />
 * ```
 */
export const Message = React.memo(function Message({
  id,
  role,
  content,
  timestamp,
  status,
  author,
  attachments,
  reactions,
  isEdited,
  editedAt,
  isBookmarked,
  isFlagged,
  priority = 'normal',
  variant = 'default',
  showAvatar = true,
  showTimestamp = true,
  showStatus = true,
  showActions = true,
  allowReactions = true,
  allowEditing = false,
  allowDeletion = false,
  allowBookmark = true,
  allowFlag = true,
  allowShare = true,
  onCopy,
  onEdit,
  onDelete,
  onReact,
  onBookmark,
  onFlag,
  onShare,
  onRetry,
  testID,
}: MessageProps) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  // Glass material variant based on role
  const glassVariant: MaterialVariant = role === 'assistant' ? 'thin' : 'regular';
  const blurRadius = getBlurForMaterial(glassVariant);
  const opacity = getOpacityForMaterial(glassVariant);
  const opacityHex = opacityToHex(opacity);

  const handleEdit = () => {
    if (isEditing && editContent.trim() !== content) {
      onEdit?.(editContent);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      case 'error':
        return '⚠️';
      default:
        return null;
    }
  };

  const getAvatarInitials = () => {
    if (role === 'user') {
      return author?.name?.charAt(0).toUpperCase() || 'U';
    }
    return '🤖';
  };

  const getPriorityBadge = () => {
    if (priority === 'normal') return null;

    return (
      <Text style={{ fontSize: 10, color: theme.colors.mutedForeground.rgb }}>
        {priority.toUpperCase()}
      </Text>
    );
  };

  // Minimal variant - simple inline style
  if (variant === 'minimal') {
    return (
      <Host testID={testID} style={{ padding: theme.spacing.sm }}>
        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '600' }}>
              {role === 'user' ? (author?.name || 'You') : (author?.name || 'AI')}
            </Text>
            {showTimestamp && (
              <Text style={{ fontSize: 11, color: theme.colors.mutedForeground.rgb }}>
                {formatTimestamp(timestamp)}
              </Text>
            )}
            {showStatus && getStatusIcon() && (
              <Text style={{ fontSize: 11 }}>{getStatusIcon()}</Text>
            )}
          </View>
          <Text style={{ fontSize: 14 }}>{content}</Text>
        </View>
      </Host>
    );
  }

  // Compact variant - lightweight glass card
  if (variant === 'compact') {
    return (
      <Host
        testID={testID}
        modifiers={[
          { type: 'blur', radius: blurRadius },
          {
            type: 'background',
            color: theme.colors.background.rgb + opacityHex,
          },
          { type: 'cornerRadius', radius: theme.radius.md },
          {
            type: 'border',
            color: role === 'user' ? theme.colors.primary.rgb : theme.colors.border.rgb,
            width: 1,
            opacity: role === 'user' ? 0.3 : 0.2,
          },
          { type: 'compositingGroup' },
        ]}
        style={{ padding: theme.spacing.sm, marginVertical: theme.spacing.xs }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {showAvatar && (
            <Host
              modifiers={[
                {
                  type: 'background',
                  color: theme.colors.muted.rgb,
                },
                { type: 'cornerRadius', radius: 16 },
              ]}
              style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16 }}>{getAvatarInitials()}</Text>
            </Host>
          )}

          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, fontWeight: '600' }}>
                {role === 'user' ? (author?.name || 'You') : (author?.name || 'AI')}
              </Text>
              {getPriorityBadge()}
              {isEdited && (
                <Text style={{ fontSize: 10, color: theme.colors.mutedForeground.rgb }}>
                  (edited)
                </Text>
              )}
              <View style={{ flex: 1 }} />
              {showTimestamp && (
                <Text style={{ fontSize: 11, color: theme.colors.mutedForeground.rgb }}>
                  {formatTimestamp(timestamp)}
                </Text>
              )}
              {showStatus && getStatusIcon() && (
                <Text style={{ fontSize: 11 }}>{getStatusIcon()}</Text>
              )}
            </View>

            <Text style={{ fontSize: 14 }}>{content}</Text>

            {showActions && (
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                {allowReactions && (
                  <>
                    <TouchableOpacity onPress={() => onReact?.('thumbsUp')}>
                      <Text style={{ fontSize: 14 }}>👍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onReact?.('thumbsDown')}>
                      <Text style={{ fontSize: 14 }}>👎</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity onPress={onCopy}>
                  <Text style={{ fontSize: 14 }}>📋</Text>
                </TouchableOpacity>
                {allowBookmark && (
                  <TouchableOpacity onPress={onBookmark}>
                    <Text style={{ fontSize: 14 }}>{isBookmarked ? '🔖' : '📌'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Host>
    );
  }

  // Default and Detailed variants - full glass card with all features
  return (
    <Host
      testID={testID}
      modifiers={[
        { type: 'blur', radius: blurRadius },
        {
          type: 'background',
          color: theme.colors.background.rgb + opacityHex,
        },
        { type: 'cornerRadius', radius: theme.radius.lg },
        {
          type: 'border',
          color: role === 'user' ? theme.colors.primary.rgb : theme.colors.border.rgb,
          width: 1,
          opacity: role === 'user' ? 0.4 : 0.3,
        },
        {
          type: 'shadow',
          color: '#00000010',
          radius: 15,
          x: 0,
          y: 5,
        },
        { type: 'compositingGroup' },
      ]}
      style={{ padding: theme.spacing.md, marginVertical: theme.spacing.sm }}
    >
      <View style={{ gap: 12 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          {showAvatar && (
            <Host
              modifiers={[
                {
                  type: 'background',
                  color: theme.colors.muted.rgb,
                },
                { type: 'cornerRadius', radius: 20 },
              ]}
              style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 20 }}>{getAvatarInitials()}</Text>
            </Host>
          )}

          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: '600' }}>
                {role === 'user' ? (author?.name || 'You') : (author?.name || 'AI')}
              </Text>
              {getPriorityBadge()}
              {isBookmarked && <Text>🔖</Text>}
              {isFlagged && <Text>🚩</Text>}
            </View>

            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              {showTimestamp && (
                <Text style={{ fontSize: 12, color: theme.colors.mutedForeground.rgb }}>
                  {formatTimestamp(timestamp)}
                </Text>
              )}
              {isEdited && editedAt && (
                <Text style={{ fontSize: 11, color: theme.colors.mutedForeground.rgb }}>
                  edited {formatTimestamp(editedAt)}
                </Text>
              )}
              {showStatus && getStatusIcon() && (
                <Text style={{ fontSize: 12 }}>{getStatusIcon()}</Text>
              )}
            </View>
          </View>

          {showActions && (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {allowReactions && (
                <>
                  <TouchableOpacity onPress={() => onReact?.('thumbsUp')}>
                    <Text style={{ fontSize: 16 }}>👍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onReact?.('thumbsDown')}>
                    <Text style={{ fontSize: 16 }}>👎</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity onPress={onCopy}>
                <Text style={{ fontSize: 16 }}>📋</Text>
              </TouchableOpacity>
              {allowEditing && role === 'user' && (
                <TouchableOpacity onPress={handleEdit}>
                  <Text style={{ fontSize: 16 }}>✏️</Text>
                </TouchableOpacity>
              )}
              {allowBookmark && (
                <TouchableOpacity onPress={onBookmark}>
                  <Text style={{ fontSize: 16 }}>{isBookmarked ? '🔖' : '📌'}</Text>
                </TouchableOpacity>
              )}
              {allowShare && (
                <TouchableOpacity onPress={onShare}>
                  <Text style={{ fontSize: 16 }}>↗️</Text>
                </TouchableOpacity>
              )}
              {allowFlag && (
                <TouchableOpacity onPress={onFlag}>
                  <Text style={{ fontSize: 16, opacity: isFlagged ? 1 : 0.5 }}>🚩</Text>
                </TouchableOpacity>
              )}
              {allowDeletion && role === 'user' && (
                <TouchableOpacity onPress={onDelete}>
                  <Text style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              )}
              {status === 'error' && onRetry && (
                <TouchableOpacity onPress={onRetry}>
                  <Text style={{ fontSize: 16 }}>🔄</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Content */}
        {isEditing ? (
          <View style={{ gap: 8 }}>
            <TextInput
              value={editContent}
              onChangeText={setEditContent}
              multiline
              numberOfLines={3}
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.muted.rgb,
                  borderColor: theme.colors.border.rgb,
                  color: theme.colors.foreground.rgb,
                },
              ]}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={handleEdit}>
                <Host
                  modifiers={[
                    {
                      type: 'background',
                      color: theme.colors.primary.rgb,
                    },
                    { type: 'cornerRadius', radius: theme.radius.sm },
                  ]}
                  style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>Save</Text>
                </Host>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelEdit}>
                <Host
                  modifiers={[
                    {
                      type: 'background',
                      color: theme.colors.muted.rgb,
                    },
                    { type: 'cornerRadius', radius: theme.radius.sm },
                  ]}
                  style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600' }}>Cancel</Text>
                </Host>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, lineHeight: 20 }}>{content}</Text>

            {/* Attachments */}
            {attachments && attachments.length > 0 && (
              <View style={{ gap: 6 }}>
                {attachments.map((attachment) => (
                  <Host
                    key={attachment.id}
                    modifiers={[
                      {
                        type: 'background',
                        color: theme.colors.muted.rgb,
                      },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{ padding: 8 }}
                  >
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <Text style={{ fontSize: 16 }}>📎</Text>
                      <Text style={{ fontSize: 12, flex: 1 }} numberOfLines={1}>
                        {attachment.name}
                      </Text>
                      {attachment.size && (
                        <Text style={{ fontSize: 11, color: theme.colors.mutedForeground.rgb }}>
                          {(attachment.size / 1024).toFixed(1)}KB
                        </Text>
                      )}
                    </View>
                  </Host>
                ))}
              </View>
            )}

            {/* Reactions */}
            {reactions && reactions.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {reactions.map((reaction) => (
                  <TouchableOpacity
                    key={reaction.type}
                    onPress={() => onReact?.(reaction.type)}
                  >
                    <Host
                      modifiers={[
                        {
                          type: 'background',
                          color: theme.colors.muted.rgb,
                        },
                        { type: 'cornerRadius', radius: theme.radius.sm },
                      ]}
                      style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                    >
                      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                        <Text style={{ fontSize: 14 }}>
                          {reaction.type === 'thumbsUp' && '👍'}
                          {reaction.type === 'thumbsDown' && '👎'}
                          {reaction.type === 'heart' && '❤️'}
                          {reaction.type === 'star' && '⭐'}
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: '500' }}>
                          {reaction.count}
                        </Text>
                      </View>
                    </Host>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </Host>
  );
});

const styles = StyleSheet.create({
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    minHeight: 80,
  },
});

// Example messages for testing
export const exampleMessages: MessageProps[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m here to help you with your AI SDK development. What would you like to work on today?',
    timestamp: new Date().toISOString(),
    author: {
      name: 'AI Assistant',
      status: 'online',
    },
    status: 'sent',
  },
  {
    id: '2',
    role: 'user',
    content: 'I need help creating a comprehensive component library for AI applications.',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    author: {
      name: 'You',
      status: 'online',
    },
    status: 'read',
    isEdited: true,
    editedAt: new Date(Date.now() - 30000).toISOString(),
  },
  {
    id: '3',
    role: 'system',
    content: 'New conversation started. AI Assistant is ready to help.',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    status: 'sent',
    priority: 'low',
  },
];
