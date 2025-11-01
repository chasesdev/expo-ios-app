import React, { useEffect, useState } from 'react';
import { Host, VStack, HStack, Text } from '@expo/ui/swift-ui';
import { useTheme } from '../../design-system';
import {
  MaterialVariant,
  getBlurForMaterial,
  getOpacityForMaterial,
  opacityToHex,
} from '../../design-system/glass-tokens';

export interface ResponseProps {
  content: string;
  streaming?: boolean;
  showLoader?: boolean;
  variant?: 'default' | 'minimal' | 'inline';
  showCursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  testID?: string;
}

/**
 * AI SDK Response component with streaming support
 *
 * Displays AI-generated responses with optional streaming animation
 * and loading states. Optimized for chat interfaces.
 *
 * @example
 * ```tsx
 * <Response
 *   content="This is an AI response..."
 *   streaming={true}
 *   showLoader={true}
 * />
 * ```
 */
export function Response({
  content,
  streaming = false,
  showLoader = false,
  variant = 'default',
  showCursor = true,
  cursorChar = '▋',
  onComplete,
  testID,
}: ResponseProps) {
  const theme = useTheme();
  const [displayedContent, setDisplayedContent] = useState(streaming ? '' : content);
  const [showBlinkingCursor, setShowBlinkingCursor] = useState(true);

  // Streaming animation effect
  useEffect(() => {
    if (!streaming) {
      setDisplayedContent(content);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 20); // 20ms per character for smooth streaming

    return () => clearInterval(interval);
  }, [content, streaming, onComplete]);

  // Cursor blinking effect
  useEffect(() => {
    if (!showCursor || !streaming) return;

    const blinkInterval = setInterval(() => {
      setShowBlinkingCursor((prev) => !prev);
    }, 500); // Blink every 500ms

    return () => clearInterval(blinkInterval);
  }, [showCursor, streaming]);

  const glassVariant: MaterialVariant = 'thin';
  const blurRadius = getBlurForMaterial(glassVariant);
  const opacity = getOpacityForMaterial(glassVariant);
  const opacityHex = opacityToHex(opacity);

  // Minimal variant - no glass effect
  if (variant === 'minimal') {
    return (
      <Host testID={testID} style={{ padding: theme.spacing.xs }}>
        <HStack spacing={4} style={{ alignItems: 'flex-start' }}>
          {showLoader && (
            <Text style={{ fontSize: 14 }}>💬</Text>
          )}
          <Text style={{ fontSize: 14, lineHeight: 20, flex: 1 }}>
            {displayedContent}
            {streaming && showCursor && showBlinkingCursor && (
              <Text style={{ color: theme.colors.primary.rgb }}>{cursorChar}</Text>
            )}
          </Text>
        </HStack>
      </Host>
    );
  }

  // Inline variant - no background
  if (variant === 'inline') {
    return (
      <Host testID={testID}>
        <HStack spacing={6} style={{ alignItems: 'center' }}>
          {showLoader && (
            <Host
              modifiers={[
                {
                  type: 'background',
                  color: theme.colors.muted.rgb,
                },
                { type: 'cornerRadius', radius: 12 },
              ]}
              style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 12 }}>🤖</Text>
            </Host>
          )}
          <Text style={{ fontSize: 14, lineHeight: 20 }}>
            {displayedContent}
            {streaming && showCursor && showBlinkingCursor && (
              <Text style={{ color: theme.colors.primary.rgb }}>{cursorChar}</Text>
            )}
          </Text>
        </HStack>
      </Host>
    );
  }

  // Default variant - glass card
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
          color: theme.colors.border.rgb,
          width: 1,
          opacity: 0.3,
        },
        {
          type: 'shadow',
          color: '#00000008',
          radius: 10,
          x: 0,
          y: 4,
        },
        { type: 'compositingGroup' },
      ]}
      style={{ padding: theme.spacing.md }}
    >
      <VStack spacing={8}>
        {/* Header with loader */}
        {showLoader && (
          <HStack spacing={8} style={{ alignItems: 'center' }}>
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
              <Text style={{ fontSize: 16 }}>🤖</Text>
            </Host>
            <Text style={{ fontSize: 13, fontWeight: '500', color: theme.colors.mutedForeground.rgb }}>
              {streaming ? 'AI is typing...' : 'AI Assistant'}
            </Text>
          </HStack>
        )}

        {/* Response content */}
        <Text style={{ fontSize: 14, lineHeight: 20 }}>
          {displayedContent}
          {streaming && showCursor && showBlinkingCursor && (
            <Text style={{ color: theme.colors.primary.rgb, fontWeight: '600' }}>
              {cursorChar}
            </Text>
          )}
        </Text>

        {/* Streaming indicator dots */}
        {streaming && !displayedContent && (
          <HStack spacing={4}>
            <LoadingDot delay={0} />
            <LoadingDot delay={150} />
            <LoadingDot delay={300} />
          </HStack>
        )}
      </VStack>
    </Host>
  );
}

/**
 * Animated loading dot for streaming indicator
 */
function LoadingDot({ delay }: { delay: number }) {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 600);

    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [delay]);

  return (
    <Host
      modifiers={[
        {
          type: 'background',
          color: theme.colors.mutedForeground.rgb,
        },
        { type: 'cornerRadius', radius: 3 },
        {
          type: 'opacity',
          value: isVisible ? 1.0 : 0.3,
        },
      ]}
      style={{ width: 6, height: 6 }}
    />
  );
}

// Example responses for testing
export const exampleResponses: ResponseProps[] = [
  {
    content: 'Hello! I\'m here to assist you with your project. What would you like to work on today?',
    streaming: false,
    showLoader: true,
    variant: 'default',
  },
  {
    content: 'Let me help you build a comprehensive component library for AI applications. We can start with the core conversation components.',
    streaming: true,
    showLoader: true,
    variant: 'default',
  },
  {
    content: 'This is a minimal response without any glass effects.',
    streaming: false,
    showLoader: false,
    variant: 'minimal',
  },
  {
    content: 'Inline response with avatar',
    streaming: false,
    showLoader: true,
    variant: 'inline',
  },
];
