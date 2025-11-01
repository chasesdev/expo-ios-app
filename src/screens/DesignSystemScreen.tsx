import React from 'react';
import { View, StyleSheet, ScrollView, Text as RNText } from 'react-native';
import { Host, VStack, HStack, Text } from '@expo/ui/swift-ui';
import { useTheme, tokens, typography, glassTokens, materialVariantNames } from '../design-system';
import { GlassCard } from '../components/ui/glass';
import { useGlassOptimization } from '../hooks/useGlassOptimization';

export function DesignSystemScreen() {
  const theme = useTheme();
  const { shouldUseGlass, isCapable, supportsAdvanced } = useGlassOptimization();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.rgb }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Host style={{ padding: 20 }}>
          <VStack spacing={32}>
            {/* Colors Section */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 24, fontWeight: '600', lineHeight: 32, marginBottom: 8, color: theme.colors.foreground.rgb }}>Colors</RNText>

              <VStack spacing={12}>
                <ColorRow label="Primary" color={theme.colors.primary.rgb} />
                <ColorRow label="Secondary" color={theme.colors.secondary.rgb} />
                <ColorRow label="Accent" color={theme.colors.accent.rgb} />
                <ColorRow label="Destructive" color={theme.colors.destructive.rgb} />
                <ColorRow label="Muted" color={theme.colors.muted.rgb} />
                <ColorRow label="Border" color={theme.colors.border.rgb} />
              </VStack>
            </VStack>

            {/* Radius Section */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 24, fontWeight: '600', lineHeight: 32, marginBottom: 8, color: theme.colors.foreground.rgb }}>Border Radius</RNText>

              <VStack spacing={12}>
                <RadiusExample label="Small" value={theme.radius.sm} />
                <RadiusExample label="Medium" value={theme.radius.md} />
                <RadiusExample label="Large" value={theme.radius.lg} />
                <RadiusExample label="Extra Large" value={theme.radius.xl} />
              </VStack>
            </VStack>

            {/* Spacing Section */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 24, fontWeight: '600', lineHeight: 32, marginBottom: 8, color: theme.colors.foreground.rgb }}>Spacing</RNText>

              <VStack spacing={12}>
                <SpacingExample label="Extra Small" value={theme.spacing.xs} />
                <SpacingExample label="Small" value={theme.spacing.sm} />
                <SpacingExample label="Medium" value={theme.spacing.md} />
                <SpacingExample label="Large" value={theme.spacing.lg} />
                <SpacingExample label="Extra Large" value={theme.spacing.xl} />
                <SpacingExample label="2X Large" value={theme.spacing['2xl']} />
              </VStack>
            </VStack>

            {/* Typography Section */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 24, fontWeight: '600', lineHeight: 32, marginBottom: 8, color: theme.colors.foreground.rgb }}>Typography</RNText>

              <VStack spacing={16}>
                <TypographyExample variant="display" text="Display" />
                <TypographyExample variant="h1" text="Heading 1" />
                <TypographyExample variant="h2" text="Heading 2" />
                <TypographyExample variant="h3" text="Heading 3" />
                <TypographyExample variant="h4" text="Heading 4" />
                <TypographyExample variant="body" text="Body text" />
                <TypographyExample variant="bodySmall" text="Small body text" />
                <TypographyExample variant="label" text="Label" />
                <TypographyExample variant="caption" text="Caption" />
              </VStack>
            </VStack>

            {/* Glass Effects Section */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 24, fontWeight: '600', lineHeight: 32, marginBottom: 8, color: theme.colors.foreground.rgb }}>Glass Effects ✨</RNText>

              {/* Device Capability */}
              <View style={[styles.infoBox, {
                backgroundColor: theme.colors.muted.rgb,
                borderColor: theme.colors.border.rgb
              }]}>
                <RNText style={[styles.infoLabel, { color: theme.colors.foreground.rgb }]}>
                  Device Capability
                </RNText>
                <RNText style={[styles.infoValue, { color: theme.colors.mutedForeground.rgb }]}>
                  {isCapable ? '✅ Supported' : '❌ Not Supported'}
                  {supportsAdvanced && ' (iOS 26+ Advanced)'}
                </RNText>
                <RNText style={[styles.infoValue, { color: theme.colors.mutedForeground.rgb }]}>
                  Glass Effects: {shouldUseGlass ? 'Enabled' : 'Disabled'}
                </RNText>
              </View>

              {/* Material Types */}
              <VStack spacing={12}>
                <RNText style={[styles.sectionLabel, { color: theme.colors.foreground.rgb }]}>
                  Material Variants
                </RNText>

                <MaterialExample
                  variant="ultraThin"
                  blur={glassTokens.blur.subtle}
                  opacity={glassTokens.opacity.subtle}
                />
                <MaterialExample
                  variant="thin"
                  blur={glassTokens.blur.light}
                  opacity={glassTokens.opacity.light}
                />
                <MaterialExample
                  variant="regular"
                  blur={glassTokens.blur.medium}
                  opacity={glassTokens.opacity.medium}
                />
                <MaterialExample
                  variant="thick"
                  blur={glassTokens.blur.heavy}
                  opacity={glassTokens.opacity.heavy}
                />
              </VStack>

              {/* Glass Tokens */}
              <VStack spacing={12}>
                <RNText style={[styles.sectionLabel, { color: theme.colors.foreground.rgb }]}>
                  Glass Tokens
                </RNText>

                <View style={[styles.tokenBox, {
                  backgroundColor: theme.colors.card.rgb,
                  borderColor: theme.colors.border.rgb
                }]}>
                  <RNText style={[styles.tokenLabel, { color: theme.colors.foreground.rgb }]}>
                    Blur Radii
                  </RNText>
                  <RNText style={[styles.tokenValue, { color: theme.colors.mutedForeground.rgb }]}>
                    Subtle: {glassTokens.blur.subtle}px{'\n'}
                    Light: {glassTokens.blur.light}px{'\n'}
                    Medium: {glassTokens.blur.medium}px{'\n'}
                    Heavy: {glassTokens.blur.heavy}px
                  </RNText>
                </View>

                <View style={[styles.tokenBox, {
                  backgroundColor: theme.colors.card.rgb,
                  borderColor: theme.colors.border.rgb
                }]}>
                  <RNText style={[styles.tokenLabel, { color: theme.colors.foreground.rgb }]}>
                    Opacity Values
                  </RNText>
                  <RNText style={[styles.tokenValue, { color: theme.colors.mutedForeground.rgb }]}>
                    Subtle: {(glassTokens.opacity.subtle * 100).toFixed(0)}%{'\n'}
                    Light: {(glassTokens.opacity.light * 100).toFixed(0)}%{'\n'}
                    Medium: {(glassTokens.opacity.medium * 100).toFixed(0)}%{'\n'}
                    Heavy: {(glassTokens.opacity.heavy * 100).toFixed(0)}%
                  </RNText>
                </View>

                <View style={[styles.tokenBox, {
                  backgroundColor: theme.colors.card.rgb,
                  borderColor: theme.colors.border.rgb
                }]}>
                  <RNText style={[styles.tokenLabel, { color: theme.colors.foreground.rgb }]}>
                    Performance Limits
                  </RNText>
                  <RNText style={[styles.tokenValue, { color: theme.colors.mutedForeground.rgb }]}>
                    Max Blur (scrolling): {glassTokens.performance.maxBlurRadius}px{'\n'}
                    Max Blur (modal): {glassTokens.performance.maxBlurRadiusModal}px{'\n'}
                    Max Layers: {glassTokens.performance.maxOverlappingLayers}{'\n'}
                    Animation: {glassTokens.performance.animationDuration}ms
                  </RNText>
                </View>
              </VStack>
            </VStack>
          </VStack>
        </Host>
      </ScrollView>
    </View>
  );
}

