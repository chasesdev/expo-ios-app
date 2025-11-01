/**
 * WebPreview Component
 *
 * Displays rich preview cards for web content (similar to Open Graph cards).
 *
 * @example
 * ```tsx
 * import { WebPreview } from '@/components/ai-sdk';
 *
 * <WebPreview
 *   url="https://example.com"
 *   title="Example Site"
 *   description="This is an example"
 *   image="https://example.com/image.jpg"
 *   variant="default"
 *   onPress={() => console.log('Open URL')}
 * />
 * ```
 */

import React, { useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { theme } from '../../theme';

// WebPreview data structure
export interface WebPreviewData {
  url: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  author?: string;
  publishedDate?: string;
  domain?: string;
}

// Props interface
export interface WebPreviewProps {
  data?: WebPreviewData; // Full preview data
  url?: string; // Fallback if only URL is provided
  title?: string; // Fallback title
  description?: string; // Fallback description
  image?: string; // Fallback image
  variant?: 'default' | 'compact' | 'minimal';
  loading?: boolean;
  error?: boolean;
  showImage?: boolean;
  onPress?: (url: string) => void;
  testID?: string;
}

// Helper: Get domain from URL
const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
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

export const WebPreview: React.FC<WebPreviewProps> = ({
  data,
  url,
  title,
  description,
  image,
  variant = 'default',
  loading = false,
  error = false,
  showImage = true,
  onPress,
  testID = 'web-preview',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Merge data with individual props (individual props take precedence)
  const finalUrl = url || data?.url || '';
  const finalTitle = title || data?.title || 'Untitled';
  const finalDescription = description || data?.description || '';
  const finalImage = image || data?.image || '';
  const siteName = data?.siteName || '';
  const author = data?.author || '';
  const publishedDate = data?.publishedDate || '';
  const domain = data?.domain || getDomain(finalUrl);
  const favicon = data?.favicon || '';

  const handlePress = () => {
    if (onPress) {
      onPress(finalUrl);
    } else if (finalUrl) {
      Linking.openURL(finalUrl).catch(() => {
        Alert.alert('Error', 'Could not open URL');
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <View
        testID={testID}
        style={{
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
          backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.7)}`,
          borderWidth: 1,
          borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 100,
        }}
      >
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text
          style={{
            marginTop: theme.spacing.sm,
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.text.secondary,
          }}
        >
          Loading preview...
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View
        testID={testID}
        style={{
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
          backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.7)}`,
          borderWidth: 1,
          borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 100,
        }}
      >
        <Text style={{ fontSize: 32 }}>🌐</Text>
        <Text
          style={{
            marginTop: theme.spacing.sm,
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.text.secondary,
            textAlign: 'center',
          }}
        >
          Preview unavailable
        </Text>
        {finalUrl && (
          <Pressable onPress={handlePress} style={{ marginTop: theme.spacing.xs }}>
            <Text
              style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.primary,
                textDecorationLine: 'underline',
              }}
              numberOfLines={1}
            >
              {domain}
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  // Minimal variant - simple link with favicon
  if (variant === 'minimal') {
    return (
      <Pressable
        testID={testID}
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          padding: theme.spacing.sm,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        {favicon ? (
          <Image
            source={{ uri: favicon }}
            style={{ width: 16, height: 16, borderRadius: 4 }}
          />
        ) : (
          <Text style={{ fontSize: 14 }}>🌐</Text>
        )}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.primary,
              textDecorationLine: 'underline',
              fontWeight: '500',
            }}
          >
            {finalTitle}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.text.tertiary,
            }}
          >
            {domain}
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: theme.colors.text.tertiary }}>↗️</Text>
      </Pressable>
    );
  }

  // Compact variant - horizontal layout with small image
  if (variant === 'compact') {
    return (
      <Pressable
        testID={testID}
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          gap: theme.spacing.sm,
          padding: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
          ...theme.glass.blur(getBlurForMaterial('thin')),
          backgroundColor: pressed
            ? `${theme.colors.surface.elevated}${opacityToHex(0.9)}`
            : `${theme.colors.surface.elevated}${opacityToHex(0.7)}`,
          borderWidth: 1,
          borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
        })}
      >
        {showImage && finalImage && (
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: theme.borderRadius.sm,
              backgroundColor: theme.colors.surface.default,
              overflow: 'hidden',
            }}
          >
            {!imageLoaded && !imageError && (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            )}
            {imageError ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24 }}>🌐</Text>
              </View>
            ) : (
              <Image
                source={{ uri: finalImage }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}
          </View>
        )}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: theme.typography.body.fontSize,
              fontWeight: '600',
              color: theme.colors.text.primary,
              lineHeight: 18,
            }}
          >
            {finalTitle}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.text.tertiary,
              marginTop: 2,
            }}
          >
            {domain}
          </Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, color: theme.colors.text.tertiary }}>↗️</Text>
        </View>
      </Pressable>
    );
  }

  // Default variant - full card with image and metadata
  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      style={({ pressed }) => ({
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
        opacity: pressed ? 0.95 : 1,
        ...theme.glass.compositingGroup,
      })}
    >
      {/* Image */}
      {showImage && finalImage && (
        <View
          style={{
            width: '100%',
            height: 180,
            backgroundColor: theme.colors.surface.default,
          }}
        >
          {!imageLoaded && !imageError && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
          {imageError ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 48 }}>🌐</Text>
            </View>
          ) : (
            <Image
              source={{ uri: finalImage }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
        </View>
      )}

      {/* Content */}
      <View style={{ padding: theme.spacing.md }}>
        {/* Header with favicon and domain */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.sm }}>
          {favicon ? (
            <Image
              source={{ uri: favicon }}
              style={{ width: 16, height: 16, borderRadius: 4 }}
            />
          ) : (
            <Text style={{ fontSize: 14 }}>🌐</Text>
          )}
          <Text
            style={{
              fontSize: theme.typography.caption.fontSize,
              color: theme.colors.text.tertiary,
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            {siteName || domain}
          </Text>
        </View>

        {/* Title */}
        <Text
          numberOfLines={2}
          style={{
            fontSize: theme.typography.title3.fontSize,
            fontWeight: '600',
            color: theme.colors.text.primary,
            lineHeight: 22,
            marginBottom: theme.spacing.xs,
          }}
        >
          {finalTitle}
        </Text>

        {/* Description */}
        {finalDescription && (
          <Text
            numberOfLines={3}
            style={{
              fontSize: theme.typography.body.fontSize,
              color: theme.colors.text.secondary,
              lineHeight: 20,
              marginBottom: theme.spacing.sm,
            }}
          >
            {finalDescription}
          </Text>
        )}

        {/* Metadata */}
        {(author || publishedDate) && (
          <View style={{ flexDirection: 'row', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
            {author && (
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.text.tertiary,
                }}
              >
                By {author}
              </Text>
            )}
            {author && publishedDate && (
              <Text style={{ color: theme.colors.text.tertiary, fontSize: 10 }}>•</Text>
            )}
            {publishedDate && (
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.text.tertiary,
                }}
              >
                {publishedDate}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.md,
          paddingTop: 0,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            fontSize: theme.typography.caption.fontSize,
            color: theme.colors.primary,
            fontFamily: 'monospace',
          }}
        >
          {finalUrl}
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.primary, marginLeft: theme.spacing.sm }}>
          ↗️
        </Text>
      </View>
    </Pressable>
  );
};

