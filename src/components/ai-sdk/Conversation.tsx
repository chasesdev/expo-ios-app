import React, { useRef, useEffect } from 'react';
import { VStack, Text } from '@expo/ui/swift-ui';
import { Host } from '../common/SwiftUIHost';
import { ScrollView, RefreshControl, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useTheme } from '../../design-system';
import { Message, MessageProps } from './Message';

export interface ConversationProps {
  messages: MessageProps[];
  layout?: 'chat' | 'timeline' | 'compact' | 'minimal';
  showTypingIndicator?: boolean;
  isLoading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  onSendMessage?: (text: string) => void;
  onMessageAction?: (messageId: string, action: string) => void;
  emptyStateText?: string;
  emptyStateIcon?: string;
  groupByDate?: boolean;
  showAvatars?: boolean;
  showTimestamps?: boolean;
  autoScroll?: boolean;
  testID?: string;
}

/**
 * AI SDK Conversation component with chat layout
 *
 * Displays a full conversation interface with messages, scrolling,
 * keyboard handling, and optional typing indicators.
 *
 * @example
 * ```tsx
 * <Conversation
 *   messages={messages}
 *   layout="chat"
 *   showTypingIndicator={true}
 *   onSendMessage={(text) => console.log(text)}
 * />
 * ```
 */
export function Conversation({
  messages,
  layout = 'chat',
  showTypingIndicator = false,
  isLoading = false,
  onRefresh,
  refreshing = false,
  onSendMessage,
  onMessageAction,
  emptyStateText = 'No messages yet',
  emptyStateIcon = '💬',
  groupByDate = true,
  showAvatars = true,
  showTimestamps = true,
  autoScroll = true,
  testID,
}: ConversationProps) {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, autoScroll]);

  // Group messages by date
  const groupedMessages = groupByDate ? groupMessagesByDate(messages) : { Today: messages };

  // Handle message actions
  const handleMessageAction = (messageId: string, action: string) => {
    onMessageAction?.(messageId, action);
  };

  // Empty state
  if (messages.length === 0 && !isLoading) {
    return (
      <Host
        testID={testID}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.xl,
        }}
      >
        <VStack spacing={16} style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 48 }}>{emptyStateIcon}</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: theme.colors.mutedForeground.rgb,
              textAlign: 'center',
            }}
          >
            {emptyStateText}
          </Text>
        </VStack>
      </Host>
    );
  }

  const messageVariant = layout === 'chat' ? 'compact' : layout;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <Host testID={testID} style={{ flex: 1, backgroundColor: theme.colors.background.rgb }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: theme.spacing.xl }}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        >
          <VStack spacing={layout === 'minimal' ? 8 : 16}>
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <VStack key={date} spacing={layout === 'minimal' ? 8 : 12}>
                {groupByDate && messages.length > 0 && (
                  <Host
                    modifiers={[
                      {
                        type: 'background',
                        color: theme.colors.muted.rgb,
                      },
                      { type: 'cornerRadius', radius: theme.radius.sm },
                    ]}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      alignSelf: 'center',
                      marginVertical: 8,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '600', color: theme.colors.mutedForeground.rgb }}>
                      {date}
                    </Text>
                  </Host>
                )}

                {dateMessages.map((message) => (
                  <Message
                    key={message.id}
                    {...message}
                    variant={messageVariant}
                    showAvatar={showAvatars}
                    showTimestamp={showTimestamps}
                    onCopy={() => handleMessageAction(message.id, 'copy')}
                    onEdit={(content) => handleMessageAction(message.id, `edit:${content}`)}
                    onDelete={() => handleMessageAction(message.id, 'delete')}
                    onReact={(reaction) => handleMessageAction(message.id, `react:${reaction}`)}
                    onBookmark={() => handleMessageAction(message.id, 'bookmark')}
                    onFlag={() => handleMessageAction(message.id, 'flag')}
                    onShare={() => handleMessageAction(message.id, 'share')}
                    onRetry={() => handleMessageAction(message.id, 'retry')}
                  />
                ))}
              </VStack>
            ))}

            {/* Typing Indicator */}
            {showTypingIndicator && (
              <Host
                modifiers={[
                  {
                    type: 'background',
                    color: theme.colors.muted.rgb,
                  },
                  { type: 'cornerRadius', radius: theme.radius.md },
                ]}
                style={{ padding: theme.spacing.sm, alignSelf: 'flex-start' }}
              >
                <TypingIndicator />
              </Host>
            )}

            {/* Loading State */}
            {isLoading && (
              <Host style={{ alignItems: 'center', padding: theme.spacing.md }}>
                <Text style={{ fontSize: 13, color: theme.colors.mutedForeground.rgb }}>
                  Loading messages...
                </Text>
              </Host>
            )}
          </VStack>
        </ScrollView>
      </Host>
    </KeyboardAvoidingView>
  );
}

/**
 * Animated typing indicator (three dots)
 */
function TypingIndicator() {
  const theme = useTheme();

  return (
    <Host style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
      <AnimatedDot delay={0} />
      <AnimatedDot delay={200} />
      <AnimatedDot delay={400} />
    </Host>
  );
}

function AnimatedDot({ delay }: { delay: number }) {
  const theme = useTheme();
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsActive(true);
    }, delay);

    const interval = setInterval(() => {
      setIsActive((prev) => !prev);
    }, 600);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [delay]);

  return (
    <Host
      modifiers={[
        {
          type: 'background',
          color: theme.colors.foreground.rgb,
        },
        { type: 'cornerRadius', radius: 4 },
        {
          type: 'opacity',
          value: isActive ? 1.0 : 0.3,
        },
      ]}
      style={{ width: 8, height: 8 }}
    />
  );
}

/**
 * Group messages by date for display
 */
function groupMessagesByDate(messages: MessageProps[]): Record<string, MessageProps[]> {
  const grouped: Record<string, MessageProps[]> = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;

    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });

  return grouped;
}

// Example conversation for testing
export const exampleConversation: MessageProps[] = [
  {
    id: '1',
    role: 'system',
    content: 'Conversation started',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'sent',
    priority: 'low',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Hello! How can I help you with your project today?',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    author: {
      name: 'AI Assistant',
      status: 'online',
    },
    status: 'sent',
  },
  {
    id: '3',
    role: 'user',
    content: 'I need help building AI components for my iOS app.',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    author: {
      name: 'You',
      status: 'online',
    },
    status: 'read',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Great! I can help you build native iOS components using React Native and Swift UI. What components do you need?',
    timestamp: new Date(Date.now() - 3300000).toISOString(),
    author: {
      name: 'AI Assistant',
      status: 'online',
    },
    status: 'sent',
  },
  {
    id: '5',
    role: 'user',
    content: 'Let\'s start with a Message component and a Conversation component.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    author: {
      name: 'You',
      status: 'online',
    },
    status: 'read',
  },
  {
    id: '6',
    role: 'assistant',
    content: 'Perfect! I\'ll create those components with glass effects and accessibility support. The Message component will support different variants (default, compact, minimal) and the Conversation component will handle scrolling, keyboard avoidance, and typing indicators.',
    timestamp: new Date(Date.now() - 1700000).toISOString(),
    author: {
      name: 'AI Assistant',
      status: 'online',
    },
    status: 'sent',
  },
];
