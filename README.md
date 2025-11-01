# AI SDK UI - iOS App

Native iOS application for AI SDK UI components built with React Native, Expo, and Swift UI.

## Overview

This is the iOS companion to the AI SDK UI web library, providing native Swift UI components for building AI-powered applications on iOS.

- **79 Total Components** (49 Base UI + 30 AI SDK)
- **Native Swift UI** via @expo/ui integration
- **Full Design System** with light/dark mode support
- **iOS 16+** minimum deployment target

## Project Structure

```
ios-app/
├── src/
│   ├── components/
│   │   ├── ui/              # Base UI component wrappers
│   │   └── ai-sdk/          # AI SDK component wrappers
│   ├── design-system/
│   │   ├── tokens.ts        # Design tokens (colors, spacing, radius)
│   │   ├── typography.ts    # Typography system
│   │   ├── icons.ts         # Lucide → SF Symbols mapping
│   │   └── index.ts         # Design system exports
│   ├── hooks/
│   │   └── useTheme.ts      # Theme hook for light/dark mode
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── DesignSystemScreen.tsx
│   │   ├── BaseComponentsScreen.tsx
│   │   └── AIComponentsScreen.tsx
│   └── types/
├── modules/
│   └── expo-ai-sdk/         # Custom Expo module
│       └── ios/
│           └── DesignSystem/
│               ├── Colors.swift      # Swift UI color extensions
│               └── Typography.swift  # Swift UI typography system
├── App.tsx
└── package.json
```

## Glass Effects ✨

### Overview

The app now features iOS-native glassmorphism effects using SwiftUI materials and @expo/ui integration:

- **Frosted Glass Cards** with 4 material variants (ultraThin, thin, regular, thick)
- **Interactive Glass Buttons** with press animations and haptic feedback
- **Glass Modals & Overlays** with blur backgrounds
- **Glass Navigation Bars** using Apple's optimized .bar material
- **Accessibility-First** with automatic solid color fallbacks

### Quick Start

```tsx
import { GlassCard, GlassButton } from './src/components/ui/glass';
import { Text } from '@expo/ui/swift-ui';

// Glass Card
<GlassCard variant="regular">
  <Text>Beautiful frosted glass effect!</Text>
</GlassCard>

// Glass Button
<GlassButton
  title="Submit"
  style="primary"
  onPress={() => console.log('Pressed!')}
/>

// Smart Glass (auto accessibility)
import { useSmartGlass } from './src/hooks/useGlassOptimization';

function MyComponent() {
  const { shouldUseGlass } = useSmartGlass();

  return (
    <Card variant={shouldUseGlass ? 'glass' : 'solid'}>
      <Text>Adapts automatically!</Text>
    </Card>
  );
}
```

### Material Variants

- **ultraThin** - 10px blur, 5% opacity - Lightweight, subtle
- **thin** - 15px blur, 8% opacity - Light depth
- **regular** - 20px blur, 12% opacity - Standard (recommended)
- **thick** - 30px blur, 18% opacity - Strong separation (modals)

### Accessibility

Glass effects automatically respect iOS accessibility settings:

- ✅ "Reduce Transparency" detection
- ✅ Solid color fallbacks
- ✅ Device capability checks (iOS 15+)
- ✅ Performance monitoring with auto-quality reduction
- ✅ WCAG AA contrast compliance

### Performance

- Max 20px blur for scrolling content
- Max 2 overlapping blur layers
- Lazy load delay (100ms)
- Spring animations (0.3s response, 0.6 damping)
- Target: 60 FPS on iPhone 12+

See `GLASS_EFFECTS_PROGRESS.md` for detailed implementation notes.

---

## Design System

### Colors

The design system includes a complete color palette that automatically adapts to light/dark mode:

- **Semantic Colors**: background, foreground, primary, secondary, muted, accent
- **UI Colors**: border, input, ring
- **Status Colors**: destructive
- **Chart Colors**: 5 distinct colors for data visualization

#### Usage in TypeScript/React Native

```typescript
import { useTheme } from './src/design-system';

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background.rgb }}>
      <Text style={{ color: theme.colors.foreground.rgb }}>
        Hello World
      </Text>
    </View>
  );
}
```

#### Usage in Swift UI

```swift
import SwiftUI

struct MyView: View {
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        VStack {
            Text("Hello World")
                .foreground(Color.foreground(colorScheme))
        }
        .background(Color.background(colorScheme))
    }
}
```

### Typography

Typography system with 9 variants:
- Display, H1-H4 for headings
- Body, Body Small for content
- Label, Caption, Overline for UI elements
- Code for monospace text

### Spacing & Radius

- **Spacing**: xs (4), sm (8), md (16), lg (24), xl (32), 2xl (48)
- **Radius**: sm (6), md (8), lg (10), xl (14)

### Icons

Icon mapping from Lucide Icons (web) to SF Symbols (iOS):
- 100+ common icons mapped
- Organized by category (actions, navigation, communication, etc.)

## Getting Started

### Prerequisites

