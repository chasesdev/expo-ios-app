/**
 * Terminal Component
 *
 * Records and plays back terminal sessions with animations (like charm.land's VCR).
 * Perfect for demos, tutorials, and documentation.
 *
 * @example
 * ```tsx
 * import { Terminal, exampleRecordings } from '@/components/ai-sdk';
 *
 * <Terminal
 *   recording={exampleRecordings.npmInstall}
 *   autoPlay
 *   loop
 *   showControls
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';

// Frame types
export type TerminalFrameType = 'command' | 'output' | 'error' | 'success' | 'comment' | 'blank';

// Terminal frame structure
export interface TerminalFrame {
  type: TerminalFrameType;
  text: string;
  delay?: number; // ms before this frame appears
  speed?: number; // ms per character for typing effect
  prompt?: string; // custom prompt for this line
}

// Terminal recording structure
export interface TerminalRecording {
  id: string;
  title?: string;
  description?: string;
  frames: TerminalFrame[];
  theme?: 'dark' | 'light';
  prompt?: string; // default prompt (e.g., '$ ', '> ')
}

// Props interface
export interface TerminalProps {
  recording: TerminalRecording;
  variant?: 'default' | 'inline' | 'minimal';
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  showHeader?: boolean;
  defaultSpeed?: number; // Speed multiplier (0.5, 1, 2, 4)
  onComplete?: () => void;
  testID?: string;
}

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

// Helper: Get color for frame type
const getFrameColor = (type: TerminalFrameType, isDark: boolean): string => {
  switch (type) {
    case 'command':
      return isDark ? '#FFFFFF' : '#000000';
    case 'output':
      return isDark ? '#A0A0A0' : '#666666';
    case 'error':
      return '#FF4444';
    case 'success':
      return '#00DD00';
    case 'comment':
      return isDark ? '#888888' : '#999999';
    case 'blank':
      return 'transparent';
    default:
      return isDark ? '#FFFFFF' : '#000000';
  }
};

// Helper: Get prompt for frame
const getPrompt = (frame: TerminalFrame, defaultPrompt: string): string => {
  if (frame.type !== 'command') return '';
  return frame.prompt || defaultPrompt;
};

// Rendered terminal line component
interface RenderedLineProps {
  frame: TerminalFrame;
  text: string;
  showCursor: boolean;
  isDark: boolean;
  defaultPrompt: string;
}

const RenderedLine: React.FC<RenderedLineProps> = ({
  frame,
  text,
  showCursor,
  isDark,
  defaultPrompt,
}) => {
  const color = getFrameColor(frame.type, isDark);
  const prompt = getPrompt(frame, defaultPrompt);

  if (frame.type === 'blank') {
    return <View style={{ height: 8 }} />;
  }

  return (
    <View style={{ flexDirection: 'row', marginBottom: 2 }}>
      {/* Prompt */}
      {prompt && (
        <Text
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 20,
            color: isDark ? '#00DD00' : '#00AA00',
            fontWeight: '600',
          }}
        >
          {prompt}
        </Text>
      )}

      {/* Text */}
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: 20,
          color,
          flex: 1,
        }}
      >
        {text}
        {/* Cursor */}
        {showCursor && (
          <Text style={{ color, opacity: 0.8 }}>▋</Text>
        )}
      </Text>
    </View>
  );
};

