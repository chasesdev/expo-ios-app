import React, { useState } from 'react';
import { View, StyleSheet, ScrollView as RN , Text as RNText} from 'react-native';
import { Button, Switch, Slider, SecureField, Picker, DateTimePicker, ColorPicker, List, Section, Form, LabeledContent, Divider, ContentUnavailableView, ShareLink, BottomSheet, Text, TextField, LabelPrimitive } from '@expo/ui/swift-ui';
import { Host } from '../components/common/SwiftUIHost';
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

  // Text Input states
  const [textFieldValue, setTextFieldValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // Selection states
  const [selectedFruit, setSelectedFruit] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState('#007AFF');

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');

  // Advanced component states
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [progressValue, setProgressValue] = useState(0.65);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.rgb }]}>
      <RN contentContainerStyle={styles.scrollContent}>
        <Host style={{ padding: 20 }}>
          <View style={{ gap: 32 }}>
            {/* Header */}
            <View style={{ gap: 8 }}>
              <RNText style={{ fontSize: 28, fontWeight: '600', color: theme.colors.foreground.rgb }}>
                Base UI Components
              </RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, color: theme.colors.foreground.rgb }}>
                Foundational components using @expo/ui/swift-ui
              </RNText>
            </View>

            {/* Glass Effects Section - NEW! */}
            <View style={{ gap: 16 }}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Glass Effects ✨</RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 4, color: theme.colors.foreground.rgb }}>
                iOS 26 glass morphism with 6 material variants: ultraThin, thin, regular, thick, ultraThick, and bar
              </RNText>

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
              <Host>
                <Switch
                  value={glassEnabled}
                  onValueChange={setGlassEnabled}
                  label="Enable Glass Effects"
                  variant="switch"
                />
              </Host>

              {/* Glass Cards Comparison */}
              <View style={{ gap: 12 }}>
                <RNText style={[styles.sectionLabel, { color: theme.colors.foreground.rgb }]}>
                  Glass Cards
                </RNText>

                {glassEnabled && shouldUseGlass ? (
                  <>
                    <GlassCard variant="ultraThin" style={{ alignSelf: 'stretch' }}>
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Ultra Thin Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Most transparent, minimal blur (10px)
                      </RNText>
                    </GlassCard>

                    <GlassCard variant="thin" style={{ alignSelf: 'stretch' }}>
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Thin Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Light blur, subtle depth (15px)
                      </RNText>
                    </GlassCard>

                    <GlassCard variant="regular" style={{ alignSelf: 'stretch' }}>
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Regular Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Standard blur, balanced (20px)
                      </RNText>
                    </GlassCard>

                    <GlassCard variant="thick" style={{ alignSelf: 'stretch' }}>
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Thick Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Heavy blur, strong separation (30px)
                      </RNText>
                    </GlassCard>

                    <GlassCard variant="ultraThick" style={{ alignSelf: 'stretch' }}>
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Ultra Thick Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Maximum blur, maximum separation
                      </RNText>
                    </GlassCard>

                    <GlassCard variant="bar" style={{ alignSelf: 'stretch' }}>
                      <RNText style={{ color: theme.colors.foreground.rgb, fontSize: 16, fontWeight: '600' }}>
                        Bar Material
                      </RNText>
                      <RNText style={{ color: theme.colors.mutedForeground.rgb, fontSize: 14, marginTop: 4 }}>
                        Optimized for navigation bars and toolbars
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
              </View>

              {/* Glass Buttons */}
              <View style={{ gap: 12 }}>
                <RNText style={[styles.sectionLabel, { color: theme.colors.foreground.rgb }]}>
                  Glass Buttons
                </RNText>

                {glassEnabled && shouldUseGlass ? (
                  <>
                    <GlassButton
                      title="Primary Glass Button"
                      style="primary"
                      onPress={() => console.log('Primary pressed')}
                      buttonStyle={{ alignSelf: 'stretch' }}
                    />
                    <GlassButton
                      title="Secondary Glass Button"
                      style="secondary"
                      onPress={() => console.log('Secondary pressed')}
                      buttonStyle={{ alignSelf: 'stretch' }}
                    />
                    <GlassButton
                      title="Ghost Glass Button"
                      style="ghost"
                      onPress={() => console.log('Ghost pressed')}
                      buttonStyle={{ alignSelf: 'stretch' }}
                    />
                  </>
                ) : (
                  <Host>
                    <Button variant="default" onPress={() => console.log('Pressed')}>
                      Solid Button (Fallback)
                    </Button>
                  </Host>
                )}
              </View>
            </View>

            {/* Standard Buttons */}
            <View style={{ gap: 16 }}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Standard Buttons</RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 4, color: theme.colors.foreground.rgb }}>
                Native SwiftUI button variants
              </RNText>
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Host>
                      <Button variant="default" onPress={() => console.log('Default pressed')}>
                        Default
                      </Button>
                    </Host>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Host>
                      <Button variant="bordered" onPress={() => console.log('Bordered pressed')}>
                        Bordered
                      </Button>
                    </Host>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Host>
                      <Button variant="borderless" onPress={() => console.log('Borderless pressed')}>
                        Borderless
                      </Button>
                    </Host>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Host>
                      <Button variant="plain" onPress={() => console.log('Plain pressed')}>
                        Plain
                      </Button>
                    </Host>
                  </View>
                </View>
              </View>
            </View>

            {/* Switches & Toggles */}
            <View style={{ gap: 16 }}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Switches & Toggles</RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 4, color: theme.colors.foreground.rgb }}>
                Interactive toggle controls with multiple variants
              </RNText>
              <View style={{ gap: 12 }}>
                <Host>
                  <Switch
                    value={switchValue}
                    onValueChange={setSwitchValue}
                    label="Toggle Switch"
                    variant="switch"
                  />
                </Host>
                <Host>
                  <Switch
                    value={switchValue}
                    onValueChange={setSwitchValue}
                    label="Checkbox"
                    variant="checkbox"
                  />
                </Host>
              </View>
            </View>

            {/* Slider */}
            <View style={{ gap: 16 }}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Slider</RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 4, color: theme.colors.foreground.rgb }}>
                Continuous value selection
              </RNText>
              <Host>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                />
              </Host>
              <RNText style={{ fontSize: 14, opacity: 0.7, color: theme.colors.foreground.rgb }}>
                Value: {sliderValue.toFixed(2)}
              </RNText>
            </View>

            {/* Text Inputs */}
            <View style={{ gap: 16 }}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Text Inputs</RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 4, color: theme.colors.foreground.rgb }}>
                Native text fields with various keyboard types and secure input
              </RNText>
              <View style={{ gap: 12 }}>
                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Basic Text Field
                  </RNText>
                  <Host>
                    <TextField
                      defaultValue={textFieldValue}
                      onChangeText={setTextFieldValue}
                      placeholder="Enter text here..."
                    />
                  </Host>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Email Field
                  </RNText>
                  <Host>
                    <TextField
                      defaultValue={emailValue}
                      onChangeText={setEmailValue}
                      placeholder="your@email.com"
                      keyboardType="email-address"
                    />
                  </Host>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Secure Field (Password)
                  </RNText>
                  <Host>
                    <SecureField
                      defaultValue={passwordValue}
                      onChangeText={setPasswordValue}
                      placeholder="Enter password..."
                    />
                  </Host>
                </View>
              </View>
            </View>

            {/* Selection Components */}
            <View style={{ gap: 16 }}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Selection Components</RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 4, color: theme.colors.foreground.rgb }}>
                Pickers for values, dates, and colors
              </RNText>
              <View style={{ gap: 12 }}>
                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Picker (Menu Style)
                  </RNText>
                  <Host>
                    <Picker
                      options={['Apple 🍎', 'Banana 🍌', 'Orange 🍊', 'Grape 🍇', 'Watermelon 🍉']}
                      selectedIndex={selectedFruit}
                      onOptionSelected={(e) => setSelectedFruit(e.nativeEvent.index)}
                      label="Choose a fruit"
                      variant="menu"
                    />
                  </Host>
                  <RNText style={{ fontSize: 12, opacity: 0.6, color: theme.colors.foreground.rgb }}>
                    Selected index: {selectedFruit}
                  </RNText>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Date Picker
                  </RNText>
                  <Host>
                    <DateTimePicker
                      initialDate={selectedDate.toISOString()}
                      onDateSelected={setSelectedDate}
                      displayedComponents="dateAndTime"
                    />
                  </Host>
                  <RNText style={{ fontSize: 12, opacity: 0.6, color: theme.colors.foreground.rgb }}>
                    Selected: {selectedDate.toLocaleString()}
                  </RNText>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Color Picker
                  </RNText>
                  <Host>
                    <ColorPicker
                      selection={selectedColor}
                      onValueChanged={setSelectedColor}
                      supportsOpacity
                    />
                  </Host>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <View style={{ width: 40, height: 40, backgroundColor: selectedColor, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border.rgb }} />
                    <RNText style={{ fontSize: 12, opacity: 0.6, color: theme.colors.foreground.rgb }}>
                      {selectedColor}
                    </RNText>
                  </View>
                </View>
              </View>
            </View>

            {/* Lists & Forms */}
            <View style={{ gap: 16 }}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Lists & Forms</RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 4, color: theme.colors.foreground.rgb }}>
                Structured data display with sections and form layouts
              </RNText>
              <View style={{ gap: 12 }}>
                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    List with Sections
                  </RNText>
                  <Card>
                    <Host>
                      <List>
                        <Section title="Fruits">
                          <LabelPrimitive title="Apple 🍎" />
                          <LabelPrimitive title="Banana 🍌" />
                          <LabelPrimitive title="Orange 🍊" />
                        </Section>
                        <Section title="Vegetables">
                          <LabelPrimitive title="Carrot 🥕" />
                          <LabelPrimitive title="Broccoli 🥦" />
                        </Section>
                      </List>
                    </Host>
                  </Card>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Form Example
                  </RNText>
                  <Card>
                    <Host>
                      <Form>
                        <Section title="Profile Information">
                          <LabeledContent label="Name">
                            <TextField
                              defaultValue={formName}
                              onChangeText={setFormName}
                              placeholder="Enter your name"
                            />
                          </LabeledContent>
                          <LabeledContent label="Email">
                            <TextField
                              defaultValue={formEmail}
                              onChangeText={setFormEmail}
                              placeholder="your@email.com"
                              keyboardType="email-address"
                            />
                          </LabeledContent>
                        </Section>
                      </Form>
                    </Host>
                  </Card>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Advanced Settings
                  </RNText>
                  <Card>
                    <View style={{ padding: 12, gap: 8 }}>
                      <RNText style={{ fontSize: 14, color: theme.colors.foreground.rgb }}>
                        All settings are always visible
                      </RNText>
                      <Host>
                        <Switch
                          value={switchValue}
                          onValueChange={setSwitchValue}
                          label="Enable feature"
                          variant="switch"
                        />
                      </Host>
                    </View>
                  </Card>
                </View>
              </View>
            </View>

            {/* Advanced Components */}
            <View style={{ gap: 16 }}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Advanced Components</RNText>
              <RNText style={{ fontSize: 14, opacity: 0.7, marginBottom: 4, color: theme.colors.foreground.rgb }}>
                Progress indicators, sheets, sharing, and empty states
              </RNText>
              <View style={{ gap: 12 }}>
                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Progress Indicator
                  </RNText>
                  <View style={{ height: 8, backgroundColor: theme.colors.muted.rgb, borderRadius: 4, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${progressValue * 100}%`, backgroundColor: theme.colors.foreground.rgb }} />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Host>
                      <Button
                        variant="bordered"
                        onPress={() => setProgressValue(Math.max(0, progressValue - 0.1))}
                      >
                        -
                      </Button>
                    </Host>
                    <RNText style={{ fontSize: 14, opacity: 0.7, flex: 1, textAlign: 'center', color: theme.colors.foreground.rgb }}>
                      {Math.round(progressValue * 100)}%
                    </RNText>
                    <Host>
                      <Button
                        variant="bordered"
                        onPress={() => setProgressValue(Math.min(1, progressValue + 0.1))}
                      >
                        +
                      </Button>
                    </Host>
                  </View>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Divider
                  </RNText>
                  <Card>
                    <View style={{ gap: 0 }}>
                      <RNText style={{ padding: 12, color: theme.colors.foreground.rgb }}>First Item</RNText>
                      <Host>
                        <Divider />
                      </Host>
                      <RNText style={{ padding: 12, color: theme.colors.foreground.rgb }}>Second Item</RNText>
                      <Host>
                        <Divider />
                      </Host>
                      <RNText style={{ padding: 12, color: theme.colors.foreground.rgb }}>Third Item</RNText>
                    </View>
                  </Card>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Bottom Sheet
                  </RNText>
                  <Host>
                    <Button
                      variant="default"
                      onPress={() => setShowBottomSheet(true)}
                    >
                      Show Bottom Sheet
                    </Button>
                  </Host>
                  <Host>
                    <BottomSheet
                      isOpened={showBottomSheet}
                      onIsOpenedChange={setShowBottomSheet}
                    >
                      <View style={{ padding: 20, gap: 16 }}>
                        <RNText style={{ fontSize: 24, fontWeight: '600', color: theme.colors.foreground.rgb }}>
                          Bottom Sheet
                        </RNText>
                        <RNText style={{ fontSize: 16, opacity: 0.8, color: theme.colors.foreground.rgb }}>
                          This is a modal bottom sheet. It slides up from the bottom of the screen.
                        </RNText>
                        <Host>
                          <Button
                            variant="default"
                            onPress={() => setShowBottomSheet(false)}
                          >
                            Close
                          </Button>
                        </Host>
                      </View>
                    </BottomSheet>
                  </Host>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Share Link
                  </RNText>
                  <Host>
                    <ShareLink
                      item="https://expo.dev"
                      subject="Check out Expo!"
                    >
                      <Button variant="bordered">
                        Share Expo Website
                      </Button>
                    </ShareLink>
                  </Host>
                </View>

                <View style={{ gap: 4 }}>
                  <RNText style={{ fontSize: 14, fontWeight: '500', opacity: 0.8, color: theme.colors.foreground.rgb }}>
                    Content Unavailable View (Empty State)
                  </RNText>
                  <Card>
                    <Host>
                      <ContentUnavailableView
                        title="No Data"
                        description="There's nothing to show here yet."
                        systemImage="tray"
                      />
                    </Host>
                  </Card>
                </View>
              </View>
            </View>

            {/* Additional Info */}
            <View style={{ gap: 12 }}>
              <Card>
                <View style={{ gap: 8 }}>
                  <RNText style={{ fontSize: 16, fontWeight: '600', color: theme.colors.foreground.rgb }}>
                    📦 Component Library
                  </RNText>
                  <RNText style={{ fontSize: 14, lineHeight: 20, color: theme.colors.mutedForeground.rgb }}>
                    This screen showcases 20+ base components from @expo/ui/swift-ui. The library includes 49+ native SwiftUI components total, including Charts, Gauges, Shapes, and more advanced features.
                  </RNText>
                  <Host>
                    <Divider />
                  </Host>
                  <RNText style={{ fontSize: 14, lineHeight: 20, color: theme.colors.mutedForeground.rgb }}>
                    💡 All components are native iOS SwiftUI views bridged to React Native, providing true native performance and appearance.
                  </RNText>
                </View>
              </Card>
            </View>
          </View>
        </Host>
      </RN>
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