- Node.js 18+
- Xcode 15+ (for iOS development)
- iOS Simulator or physical iOS device
- CocoaPods

### Installation

```bash
# Install dependencies
npm install

# Generate iOS native project (for development builds)
npx expo prebuild --platform ios

# Start development server
npm start

# Run on iOS
npm run ios
```

### Development Build

This app requires a development build (not compatible with Expo Go) because it uses @expo/ui:

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Create development build
eas build --profile development --platform ios

# Or run locally
npx expo run:ios
```

## Current Status (Phase 1 + Phase 2A+2B Complete)

### ✅ Phase 1 - Foundation (COMPLETE)

- [x] Expo project initialization with development build support
- [x] @expo/ui package installed and configured
- [x] TypeScript configuration for Swift UI bridge
- [x] iOS settings configured (min iOS 16+)
- [x] Swift UI Color extensions from design tokens
- [x] Light/dark mode with @Environment colorScheme
- [x] Tailwind radius values ported to Swift UI
- [x] SF Symbols icon mapping (100+ icons)
- [x] Typography system (TypeScript + Swift)
- [x] Showcase app structure with navigation

### ✅ Phase 2A - Glass Effects Foundation (COMPLETE)

- [x] Glass design tokens (blur, opacity, materials, performance)
- [x] 6 SwiftUI glass components (Card, Button, Modal, Sheet, NavigationBar, Toast)
- [x] 2 React Native glass wrappers (GlassCard, GlassButton)
- [x] Accessibility hooks (useGlassOptimization, usePerformanceMonitor, useSmartGlass)
- [x] Full TypeScript + Swift UI integration

### ✅ Phase 2B - Base UI Integration (COMPLETE)

- [x] Card component with glass variant support
- [x] Glass examples in BaseComponentsScreen
- [x] Glass section in DesignSystemScreen
- [x] Material variant showcase
- [x] Accessibility fallbacks

### 🚧 In Progress (Phase 3)

- [ ] AI SDK components with glass (0/30)
- [ ] ChatMessage glass component
- [ ] PromptInput glass component
- [ ] Glass navigation integration

### 📋 Upcoming (Phase 4+)

- [ ] Canvas glass toolbar
- [ ] Plan component with glass
- [ ] iOS 26+ advanced glass effects
- [ ] Performance optimization
- [ ] Complete documentation

## Available Components

### @expo/ui/swift-ui Components

Base components from @expo/ui:

- Button
- Switch (switch & checkbox variants)
- Slider
- TextField
- Text & VStack/HStack (layout)
- Host (Swift UI container)

### Custom Glass Components

**SwiftUI** (`modules/expo-ai-sdk/ios/Components/`):
- ✅ GlassCard.swift - Frosted glass card (4 variants)
- ✅ GlassButton.swift - Interactive glass button (4 styles)
- ✅ GlassModal.swift - Full-screen modal with blur
- ✅ GlassSheet.swift - Bottom sheet with drag-to-dismiss
- ✅ GlassNavigationBar.swift - Glass navigation bar
- ✅ GlassToast.swift - Toast notifications with glass

**React Native** (`src/components/ui/glass/`):
- ✅ GlassCard.tsx - Card wrapper with modifiers
- ✅ GlassButton.tsx - Button wrapper with animations
- ✅ Card.tsx - Base card with glass variant support

### Hooks

- ✅ `useTheme()` - Access design tokens
- ✅ `useGlassOptimization()` - Accessibility detection
- ✅ `usePerformanceMonitor()` - FPS tracking
- ✅ `useSmartGlass()` - Combined optimization

More components coming as we progress through the development plan.

## Development Plan

This project follows a **3-6 month development plan**:

1. **Phase 1 - Foundation** (Weeks 1-2) ✅ **COMPLETE**
2. **Phase 2 - Base UI Components** (Weeks 3-6)
3. **Phase 3 - AI SDK Core** (Weeks 7-12)
4. **Phase 4 - Advanced AI Components** (Weeks 13-16)
5. **Phase 5 - Advanced Features** (Weeks 17-20)
6. **Phase 6 - Graph & Workflow** (Weeks 21-24)
7. **Phase 7 - Polish & Testing** (Weeks 25-28)

See the full development plan in the main project README.

## Testing

```bash
# Run type checking
npm run tsc

# Run linter
npm run lint
```

## Building for Production

```bash
# Create production build
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

## Links

- **Web App**: https://ui-component-library-ai-sdk.vercel.app/
- **Showcase**: https://ui-component-library-ai-sdk.vercel.app/showcase/mobile
- **Storybook**: https://ui-component-library-ai-sdk.vercel.app/storybook
- **GitHub**: https://github.com/yourusername/ui

## Tech Stack

- **React Native** 0.81.5
- **Expo SDK** ~54
- **@expo/ui** (beta)
- **Swift UI** (via Expo modules)
- **TypeScript** 5
- **React Navigation** 6

## License

MIT

---

**Note**: This app is designed exclusively for iOS using Swift UI. It will not run on Android or web platforms.
