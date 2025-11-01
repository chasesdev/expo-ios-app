import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text as RNText } from 'react-native';
import { Host, VStack, Button, Text, Switch, Slider } from '@expo/ui/swift-ui';
import { useTheme } from '../design-system';
import { GlassCard, GlassButton } from '../components/ui/glass';
import { Card } from '../components/ui/Card';
import { useGlassOptimization } from '../hooks/useGlassOptimization';

export function BaseComponentsScreen() {
  const theme = useTheme();
  const { shouldUseGlass, reduceTransparency } = useGlassOptimization();
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(0.5);
  const [glassEnabled, setGlassEnabled] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.rgb }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Host style={{ padding: 20 }}>
          <VStack spacing={32}>
            {/* Header */}
            <VStack spacing={8}>
              <Text style={{ fontSize: 28, fontWeight: '600' }}>
                Base UI Components
              </Text>
              <Text style={{ fontSize: 14, opacity: 0.7 }}>
                Foundational components using @expo/ui/swift-ui
              </Text>
            </VStack>

            {/* Glass Effects Section - NEW! */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Glass Effects ✨</RNText>

              {/* Accessibility Status */}
              {reduceTransparency && (
                <View style={[styles.accessibilityNotice, {
                  backgroundColor: theme.colors.muted.rgb,
                  borderColor: theme.colors.border.rgb
                }]}>
                  <RNText style={[styles.noticeText, { color: theme.colors.foreground.rgb }]}>
                    ℹ️ "Reduce Transparency" is enabled. Glass effects use solid colors.
                  </RNText>
                </View>
              )}

              {/* Glass Toggle */}
              <Switch
                checked={glassEnabled}
                onValueChange={setGlassEnabled}
                label="Enable Glass Effects"
                variant="switch"
              />

              {/* Glass Cards Comparison */}
              <VStack spacing={12}>
                <RNText style={[styles.sectionLabel, { color: theme.colors.foreground.rgb }]}>
                  Glass Cards
                </RNText>

                {glassEnabled && shouldUseGlass ? (
                  <>
                    <GlassCard variant="ultraThin">
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Ultra Thin Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Most transparent, minimal blur (10px)
                      </RNText>
                    </GlassCard>

                    <GlassCard variant="thin">
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Thin Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Light blur, subtle depth (15px)
                      </RNText>
                    </GlassCard>

                    <GlassCard variant="regular">
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Regular Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Standard blur, balanced (20px)
                      </RNText>
                    </GlassCard>

                    <GlassCard variant="thick">
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Thick Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Heavy blur, strong separation (30px)
                      </RNText>
                    </GlassCard>
                  </>
                ) : (
                  <Card>
                    <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                      Solid Card (Fallback)
                    </RNText>
                    <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                      Glass effects disabled or not supported
                    </RNText>
                  </Card>
                )}
              </VStack>

              {/* Glass Buttons */}
              <VStack spacing={12}>
                <RNText style={[styles.sectionLabel, { color: theme.colors.foreground.rgb }]}>
                  Glass Buttons
                </RNText>

                {glassEnabled && shouldUseGlass ? (
                  <>
                    <GlassButton
                      title="Primary Glass Button"
                      style="primary"
                      onPress={() => console.log('Primary pressed')}
                    />
                    <GlassButton
                      title="Secondary Glass Button"
                      style="secondary"
                      onPress={() => console.log('Secondary pressed')}
                    />
                    <GlassButton
                      title="Ghost Glass Button"
                      style="ghost"
                      onPress={() => console.log('Ghost pressed')}
                    />
                  </>
                ) : (
                  <Button variant="default" onPress={() => console.log('Pressed')}>
                    Solid Button (Fallback)
                  </Button>
                )}
              </VStack>
            </VStack>

            {/* Standard Buttons */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Standard Buttons</RNText>
              <VStack spacing={12}>
                <Button variant="default" onPress={() => console.log('Default pressed')}>
                  Default Button
                </Button>
                <Button variant="bordered" onPress={() => console.log('Bordered pressed')}>
                  Bordered Button
                </Button>
              </VStack>
            </VStack>

            {/* Switches & Toggles */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Switches</RNText>
              <VStack spacing={12}>
                <Switch
                  checked={switchValue}
                  onValueChange={setSwitchValue}
                  label="Toggle Switch"
                  variant="switch"
                />
                <Switch
                  checked={switchValue}
                  onValueChange={setSwitchValue}
                  label="Checkbox"
                  variant="checkbox"
                />
              </VStack>
            </VStack>

            {/* Slider */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Slider</RNText>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
              />
              <Text style={{ fontSize: 14, opacity: 0.7 }}>
                Value: {sliderValue.toFixed(2)}
              </Text>
            </VStack>

            {/* More components coming soon */}
            <VStack spacing={12}>
              <RNText style={[styles.comingSoon, { color: theme.colors.mutedForeground.rgb }]}>
                More components coming soon:
              </RNText>
              <RNText style={[styles.componentList, { color: theme.colors.mutedForeground.rgb }]}>
                • Text Fields & Inputs{'\n'}
                • Date Pickers{'\n'}
                • Context Menus{'\n'}
                • Lists & Grids{'\n'}
                • Progress Indicators{'\n'}
                • And 40+ more...
              </RNText>
            </VStack>
          </VStack>
        </Host>
      </ScrollView>
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  accessibilityNotice: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  comingSoon: {
    fontSize: 16,
    fontWeight: '500',
  },
  componentList: {
    fontSize: 14,
    lineHeight: 24,
  },
});
