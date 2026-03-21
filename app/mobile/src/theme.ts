import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { colors } from '@/colors';

const fontConfig = {
  displayLarge: { fontFamily: 'Inter-Bold', fontSize: 57, lineHeight: 64 },
  displayMedium: { fontFamily: 'Inter-Bold', fontSize: 45, lineHeight: 52 },
  displaySmall: { fontFamily: 'Inter-Bold', fontSize: 36, lineHeight: 44 },
  headlineLarge: { fontFamily: 'Inter-SemiBold', fontSize: 32, lineHeight: 40 },
  headlineMedium: { fontFamily: 'Inter-SemiBold', fontSize: 28, lineHeight: 36 },
  headlineSmall: { fontFamily: 'Inter-SemiBold', fontSize: 24, lineHeight: 32 },
  titleLarge: { fontFamily: 'Inter-SemiBold', fontSize: 22, lineHeight: 28 },
  titleMedium: { fontFamily: 'Inter-Medium', fontSize: 16, lineHeight: 24 },
  titleSmall: { fontFamily: 'Inter-Medium', fontSize: 14, lineHeight: 20 },
  bodyLarge: { fontFamily: 'Inter-Regular', fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },
  bodySmall: { fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 16 },
  labelLarge: { fontFamily: 'Inter-Medium', fontSize: 14, lineHeight: 20 },
  labelMedium: { fontFamily: 'Inter-Medium', fontSize: 12, lineHeight: 16 },
  labelSmall: { fontFamily: 'Inter-Medium', fontSize: 11, lineHeight: 16 },
} as const;

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary.main,
    primaryContainer: colors.primary.lighter,
    secondary: colors.accent.main,
    secondaryContainer: colors.accent.light,
    background: colors.background.primary,
    surface: colors.background.card,
    surfaceVariant: colors.background.secondary,
    error: colors.status.error,
    onPrimary: colors.primary.contrast,
    onBackground: colors.text.primary,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
    outline: colors.border.main,
    outlineVariant: colors.border.light,
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary.main,
    primaryContainer: colors.primary.darker,
    secondary: colors.accent.main,
    secondaryContainer: colors.accent.dark,
    background: colors.dark.background.primary,
    surface: colors.dark.background.card,
    surfaceVariant: colors.dark.background.secondary,
    error: colors.status.error,
    onPrimary: colors.primary.contrast,
    onBackground: colors.dark.text.primary,
    onSurface: colors.dark.text.primary,
    onSurfaceVariant: colors.dark.text.secondary,
    outline: colors.dark.border.main,
    outlineVariant: colors.dark.border.light,
  },
  fonts: configureFonts({ config: fontConfig }),
};
