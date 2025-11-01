/**
 * Design Tokens for AI SDK UI
 * Extracted from the web app's Tailwind configuration
 *
 * Color space: OKLCH (Lightness, Chroma, Hue)
 * These tokens are converted to RGB for use in React Native/Swift UI
 */

export interface ColorToken {
  oklch: string;
  rgb: string;
  description: string;
}

export interface DesignTokens {
  colors: {
    light: Record<string, ColorToken>;
    dark: Record<string, ColorToken>;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    base: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
}

// Helper function to convert OKLCH to RGB (approximate)
// For production, use a proper color conversion library
function oklchToRgb(l: number, c: number, h: number, alpha: number = 1): string {
  // Simplified conversion - for production use a proper library like culori
  // This is a placeholder that converts to grayscale based on lightness
  const gray = Math.round(l * 255);
  if (c === 0) {
    return alpha < 1
      ? `rgba(${gray}, ${gray}, ${gray}, ${alpha})`
      : `rgb(${gray}, ${gray}, ${gray})`;
  }

  // For colors with chroma, this is a rough approximation
  // In production, use a proper OKLCH to RGB conversion library
  const hRad = (h * Math.PI) / 180;
  const r = Math.max(0, Math.min(255, Math.round((l + c * Math.cos(hRad)) * 255)));
  const g = Math.max(0, Math.min(255, Math.round((l + c * Math.cos(hRad + 2.09)) * 255)));
  const b = Math.max(0, Math.min(255, Math.round((l + c * Math.cos(hRad + 4.19)) * 255)));

  return alpha < 1
    ? `rgba(${r}, ${g}, ${b}, ${alpha})`
    : `rgb(${r}, ${g}, ${b})`;
}

export const tokens: DesignTokens = {
  colors: {
    light: {
      background: {
        oklch: 'oklch(1 0 0)',
        rgb: '#FFFFFF',
        description: 'Main background color'
      },
      foreground: {
        oklch: 'oklch(0.145 0 0)',
        rgb: '#252525',
        description: 'Main text color'
      },
      card: {
        oklch: 'oklch(1 0 0)',
        rgb: '#FFFFFF',
        description: 'Card background'
      },
      cardForeground: {
        oklch: 'oklch(0.145 0 0)',
        rgb: '#252525',
        description: 'Card text'
      },
      popover: {
        oklch: 'oklch(1 0 0)',
        rgb: '#FFFFFF',
        description: 'Popover background'
      },
      popoverForeground: {
        oklch: 'oklch(0.145 0 0)',
        rgb: '#252525',
        description: 'Popover text'
      },
      primary: {
        oklch: 'oklch(0.205 0 0)',
        rgb: '#343434',
        description: 'Primary brand color'
      },
      primaryForeground: {
        oklch: 'oklch(0.985 0 0)',
        rgb: '#FCFCFC',
        description: 'Text on primary'
      },
      secondary: {
        oklch: 'oklch(0.97 0 0)',
        rgb: '#F7F7F7',
        description: 'Secondary color'
      },
      secondaryForeground: {
        oklch: 'oklch(0.205 0 0)',
        rgb: '#343434',
        description: 'Text on secondary'
      },
      muted: {
        oklch: 'oklch(0.97 0 0)',
        rgb: '#F7F7F7',
        description: 'Muted background'
      },
      mutedForeground: {
        oklch: 'oklch(0.556 0 0)',
        rgb: '#8E8E8E',
        description: 'Muted text'
      },
      accent: {
        oklch: 'oklch(0.97 0 0)',
        rgb: '#F7F7F7',
        description: 'Accent color'
      },
      accentForeground: {
        oklch: 'oklch(0.205 0 0)',
        rgb: '#343434',
        description: 'Text on accent'
      },
      destructive: {
        oklch: 'oklch(0.577 0.245 27.325)',
        rgb: '#DC2626',
        description: 'Destructive/error color'
      },
      destructiveForeground: {
        oklch: 'oklch(0.985 0 0)',
        rgb: '#FCFCFC',
        description: 'Text on destructive'
      },
      border: {
        oklch: 'oklch(0.922 0 0)',
        rgb: '#EBEBEB',
        description: 'Border color'
      },
      input: {
        oklch: 'oklch(0.922 0 0)',
        rgb: '#EBEBEB',
        description: 'Input border'
      },
      ring: {
        oklch: 'oklch(0.708 0 0)',
        rgb: '#B5B5B5',
        description: 'Focus ring'
      },
      chart1: {
        oklch: 'oklch(0.646 0.222 41.116)',
        rgb: '#F59E0B',
        description: 'Chart color 1'
      },
      chart2: {
        oklch: 'oklch(0.6 0.118 184.704)',
        rgb: '#14B8A6',
        description: 'Chart color 2'
      },
      chart3: {
        oklch: 'oklch(0.398 0.07 227.392)',
        rgb: '#3B82F6',
        description: 'Chart color 3'
      },
      chart4: {
        oklch: 'oklch(0.828 0.189 84.429)',
        rgb: '#84CC16',
        description: 'Chart color 4'
      },
      chart5: {
        oklch: 'oklch(0.769 0.188 70.08)',
        rgb: '#EAB308',
        description: 'Chart color 5'
      },
    },
    dark: {
      background: {
        oklch: 'oklch(0.145 0 0)',
        rgb: '#252525',
        description: 'Main background color'
      },
      foreground: {
        oklch: 'oklch(0.985 0 0)',
        rgb: '#FCFCFC',
        description: 'Main text color'
      },
      card: {
        oklch: 'oklch(0.205 0 0)',
        rgb: '#343434',
        description: 'Card background'
      },
      cardForeground: {
        oklch: 'oklch(0.985 0 0)',
        rgb: '#FCFCFC',
        description: 'Card text'
      },
      popover: {
        oklch: 'oklch(0.205 0 0)',
        rgb: '#343434',
        description: 'Popover background'
      },
      popoverForeground: {
        oklch: 'oklch(0.985 0 0)',
        rgb: '#FCFCFC',
        description: 'Popover text'
      },
      primary: {
        oklch: 'oklch(0.922 0 0)',
        rgb: '#EBEBEB',
        description: 'Primary brand color'
      },
      primaryForeground: {
        oklch: 'oklch(0.205 0 0)',
        rgb: '#343434',
        description: 'Text on primary'
      },
      secondary: {
        oklch: 'oklch(0.269 0 0)',
        rgb: '#454545',
        description: 'Secondary color'
      },
      secondaryForeground: {
        oklch: 'oklch(0.985 0 0)',
        rgb: '#FCFCFC',
        description: 'Text on secondary'
      },
      muted: {
        oklch: 'oklch(0.269 0 0)',
        rgb: '#454545',
        description: 'Muted background'
      },
      mutedForeground: {
        oklch: 'oklch(0.708 0 0)',
        rgb: '#B5B5B5',
        description: 'Muted text'
      },
      accent: {
        oklch: 'oklch(0.269 0 0)',
        rgb: '#454545',
        description: 'Accent color'
      },
      accentForeground: {
        oklch: 'oklch(0.985 0 0)',
        rgb: '#FCFCFC',
        description: 'Text on accent'
      },
      destructive: {
        oklch: 'oklch(0.704 0.191 22.216)',
        rgb: '#EF4444',
        description: 'Destructive/error color'
      },
      destructiveForeground: {
        oklch: 'oklch(0.985 0 0)',
        rgb: '#FCFCFC',
        description: 'Text on destructive'
      },
      border: {
        oklch: 'oklch(1 0 0 / 10%)',
        rgb: 'rgba(255, 255, 255, 0.1)',
        description: 'Border color'
      },
      input: {
        oklch: 'oklch(1 0 0 / 15%)',
        rgb: 'rgba(255, 255, 255, 0.15)',
        description: 'Input border'
      },
      ring: {
        oklch: 'oklch(0.556 0 0)',
        rgb: '#8E8E8E',
        description: 'Focus ring'
      },
      chart1: {
        oklch: 'oklch(0.488 0.243 264.376)',
        rgb: '#8B5CF6',
        description: 'Chart color 1'
      },
      chart2: {
        oklch: 'oklch(0.696 0.17 162.48)',
        rgb: '#10B981',
        description: 'Chart color 2'
      },
      chart3: {
        oklch: 'oklch(0.769 0.188 70.08)',
        rgb: '#EAB308',
        description: 'Chart color 3'
      },
      chart4: {
        oklch: 'oklch(0.627 0.265 303.9)',
        rgb: '#EC4899',
        description: 'Chart color 4'
      },
      chart5: {
        oklch: 'oklch(0.645 0.246 16.439)',
        rgb: '#F97316',
        description: 'Chart color 5'
      },
    },
  },
  radius: {
    base: 10, // 0.625rem = 10px
    sm: 6,   // base - 4px
    md: 8,   // base - 2px
    lg: 10,  // base
    xl: 14,  // base + 4px
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
};

// Export individual color palettes for convenience
export const lightColors = tokens.colors.light;
export const darkColors = tokens.colors.dark;
export const radius = tokens.radius;
export const spacing = tokens.spacing;
