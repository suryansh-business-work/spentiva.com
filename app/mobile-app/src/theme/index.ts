import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { palette } from './palette';

/**
 * Spentiva Theme Configuration
 * Using Material Design 3
 */
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.primary,
    primaryContainer: palette.primaryLight,
    secondary: palette.secondary,
    secondaryContainer: palette.secondaryLight,
    tertiary: palette.info,
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.surfaceVariant,
    error: palette.error,
    errorContainer: palette.errorLight,
    onPrimary: palette.onPrimary,
    onSecondary: palette.onSecondary,
    onBackground: palette.text.primary,
    onSurface: palette.text.primary,
    onError: palette.onError,
    outline: palette.border,
    outlineVariant: palette.divider,
  },
  roundness: 8,
};

export type AppTheme = typeof theme;
