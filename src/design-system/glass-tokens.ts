/**
 * Glass Effect Tokens
 * Design tokens for iOS glassmorphism effects (frosted glass, blur, materials)
 */

export interface GlassBlurTokens {
  subtle: number;
  light: number;
  medium: number;
  heavy: number;
}

export interface GlassOpacityTokens {
  subtle: number;
  light: number;
  medium: number;
  heavy: number;
}

export type MaterialVariant = 'ultraThin' | 'thin' | 'regular' | 'thick' | 'ultraThick' | 'bar';

export interface GlassMaterialMappings {
  card: MaterialVariant;
  cardSubtle: MaterialVariant;
  button: MaterialVariant;
  modal: MaterialVariant;
  sheet: MaterialVariant;
  navigation: MaterialVariant;
  toolbar: MaterialVariant;
  listItem: MaterialVariant;
  input: MaterialVariant;
  popover: MaterialVariant;
  toast: MaterialVariant;
  overlay: MaterialVariant;
  chatMessage: MaterialVariant;
  chatMessageUser: MaterialVariant;
}

export interface GlassPerformanceSettings {
  maxBlurRadius: number;
  maxBlurRadiusModal: number;
  maxOverlappingLayers: number;
  lazyLoadDelay: number;
  animationDuration: number;
  springResponse: number;
  springDampingFraction: number;
}

export interface GlassTokens {
  blur: GlassBlurTokens;
  opacity: GlassOpacityTokens;
  materials: GlassMaterialMappings;
  performance: GlassPerformanceSettings;
}

/**
 * Glass effect design tokens
 */
export const glassTokens: GlassTokens = {
  // Blur radius values (in pixels)
  blur: {
    subtle: 10,   // Minimal blur for lightweight effects
    light: 15,    // Light blur for secondary surfaces
    medium: 20,   // Standard blur for most components
    heavy: 30,    // Heavy blur for modals and important overlays
  },

  // Background opacity values (0-1)
  opacity: {
    subtle: 0.05,  // ~5% opacity - very transparent
    light: 0.08,   // ~8% opacity - transparent
    medium: 0.12,  // ~12% opacity - translucent
    heavy: 0.18,   // ~18% opacity - semi-opaque
  },

  // Material type mappings for each component
  materials: {
    // Cards
    card: 'regular',           // Main content cards
    cardSubtle: 'ultraThin',   // Secondary/info cards

    // Interactive
    button: 'regular',         // Buttons and CTAs
    input: 'thin',             // Text inputs and form fields

    // Overlays
    modal: 'thick',            // Full-screen modals
    sheet: 'regular',          // Bottom sheets
    popover: 'thin',           // Floating popovers
    toast: 'regular',          // Notification toasts
    overlay: 'thick',          // Blur overlays behind modals

    // Navigation
    navigation: 'bar',         // Navigation bars (Apple-optimized)
    toolbar: 'bar',            // Toolbars and tab bars

    // Lists
    listItem: 'ultraThin',     // Repeated list items

    // AI Chat specific
    chatMessage: 'thin',       // Assistant messages
    chatMessageUser: 'regular', // User messages
  },

  // Performance settings and limits
  performance: {
    maxBlurRadius: 20,             // Max blur for scrolling content
    maxBlurRadiusModal: 30,        // Max blur for modals (non-scrolling)
    maxOverlappingLayers: 2,       // Don't stack more than 2 blurs
    lazyLoadDelay: 100,            // Delay glass rendering (ms)
    animationDuration: 300,        // Default animation duration (ms)
    springResponse: 0.3,           // Spring animation response
    springDampingFraction: 0.6,    // Spring damping (bounciness)
  },
};

/**
 * Get blur radius for a material variant
 */
export function getBlurForMaterial(material: MaterialVariant): number {
  switch (material) {
    case 'ultraThin':
      return glassTokens.blur.subtle;
    case 'thin':
      return glassTokens.blur.light;
    case 'regular':
      return glassTokens.blur.medium;
    case 'thick':
    case 'ultraThick':
      return glassTokens.blur.heavy;
    case 'bar':
      return glassTokens.blur.medium; // System handles bar material
    default:
      return glassTokens.blur.medium;
  }
}

/**
 * Get opacity for a material variant
 */
export function getOpacityForMaterial(material: MaterialVariant): number {
  switch (material) {
    case 'ultraThin':
      return glassTokens.opacity.subtle;
    case 'thin':
      return glassTokens.opacity.light;
    case 'regular':
      return glassTokens.opacity.medium;
    case 'thick':
    case 'ultraThick':
      return glassTokens.opacity.heavy;
    case 'bar':
      return glassTokens.opacity.medium;
    default:
      return glassTokens.opacity.medium;
  }
}

/**
 * Convert opacity (0-1) to hex alpha channel (00-FF)
 */
export function opacityToHex(opacity: number): string {
  return Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
}

/**
 * Get material for a specific component type
 */
export function getMaterialForComponent(
  component: keyof GlassMaterialMappings
): MaterialVariant {
  return glassTokens.materials[component];
}

/**
 * Material variant display names (for UI/debugging)
 */
export const materialVariantNames: Record<MaterialVariant, string> = {
  ultraThin: 'Ultra Thin',
  thin: 'Thin',
  regular: 'Regular',
  thick: 'Thick',
  ultraThick: 'Ultra Thick',
  bar: 'Bar (Navigation)',
};

/**
 * iOS version requirements for glass effects
 */
export const glassRequirements = {
  minimumIOSVersion: 15,       // Basic materials
  optimalIOSVersion: 16,       // Enhanced materials
  advancedIOSVersion: 26,      // GlassEffectContainer and .glassEffect()
};

/**
 * Check if device supports glass effects
 */
export function supportsGlassEffects(iosVersion: number): boolean {
  return iosVersion >= glassRequirements.minimumIOSVersion;
}

/**
 * Check if device supports advanced iOS 26+ glass effects
 */
export function supportsAdvancedGlass(iosVersion: number): boolean {
  return iosVersion >= glassRequirements.advancedIOSVersion;
}
