// Theme configuration for the application
import { type ClassValue, clsx } from 'clsx'

// Color palette
export const COLORS = {
  // Primary colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Danger colors
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Medical specialty colors
  medical: {
    cardiology: '#dc2626',
    pediatrics: '#16a34a',
    surgery: '#9333ea',
    orthopedics: '#ea580c',
    obstetrics: '#ec4899',
    emergency: '#f59e0b',
    radiology: '#06b6d4',
    laboratory: '#0891b2',
    pharmacy: '#059669',
  },
}

// Typography scale
export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
}

// Spacing scale
export const SPACING = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
}

// Border radius scale
export const BORDER_RADIUS = {
  none: '0px',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
}

// Shadow scale
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}

// Animation durations
export const ANIMATION = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
}

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Z-index scale
export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}

// Theme variants
export const THEME_VARIANTS = {
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
    },
  },
  dark: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
    },
  },
}

// Component-specific theme configurations
export const COMPONENT_THEMES = {
  card: {
    borderRadius: BORDER_RADIUS.xl,
    shadow: SHADOWS.md,
    padding: SPACING[6],
  },
  button: {
    borderRadius: BORDER_RADIUS.lg,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  input: {
    borderRadius: BORDER_RADIUS.lg,
    borderColor: COLORS.secondary[300],
    focusBorderColor: COLORS.primary[500],
  },
  modal: {
    overlayBackground: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS['2xl'],
    maxWidth: '500px',
  },
}

// Utility functions
export const getColor = (color: string, shade: keyof typeof COLORS.primary = 500): string => {
  const colorGroup = COLORS[color as keyof typeof COLORS]
  return colorGroup ? colorGroup[shade] : COLORS.primary[shade]
}

export const getThemeValue = (theme: 'light' | 'dark', type: 'background' | 'text' | 'border', level: 'primary' | 'secondary' | 'tertiary'): string => {
  return THEME_VARIANTS[theme][type][level]
}

// CSS class generator
export const cx = (...inputs: ClassValue[]) => {
  return clsx(inputs)
}

// Export theme configuration
export default {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animation: ANIMATION,
  breakpoints: BREAKPOINTS,
  zIndex: Z_INDEX,
  themes: THEME_VARIANTS,
  components: COMPONENT_THEMES,
}