function MaterialExample({ variant, blur, opacity }: {
  variant: keyof typeof materialVariantNames;
  blur: number;
  opacity: number;
}) {
  const theme = useTheme();
  const { shouldUseGlass } = useGlassOptimization();

  if (!shouldUseGlass) {
    return (
      <View style={[styles.materialExample, {
        backgroundColor: theme.colors.card.rgb,
        borderColor: theme.colors.border.rgb
      }]}>
        <RNText style={[styles.materialName, { color: theme.colors.foreground.rgb }]}>
          {materialVariantNames[variant]} (Solid Fallback)
        </RNText>
      </View>
    );
  }

  return (
    <GlassCard variant={variant}>
      <RNText style={[styles.materialName, { color: theme.colors.foreground.rgb }]}>
        {materialVariantNames[variant]}
      </RNText>
      <RNText style={[styles.materialDetails, { color: theme.colors.mutedForeground.rgb }]}>
        Blur: {blur}px • Opacity: {(opacity * 100).toFixed(0)}%
      </RNText>
    </GlassCard>
  );
}

function ColorRow({ label, color }: { label: string; color: string }) {
  const theme = useTheme();

  return (
    <View style={styles.colorRow}>
      <View style={[styles.colorSwatch, { backgroundColor: color }]} />
      <View style={styles.colorInfo}>
        <RNText style={[styles.colorLabel, { color: theme.colors.foreground.rgb }]}>
          {label}
        </RNText>
        <RNText style={[styles.colorValue, { color: theme.colors.mutedForeground.rgb }]}>
          {color}
        </RNText>
      </View>
    </View>
  );
}

function RadiusExample({ label, value }: { label: string; value: number }) {
  const theme = useTheme();

  return (
    <View style={styles.exampleRow}>
      <View
        style={[
          styles.radiusBox,
          {
            backgroundColor: theme.colors.primary.rgb,
            borderRadius: value,
          },
        ]}
      />
      <RNText style={[styles.exampleLabel, { color: theme.colors.foreground.rgb }]}>
        {label} ({value}px)
      </RNText>
    </View>
  );
}

function SpacingExample({ label, value }: { label: string; value: number }) {
  const theme = useTheme();

  return (
    <View style={styles.exampleRow}>
      <View
        style={[
          styles.spacingBox,
          {
            width: value,
            backgroundColor: theme.colors.primary.rgb,
          },
        ]}
      />
      <RNText style={[styles.exampleLabel, { color: theme.colors.foreground.rgb }]}>
        {label} ({value}px)
      </RNText>
    </View>
  );
}

function TypographyExample({ variant, text }: { variant: keyof typeof typography; text: string }) {
  const theme = useTheme();
  const style = typography[variant];

  return (
    <View>
      <RNText
        style={[
          {
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            fontWeight: style.fontWeight,
            color: theme.colors.foreground.rgb,
          },
        ]}
      >
        {text}
      </RNText>
      <RNText style={[styles.typographyInfo, { color: theme.colors.mutedForeground.rgb }]}>
        {style.fontSize}px / {style.lineHeight}px • {style.fontWeight}
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00000010',
  },
  colorInfo: {
    flex: 1,
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  colorValue: {
    fontSize: 12,
    marginTop: 2,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radiusBox: {
    width: 48,
    height: 48,
  },
  spacingBox: {
    height: 48,
  },
  exampleLabel: {
    fontSize: 14,
  },
  typographyInfo: {
    fontSize: 11,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    lineHeight: 18,
  },
  tokenBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  tokenValue: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Courier',
  },
  materialExample: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '600',
  },
  materialDetails: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Courier',
  },
});
