/**
 * Image Component
 *
 * Displays images with zoom, pan, and full-screen capabilities.
 *
 * @example
 * ```tsx
 * import { Image as AIImage } from '@/components/ai-sdk';
 *
 * <AIImage
 *   source={{ uri: 'https://example.com/image.jpg' }}
 *   caption="A beautiful landscape"
 *   variant="default"
 *   onDownload={() => console.log('Download')}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image as RNImage,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  ImageSourcePropType,
  Alert,
} from 'react-native';
import { theme } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Image data structure
export interface AIImageSource {
  uri?: string;
  base64?: string;
  local?: ImageSourcePropType;
}

export interface AIImageProps {
  source: AIImageSource;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
  variant?: 'default' | 'thumbnail' | 'fullscreen';
  aspectRatio?: number;
  showCaption?: boolean;
  showActions?: boolean;
  enableZoom?: boolean;
  onDownload?: (source: AIImageSource) => void;
  onShare?: (source: AIImageSource) => void;
  onPress?: () => void;
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

// Helper: Get image source for React Native Image
const getImageSource = (source: AIImageSource): ImageSourcePropType | null => {
  if (source.uri) {
    return { uri: source.uri };
  }
  if (source.base64) {
    return { uri: `data:image/png;base64,${source.base64}` };
  }
  if (source.local) {
    return source.local;
  }
  return null;
};

export const Image: React.FC<AIImageProps> = ({
  source,
  caption,
  alt,
  width,
  height,
  variant = 'default',
  aspectRatio = 16 / 9,
  showCaption = true,
  showActions = true,
  enableZoom = true,
  onDownload,
  onShare,
  onPress,
  testID = 'ai-image',
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  const imageSource = getImageSource(source);

  // Handlers
  const handleImageLoad = (event: any) => {
    setLoading(false);
    if (event.nativeEvent?.source) {
      setImageSize({
        width: event.nativeEvent.source.width,
        height: event.nativeEvent.source.height,
      });
    }
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (enableZoom) {
      setFullscreen(true);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(source);
    } else {
      Alert.alert('Download', 'Image download started');
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(source);
    } else {
      Alert.alert('Share', 'Share image');
    }
  };

  // Calculate dimensions
  const containerWidth = width || SCREEN_WIDTH - theme.spacing.lg * 2;
  const containerHeight = height || containerWidth / aspectRatio;

  // Thumbnail variant - small square with glass
  if (variant === 'thumbnail') {
    const thumbSize = 80;
    return (
      <Pressable
        testID={testID}
        onPress={handlePress}
        style={({ pressed }) => ({
          width: thumbSize,
          height: thumbSize,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          ...theme.glass.blur(getBlurForMaterial('thin')),
          backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.7)}`,
          borderWidth: 1,
          borderColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        {loading && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface.default }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}
        {error ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface.default }}>
            <Text style={{ fontSize: 24 }}>🖼️</Text>
            <Text style={{ fontSize: 10, color: theme.colors.text.tertiary, marginTop: 4 }}>Error</Text>
          </View>
        ) : (
          imageSource && (
            <RNImage
              source={imageSource}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )
        )}
      </Pressable>
    );
  }

  // Default variant - glass card with image and caption
  return (
    <>
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
        {/* Image Container */}
        <Pressable
          onPress={handlePress}
          style={{
            width: containerWidth,
            height: containerHeight,
            backgroundColor: theme.colors.surface.default,
            position: 'relative',
          }}
        >
          {loading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.surface.default,
                zIndex: 10,
              }}
            >
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={{ marginTop: theme.spacing.sm, fontSize: theme.typography.caption.fontSize, color: theme.colors.text.secondary }}>
                Loading image...
              </Text>
            </View>
          )}

          {error ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface.default }}>
              <Text style={{ fontSize: 48 }}>🖼️</Text>
              <Text style={{ fontSize: theme.typography.body.fontSize, color: theme.colors.text.secondary, marginTop: theme.spacing.sm }}>
                Failed to load image
              </Text>
              <Text style={{ fontSize: theme.typography.caption.fontSize, color: theme.colors.text.tertiary, marginTop: 4 }}>
                {alt || 'Image error'}
              </Text>
            </View>
          ) : (
            imageSource && (
              <RNImage
                source={imageSource}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )
          )}

          {/* Zoom indicator */}
          {enableZoom && !loading && !error && (
            <View
              style={{
                position: 'absolute',
                top: theme.spacing.sm,
                right: theme.spacing.sm,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 4,
                borderRadius: theme.borderRadius.sm,
                ...theme.glass.blur(getBlurForMaterial('thick')),
                backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.9)}`,
              }}
            >
              <Text style={{ fontSize: 12, color: theme.colors.text.primary }}>🔍</Text>
            </View>
          )}
        </Pressable>

        {/* Caption */}
        {showCaption && caption && (
          <View style={{ padding: theme.spacing.md }}>
            <Text
              style={{
                fontSize: theme.typography.body.fontSize,
                color: theme.colors.text.primary,
                lineHeight: 20,
              }}
            >
              {caption}
            </Text>
            {imageSize && (
              <Text
                style={{
                  fontSize: theme.typography.caption.fontSize,
                  color: theme.colors.text.tertiary,
                  marginTop: 4,
                }}
              >
                {imageSize.width} × {imageSize.height} px
              </Text>
            )}
          </View>
        )}

        {/* Actions */}
        {showActions && !loading && !error && (
          <View
            style={{
              flexDirection: 'row',
              padding: theme.spacing.md,
              gap: theme.spacing.sm,
              borderTopWidth: 1,
              borderTopColor: `${theme.colors.border.default}${opacityToHex(0.2)}`,
            }}
          >
            {onDownload && (
              <Pressable
                onPress={handleDownload}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: pressed
                    ? `${theme.colors.primary}${opacityToHex(0.9)}`
                    : theme.colors.primary,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: theme.spacing.xs,
                })}
              >
                <Text style={{ fontSize: 16 }}>⬇️</Text>
                <Text
                  style={{
                    fontSize: theme.typography.body.fontSize,
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}
                >
                  Download
                </Text>
              </Pressable>
            )}

            {onShare && (
              <Pressable
                onPress={handleShare}
                style={({ pressed }) => ({
                  flex: onDownload ? 0 : 1,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: pressed
                    ? `${theme.colors.surface.default}${opacityToHex(0.8)}`
                    : `${theme.colors.surface.default}${opacityToHex(0.6)}`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: theme.spacing.xs,
                })}
              >
                <Text style={{ fontSize: 18 }}>↗️</Text>
                {!onDownload && (
                  <Text
                    style={{
                      fontSize: theme.typography.body.fontSize,
                      color: theme.colors.text.primary,
                      fontWeight: '600',
                    }}
                  >
                    Share
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Full-screen Modal */}
      {enableZoom && (
        <Modal
          visible={fullscreen}
          transparent
          animationType="fade"
          onRequestClose={() => setFullscreen(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
            }}
          >
            {/* Close Button */}
            <Pressable
              onPress={() => setFullscreen(false)}
              style={{
                position: 'absolute',
                top: 50,
                right: theme.spacing.lg,
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.8)}`,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <Text style={{ fontSize: 24, color: theme.colors.text.primary }}>×</Text>
            </Pressable>

            {/* Zoomable Image */}
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              maximumZoomScale={3}
              minimumZoomScale={1}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              {imageSource && (
                <RNImage
                  source={imageSource}
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                  }}
                  resizeMode="contain"
                />
              )}
            </ScrollView>

            {/* Caption Overlay */}
            {caption && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: theme.spacing.lg,
                  ...theme.glass.blur(getBlurForMaterial('thick')),
                  backgroundColor: `${theme.colors.surface.elevated}${opacityToHex(0.95)}`,
                  borderTopWidth: 1,
                  borderTopColor: `${theme.colors.border.default}${opacityToHex(0.3)}`,
                }}
              >
                <Text
                  style={{
                    fontSize: theme.typography.body.fontSize,
                    color: theme.colors.text.primary,
                    lineHeight: 22,
                    textAlign: 'center',
                  }}
                >
                  {caption}
                </Text>
              </View>
            )}
          </View>
        </Modal>
      )}
    </>
  );
};

// Example images for testing
export const exampleImages: Array<AIImageProps> = [
  {
    source: {
      uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    },
    caption: 'Mountain landscape with snow-capped peaks and clear blue sky',
    alt: 'Mountain landscape',
    aspectRatio: 16 / 9,
  },
  {
    source: {
      uri: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    },
    caption: 'Cute cat portrait with green eyes',
    alt: 'Cat portrait',
    aspectRatio: 4 / 3,
  },
  {
    source: {
      uri: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    },
    caption: 'Earth from space showing continents and clouds',
    alt: 'Earth from space',
    aspectRatio: 1,
  },
];
