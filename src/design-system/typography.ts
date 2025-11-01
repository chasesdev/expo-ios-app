/**
 * Typography System
 * Font sizes, weights, and line heights matching the web app
 */

export interface TypographyToken {
  fontSize: number;
  lineHeight: number;
  fontWeight?: '400' | '500' | '600' | '700';
  letterSpacing?: number;
}

export const typography = {
  // Display
  display: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },

  // Headings
  h1: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  h4: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },

  // Body
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },

  // UI
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },

  // Code
  code: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    fontFamily: 'Courier' as const, // monospace
  },
  codeSmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as const,
    fontFamily: 'Courier' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