// Example web previews for testing
export const exampleWebPreviews: WebPreviewData[] = [
  {
    url: 'https://reactnative.dev',
    title: 'React Native · Learn once, write anywhere',
    description:
      'A framework for building native apps using React. React Native combines the best parts of native development with React, a best-in-class JavaScript library for building user interfaces.',
    image: 'https://reactnative.dev/img/og.png',
    favicon: 'https://reactnative.dev/img/favicon.ico',
    siteName: 'React Native',
    domain: 'reactnative.dev',
  },
  {
    url: 'https://www.anthropic.com',
    title: 'Anthropic - AI Safety and Research Company',
    description:
      'Were an AI safety company that builds reliable, interpretable, and steerable AI systems. Our work is guided by a deep commitment to responsible AI development.',
    image: 'https://www.anthropic.com/images/og-image.jpg',
    favicon: 'https://www.anthropic.com/favicon.ico',
    siteName: 'Anthropic',
    domain: 'anthropic.com',
  },
  {
    url: 'https://github.com',
    title: 'GitHub: Lets build from here',
    description:
      'GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workflows, and secure code before you commit it.',
    image: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png',
    favicon: 'https://github.com/favicon.ico',
    siteName: 'GitHub',
    domain: 'github.com',
  },
  {
    url: 'https://expo.dev',
    title: 'Expo - An open-source platform for making universal native apps',
    description:
      'Expo is an open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React.',
    image: 'https://expo.dev/og-image.jpg',
    favicon: 'https://expo.dev/favicon.ico',
    siteName: 'Expo',
    author: 'Expo Team',
    publishedDate: 'Oct 2025',
    domain: 'expo.dev',
  },
];
