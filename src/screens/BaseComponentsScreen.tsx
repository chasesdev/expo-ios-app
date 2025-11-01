import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text as RNText } from 'react-native';
import { Host, VStack, HStack, Button, Text, Switch, Slider, TextField, SecureField, Picker, DatePicker, ColorPicker, List, Section, Form, DisclosureGroup, LabeledContent, Progress, Divider, ContentUnavailableView, ShareLink, BottomSheet } from '@expo/ui/swift-ui';
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
  const [selectedFruit, setSelectedFruit] = useState('apple');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState('#007AFF');

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [disclosureExpanded, setDisclosureExpanded] = useState(false);

  // Advanced component states
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [progressValue, setProgressValue] = useState(0.65);

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
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>
                iOS 26 glass morphism with 6 material variants: ultraThin, thin, regular, thick, ultraThick, and bar
              </Text>

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
                value={glassEnabled}
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
                  <Button variant="default" onPress={() => console.log('Pressed')}>
                    Solid Button (Fallback)
                  </Button>
                )}
              </VStack>
            </VStack>

            {/* Standard Buttons */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Standard Buttons</RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>
                Native SwiftUI button variants
              </Text>
              <VStack spacing={12}>
                <HStack spacing={12}>
                  <Button variant="default" onPress={() => console.log('Default pressed')} style={{ flex: 1 }}>
                    Default
                  </Button>
                  <Button variant="bordered" onPress={() => console.log('Bordered pressed')} style={{ flex: 1 }}>
                    Bordered
                  </Button>
                </HStack>
                <HStack spacing={12}>
                  <Button variant="borderless" onPress={() => console.log('Borderless pressed')} style={{ flex: 1 }}>
                    Borderless
                  </Button>
                  <Button variant="plain" onPress={() => console.log('Plain pressed')} style={{ flex: 1 }}>
                    Plain
                  </Button>
                </HStack>
              </VStack>
            </VStack>

            {/* Switches & Toggles */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Switches & Toggles</RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>
                Interactive toggle controls with multiple variants
              </Text>
              <VStack spacing={12}>
                <Switch
                  value={switchValue}
                  onValueChange={setSwitchValue}
                  label="Toggle Switch"
                  variant="switch"
                />
                <Switch
                  value={switchValue}
                  onValueChange={setSwitchValue}
                  label="Checkbox"
                  variant="checkbox"
                />
              </VStack>
            </VStack>

            {/* Slider */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Slider</RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>
                Continuous value selection
              </Text>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
              />
              <Text style={{ fontSize: 14, opacity: 0.7 }}>
                Value: {sliderValue.toFixed(2)}
              </Text>
            </VStack>

            {/* Text Inputs */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Text Inputs</RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>
                Native text fields with various keyboard types and secure input
              </Text>
              <VStack spacing={12}>
                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Basic Text Field
                  </Text>
                  <TextField
                    value={textFieldValue}
                    onValueChange={setTextFieldValue}
                    placeholder="Enter text here..."
                  />
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Email Field
                  </Text>
                  <TextField
                    value={emailValue}
                    onValueChange={setEmailValue}
                    placeholder="your@email.com"
                    textContentType="emailAddress"
                    keyboardType="emailAddress"
                    autocapitalizationType="none"
                  />
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Secure Field (Password)
                  </Text>
                  <SecureField
                    value={passwordValue}
                    onValueChange={setPasswordValue}
                    placeholder="Enter password..."
                  />
                </VStack>
              </VStack>
            </VStack>

            {/* Selection Components */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Selection Components</RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>
                Pickers for values, dates, and colors
              </Text>
              <VStack spacing={12}>
                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Picker (Menu Style)
                  </Text>
                  <Picker
                    selection={selectedFruit}
                    onSelectionChange={setSelectedFruit}
                    label="Choose a fruit"
                  >
                    <Picker.Item value="apple" label="Apple 🍎" />
                    <Picker.Item value="banana" label="Banana 🍌" />
                    <Picker.Item value="orange" label="Orange 🍊" />
                    <Picker.Item value="grape" label="Grape 🍇" />
                    <Picker.Item value="watermelon" label="Watermelon 🍉" />
                  </Picker>
                  <Text style={{ fontSize: 12, opacity: 0.6 }}>
                    Selected: {selectedFruit}
                  </Text>
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Date Picker
                  </Text>
                  <DatePicker
                    selection={selectedDate}
                    onSelectionChange={setSelectedDate}
                    displayedComponents={['date', 'hourAndMinute']}
                  />
                  <Text style={{ fontSize: 12, opacity: 0.6 }}>
                    Selected: {selectedDate.toLocaleString()}
                  </Text>
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Color Picker
                  </Text>
                  <ColorPicker
                    selection={selectedColor}
                    onSelectionChange={setSelectedColor}
                  />
                  <HStack spacing={8} style={{ alignItems: 'center' }}>
                    <View style={{ width: 40, height: 40, backgroundColor: selectedColor, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border.rgb }} />
                    <Text style={{ fontSize: 12, opacity: 0.6 }}>
                      {selectedColor}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>

            {/* Lists & Forms */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Lists & Forms</RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>
                Structured data display with sections and form layouts
              </Text>
              <VStack spacing={12}>
                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    List with Sections
                  </Text>
                  <Card>
                    <List>
                      <Section header="Fruits">
                        <List.Row>
                          <Text>Apple 🍎</Text>
                        </List.Row>
                        <List.Row>
                          <Text>Banana 🍌</Text>
                        </List.Row>
                        <List.Row>
                          <Text>Orange 🍊</Text>
                        </List.Row>
                      </Section>
                      <Section header="Vegetables">
                        <List.Row>
                          <Text>Carrot 🥕</Text>
                        </List.Row>
                        <List.Row>
                          <Text>Broccoli 🥦</Text>
                        </List.Row>
                      </Section>
                    </List>
                  </Card>
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Form Example
                  </Text>
                  <Card>
                    <Form>
                      <Section header="Profile Information">
                        <LabeledContent label="Name">
                          <TextField
                            value={formName}
                            onValueChange={setFormName}
                            placeholder="Enter your name"
                          />
                        </LabeledContent>
                        <LabeledContent label="Email">
                          <TextField
                            value={formEmail}
                            onValueChange={setFormEmail}
                            placeholder="your@email.com"
                            keyboardType="emailAddress"
                          />
                        </LabeledContent>
                      </Section>
                    </Form>
                  </Card>
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Disclosure Group (Collapsible)
                  </Text>
                  <Card>
                    <DisclosureGroup
                      isExpanded={disclosureExpanded}
                      onToggle={() => setDisclosureExpanded(!disclosureExpanded)}
                      label="Advanced Settings"
                    >
                      <VStack spacing={8} style={{ padding: 12 }}>
                        <Text style={{ fontSize: 14 }}>
                          Hidden content that appears when expanded
                        </Text>
                        <Switch
                          value={switchValue}
                          onValueChange={setSwitchValue}
                          label="Enable feature"
                          variant="switch"
                        />
                      </VStack>
                    </DisclosureGroup>
                  </Card>
                </VStack>
              </VStack>
            </VStack>

            {/* Advanced Components */}
            <VStack spacing={16}>
              <RNText style={{ fontSize: 20, fontWeight: '600', lineHeight: 26, marginBottom: 8, color: theme.colors.foreground.rgb }}>Advanced Components</RNText>
              <Text style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>
                Progress indicators, sheets, sharing, and empty states
              </Text>
              <VStack spacing={12}>
                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Progress Indicator
                  </Text>
                  <Progress value={progressValue} />
                  <HStack spacing={8}>
                    <Button
                      variant="bordered"
                      onPress={() => setProgressValue(Math.max(0, progressValue - 0.1))}
                    >
                      -
                    </Button>
                    <Text style={{ fontSize: 14, opacity: 0.7, flex: 1, textAlign: 'center' }}>
                      {Math.round(progressValue * 100)}%
                    </Text>
                    <Button
                      variant="bordered"
                      onPress={() => setProgressValue(Math.min(1, progressValue + 0.1))}
                    >
                      +
                    </Button>
                  </HStack>
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Divider
                  </Text>
                  <Card>
                    <VStack spacing={0}>
                      <Text style={{ padding: 12 }}>First Item</Text>
                      <Divider />
                      <Text style={{ padding: 12 }}>Second Item</Text>
                      <Divider />
                      <Text style={{ padding: 12 }}>Third Item</Text>
                    </VStack>
                  </Card>
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Bottom Sheet
                  </Text>
                  <Button
                    variant="default"
                    onPress={() => setShowBottomSheet(true)}
                  >
                    Show Bottom Sheet
                  </Button>
                  {showBottomSheet && (
                    <BottomSheet
                      isPresented={showBottomSheet}
                      onDismiss={() => setShowBottomSheet(false)}
                    >
                      <VStack spacing={16} style={{ padding: 20 }}>
                        <Text style={{ fontSize: 24, fontWeight: '600' }}>
                          Bottom Sheet
                        </Text>
                        <Text style={{ fontSize: 16, opacity: 0.8 }}>
                          This is a modal bottom sheet. It slides up from the bottom of the screen.
                        </Text>
                        <Button
                          variant="default"
                          onPress={() => setShowBottomSheet(false)}
                        >
                          Close
                        </Button>
                      </VStack>
                    </BottomSheet>
                  )}
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Share Link
                  </Text>
                  <ShareLink
                    item={{ url: 'https://expo.dev' }}
                  >
                    <Button variant="bordered">
                      Share Expo Website
                    </Button>
                  </ShareLink>
                </VStack>

                <VStack spacing={4}>
                  <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.8 }}>
                    Content Unavailable View (Empty State)
                  </Text>
                  <Card>
                    <ContentUnavailableView
                      title="No Data"
                      description="There's nothing to show here yet."
                      systemImage="tray"
                    />
                  </Card>
                </VStack>
              </VStack>
            </VStack>

            {/* Additional Info */}
            <VStack spacing={12}>
              <Card>
                <VStack spacing={8}>
                  <RNText style={{ fontSize: 16, fontWeight: '600', color: theme.colors.foreground.rgb }}>
                    📦 Component Library
                  </RNText>
                  <RNText style={{ fontSize: 14, lineHeight: 20, color: theme.colors.mutedForeground.rgb }}>
                    This screen showcases 20+ base components from @expo/ui/swift-ui. The library includes 49+ native SwiftUI components total, including Charts, Gauges, Shapes, and more advanced features.
                  </RNText>
                  <Divider />
                  <RNText style={{ fontSize: 14, lineHeight: 20, color: theme.colors.mutedForeground.rgb }}>
                    💡 All components are native iOS SwiftUI views bridged to React Native, providing true native performance and appearance.
                  </RNText>
                </VStack>
              </Card>
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
