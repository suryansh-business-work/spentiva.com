/**
 * Color Palette for Spentiva Mobile App
 * Material Design 3 Color System
 */

export const palette = {
  // Primary Colors - Spentiva Green
  primary: '#2E7D32',
  primaryLight: '#60AD5E',
  primaryDark: '#005005',
  onPrimary: '#FFFFFF',

  // Secondary Colors
  secondary: '#66BB6A',
  secondaryLight: '#98EE99',
  secondaryDark: '#338A3E',
  onSecondary: '#FFFFFF',

  // Background & Surface
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceVariant: '#E0E0E0',

  // Error
  error: '#D32F2F',
  errorLight: '#FF6659',
  errorDark: '#9A0007',
  onError: '#FFFFFF',

  // Text
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
    hint: '#BDBDBD',
  },

  // Borders & Dividers
  border: '#E0E0E0',
  divider: '#EEEEEE',

  // Additional UI Colors
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',

  // Input States
  inputBorder: '#E0E0E0',
  inputBorderFocused: '#2E7D32',
  inputBorderError: '#D32F2F',
  inputBackground: '#FFFFFF',
  inputPlaceholder: '#9E9E9E',
};

export type Palette = typeof palette;