// Main Terminal Component
export const Terminal: React.FC<TerminalProps> = ({
  recording,
  variant = 'default',
  autoPlay = false,
  loop = false,
  showControls = true,
  showHeader = true,
  defaultSpeed = 1,
  onComplete,
  testID = 'terminal',
}) => {
  const [playing, setPlaying] = useState(autoPlay);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [renderedFrames, setRenderedFrames] = useState<Array<{ frame: TerminalFrame; text: string }>>([]);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [cursorVisible, setCursorVisible] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const isDark = recording.theme === 'dark' || recording.theme === undefined;
  const defaultPrompt = recording.prompt || '$ ';
  const currentFrame = recording.frames[currentFrameIndex];
  const isComplete = currentFrameIndex >= recording.frames.length;

  // Cursor blinking
  useEffect(() => {
    if (!playing || isComplete) {
      setCursorVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [playing, isComplete]);

  // Playback engine
  useEffect(() => {
    if (!playing || isComplete) return;

    const frame = recording.frames[currentFrameIndex];
    if (!frame) return;

    const isTypingFrame = frame.type === 'command';
    const baseSpeed = frame.speed || (isTypingFrame ? 30 : 10);
    const adjustedSpeed = baseSpeed / speed;

    // Handle initial delay
    if (currentCharIndex === 0 && frame.delay) {
      const delayTimeout = setTimeout(() => {
        setCurrentCharIndex(1);
      }, frame.delay / speed);
      return () => clearTimeout(delayTimeout);
    }

    // Typing animation
    if (currentCharIndex < frame.text.length) {
      const typingTimeout = setTimeout(() => {
        setCurrentCharIndex(currentCharIndex + 1);
      }, adjustedSpeed);
      return () => clearTimeout(typingTimeout);
    }

    // Frame complete - move to next
    if (currentCharIndex >= frame.text.length) {
      const completeTimeout = setTimeout(() => {
        // Add completed frame to rendered list
        setRenderedFrames((prev) => [...prev, { frame, text: frame.text }]);

        // Move to next frame
        if (currentFrameIndex < recording.frames.length - 1) {
          setCurrentFrameIndex(currentFrameIndex + 1);
          setCurrentCharIndex(0);
        } else {
          // Recording complete
          setPlaying(false);
          if (onComplete) onComplete();

          // Loop if enabled
          if (loop) {
            setTimeout(() => {
              handleRestart();
              setPlaying(true);
            }, 1000);
          }
        }
      }, isTypingFrame ? 300 / speed : 50 / speed);
      return () => clearTimeout(completeTimeout);
    }
  }, [playing, currentFrameIndex, currentCharIndex, speed, recording, loop, isComplete, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollViewRef.current && playing) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [renderedFrames, currentFrameIndex, playing]);

  // Handlers
  const handlePlayPause = () => {
    if (isComplete) {
      handleRestart();
      setPlaying(true);
    } else {
      setPlaying(!playing);
    }
  };

  const handleRestart = () => {
    setCurrentFrameIndex(0);
    setCurrentCharIndex(0);
    setRenderedFrames([]);
    setCursorVisible(true);
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 1, 2, 4];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  // Get current typing text
  const currentTypingText = currentFrame && currentCharIndex > 0
    ? currentFrame.text.substring(0, currentCharIndex)
    : '';

  // Minimal variant - just the output
  if (variant === 'minimal') {
    return (
      <View testID={testID} style={{ padding: theme.spacing.md }}>
        <ScrollView
          ref={scrollViewRef}
          style={{ maxHeight: 300 }}
          showsVerticalScrollIndicator={false}
        >
          {renderedFrames.map((item, index) => (
            <RenderedLine
              key={index}
              frame={item.frame}
              text={item.text}
              showCursor={false}
              isDark={isDark}
              defaultPrompt={defaultPrompt}
            />
          ))}
          {currentFrame && currentCharIndex > 0 && (
            <RenderedLine
              frame={currentFrame}
              text={currentTypingText}
              showCursor={playing && cursorVisible}
              isDark={isDark}
              defaultPrompt={defaultPrompt}
            />
          )}
        </ScrollView>
      </View>
    );
  }

  // Inline variant - compact without chrome
  if (variant === 'inline') {
    return (
      <View
        testID={testID}
        style={{
          padding: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
          backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
          borderWidth: 1,
          borderColor: isDark ? '#333333' : '#DDDDDD',
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ maxHeight: 200 }}
          showsVerticalScrollIndicator={false}
        >
          {renderedFrames.map((item, index) => (
            <RenderedLine
              key={index}
              frame={item.frame}
              text={item.text}
              showCursor={false}
              isDark={isDark}
              defaultPrompt={defaultPrompt}
            />
          ))}
          {currentFrame && currentCharIndex > 0 && (
            <RenderedLine
              frame={currentFrame}
              text={currentTypingText}
              showCursor={playing && cursorVisible}
              isDark={isDark}
              defaultPrompt={defaultPrompt}
            />
          )}
        </ScrollView>
      </View>
    );
  }

  // Default variant - full terminal with controls
  return (
    <View
      testID={testID}
      style={{
        borderRadius: theme.borderRadius.lg,
        ...theme.glass.blur(getBlurForMaterial('regular')),
        backgroundColor: isDark
          ? `#1A1A1A${opacityToHex(0.95)}`
          : `${theme.colors.surface.elevated}${opacityToHex(0.9)}`,
        borderWidth: 1,
        borderColor: isDark
          ? `#333333${opacityToHex(0.5)}`
          : `${theme.colors.border.default}${opacityToHex(0.3)}`,
        shadowColor: theme.colors.shadow.default,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
        ...theme.glass.compositingGroup,
      }}
    >
      {/* Header */}
      {showHeader && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            backgroundColor: isDark ? '#252525' : '#E8E8E8',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#333333' : '#DDDDDD',
          }}
        >
          {/* Window controls */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF5F56' }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFBD2E' }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#27C93F' }} />
          </View>

          {/* Title */}
          {recording.title && (
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: isDark ? '#CCCCCC' : '#666666',
                flex: 1,
                textAlign: 'center',
              }}
            >
              {recording.title}
            </Text>
          )}

          {/* Spacer */}
          <View style={{ width: 60 }} />
        </View>
      )}

      {/* Terminal content */}
      <ScrollView
        ref={scrollViewRef}
        style={{
          maxHeight: 400,
          minHeight: 200,
        }}
        contentContainerStyle={{
          padding: theme.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Rendered frames */}
        {renderedFrames.map((item, index) => (
          <RenderedLine
            key={index}
            frame={item.frame}
            text={item.text}
            showCursor={false}
            isDark={isDark}
            defaultPrompt={defaultPrompt}
          />
        ))}

        {/* Current typing frame */}
        {currentFrame && currentCharIndex > 0 && (
          <RenderedLine
            frame={currentFrame}
            text={currentTypingText}
            showCursor={playing && cursorVisible}
            isDark={isDark}
            defaultPrompt={defaultPrompt}
          />
        )}

        {/* Completion message */}
        {isComplete && !loop && (
          <View style={{ marginTop: theme.spacing.md, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 12,
                color: isDark ? '#888888' : '#999999',
                fontStyle: 'italic',
              }}
            >
              Recording complete
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Controls */}
      {showControls && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing.md,
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#333333' : `${theme.colors.border.default}${opacityToHex(0.2)}`,
            backgroundColor: isDark
              ? '#1E1E1E'
              : `${theme.colors.surface.default}${opacityToHex(0.5)}`,
          }}
        >
          {/* Play/Pause & Restart */}
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <Pressable
              onPress={handlePlayPause}
              style={({ pressed }) => ({
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: pressed
                  ? `${theme.colors.primary}${opacityToHex(0.9)}`
                  : theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Text style={{ fontSize: 16 }}>
                {isComplete ? '↻' : playing ? '⏸' : '▶️'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleRestart}
              style={({ pressed }) => ({
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: pressed
                  ? isDark ? '#3A3A3A' : '#E0E0E0'
                  : isDark ? '#2A2A2A' : '#F0F0F0',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Text style={{ fontSize: 14 }}>⟲</Text>
            </Pressable>
          </View>

          {/* Progress */}
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <View
              style={{
                height: 4,
                borderRadius: 2,
                backgroundColor: isDark ? '#3A3A3A' : '#E0E0E0',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${((currentFrameIndex + 1) / recording.frames.length) * 100}%`,
                  backgroundColor: theme.colors.primary,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 10,
                color: isDark ? '#888888' : '#999999',
                marginTop: 4,
                textAlign: 'center',
              }}
            >
              {currentFrameIndex + 1} / {recording.frames.length}
            </Text>
          </View>

          {/* Speed control */}
          <Pressable
            onPress={handleSpeedChange}
            style={({ pressed }) => ({
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: 6,
              borderRadius: theme.borderRadius.sm,
              backgroundColor: pressed
                ? isDark ? '#3A3A3A' : '#E0E0E0'
                : isDark ? '#2A2A2A' : '#F0F0F0',
              minWidth: 50,
              alignItems: 'center',
            })}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: isDark ? '#CCCCCC' : '#666666',
              }}
            >
              {speed}x
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

// Example recordings for testing
export const exampleRecordings: Record<string, TerminalRecording> = {
  npmInstall: {
    id: 'npm-install',
    title: 'NPM Install Demo',
    description: 'Installing React Native dependencies',
    theme: 'dark',
    prompt: '$ ',
    frames: [
      { type: 'command', text: 'npm install react-native', delay: 500 },
      { type: 'output', text: 'npm WARN deprecated stable@0.1.8: Modern JS already guarantees Array#sort() is a stable sort', delay: 300 },
      { type: 'output', text: '', delay: 100 },
      { type: 'output', text: 'added 847 packages, and audited 848 packages in 45s', delay: 2000 },
      { type: 'output', text: '', delay: 100 },
      { type: 'output', text: '118 packages are looking for funding', delay: 200 },
      { type: 'output', text: '  run `npm fund` for details', delay: 100 },
      { type: 'output', text: '', delay: 100 },
      { type: 'success', text: '✓ Installation complete!', delay: 300 },
      { type: 'blank', text: '', delay: 500 },
      { type: 'command', text: 'npm start', delay: 800 },
      { type: 'output', text: 'Starting Metro bundler...', delay: 400 },
      { type: 'success', text: '✓ Metro is ready', delay: 1000 },
    ],
  },

  gitWorkflow: {
    id: 'git-workflow',
    title: 'Git Workflow',
    description: 'Common git commands',
    theme: 'dark',
    prompt: '$ ',
    frames: [
      { type: 'command', text: 'git status', delay: 300 },
      { type: 'output', text: 'On branch main', delay: 200 },
      { type: 'output', text: 'Your branch is up to date with \'origin/main\'.', delay: 100 },
      { type: 'output', text: '', delay: 50 },
      { type: 'output', text: 'Changes not staged for commit:', delay: 100 },
      { type: 'output', text: '  modified:   src/App.tsx', delay: 50 },
      { type: 'output', text: '  modified:   src/components/Button.tsx', delay: 50 },
      { type: 'blank', text: '', delay: 500 },
      { type: 'command', text: 'git add .', delay: 600 },
      { type: 'blank', text: '', delay: 300 },
      { type: 'command', text: 'git commit -m "Add new button component"', delay: 700 },
      { type: 'output', text: '[main abc1234] Add new button component', delay: 300 },
      { type: 'output', text: ' 2 files changed, 47 insertions(+), 3 deletions(-)', delay: 100 },
      { type: 'blank', text: '', delay: 400 },
      { type: 'command', text: 'git push origin main', delay: 800 },
      { type: 'output', text: 'Enumerating objects: 7, done.', delay: 200 },
      { type: 'output', text: 'Counting objects: 100% (7/7), done.', delay: 300 },
      { type: 'output', text: 'Writing objects: 100% (4/4), 1.23 KiB | 1.23 MiB/s, done.', delay: 400 },
      { type: 'success', text: '✓ Push successful!', delay: 500 },
    ],
  },

  errorHandling: {
    id: 'error-handling',
    title: 'Error Handling',
    description: 'Handling and fixing errors',
    theme: 'dark',
    prompt: '$ ',
    frames: [
      { type: 'command', text: 'npm run build', delay: 400 },
      { type: 'output', text: 'Building for production...', delay: 300 },
      { type: 'output', text: '', delay: 200 },
      { type: 'error', text: 'ERROR: Cannot find module \'lodash\'', delay: 500 },
      { type: 'error', text: 'Require stack:', delay: 100 },
      { type: 'error', text: '- /app/src/utils/helpers.ts', delay: 50 },
      { type: 'output', text: '', delay: 300 },
      { type: 'comment', text: '# Let\'s install the missing dependency', delay: 1000 },
      { type: 'blank', text: '', delay: 300 },
      { type: 'command', text: 'npm install lodash', delay: 600 },
      { type: 'output', text: '', delay: 100 },
      { type: 'output', text: 'added 1 package in 2s', delay: 1500 },
      { type: 'blank', text: '', delay: 400 },
      { type: 'command', text: 'npm run build', delay: 700 },
      { type: 'output', text: 'Building for production...', delay: 300 },
      { type: 'output', text: '', delay: 1000 },
      { type: 'success', text: '✓ Build completed successfully!', delay: 800 },
      { type: 'output', text: 'Output: dist/bundle.js (234 KB)', delay: 200 },
    ],
  },

  tutorial: {
    id: 'tutorial',
    title: 'React Native Quickstart',
    description: 'Complete project setup tutorial',
    theme: 'dark',
    prompt: '$ ',
    frames: [
      { type: 'comment', text: '# Create a new React Native project', delay: 500 },
      { type: 'command', text: 'npx react-native init MyApp', delay: 800 },
      { type: 'output', text: 'Creating a new React Native app in /Users/dev/MyApp', delay: 400 },
      { type: 'output', text: 'Downloading template...', delay: 1500 },
      { type: 'success', text: '✓ Template downloaded', delay: 800 },
      { type: 'blank', text: '', delay: 400 },
      { type: 'comment', text: '# Navigate to project directory', delay: 600 },
      { type: 'command', text: 'cd MyApp', delay: 500 },
      { type: 'blank', text: '', delay: 300 },
      { type: 'comment', text: '# Install dependencies', delay: 600 },
      { type: 'command', text: 'npm install', delay: 600 },
      { type: 'output', text: 'Installing packages...', delay: 2000 },
      { type: 'success', text: '✓ Dependencies installed', delay: 500 },
      { type: 'blank', text: '', delay: 400 },
      { type: 'comment', text: '# Start the development server', delay: 700 },
      { type: 'command', text: 'npm start', delay: 700 },
      { type: 'output', text: 'Starting Metro Bundler...', delay: 800 },
      { type: 'success', text: '✓ Ready! Press "a" for Android or "i" for iOS', delay: 1000 },
    ],
  },
};
