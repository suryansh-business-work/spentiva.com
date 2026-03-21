/**
 * Centralized color tokens for the Spentiva mobile app.
 * Derived from the web app's palette.
 */

export const colors = {
  /** Primary teal palette */
  primary: {
    main: '#14B8A6',
    dark: '#0D9488',
    darker: '#0F766E',
    light: '#5EEAD4',
    lighter: '#CCFBF1',
    contrast: '#FFFFFF',
  },

  /** Accent orange palette */
  accent: {
    main: '#FB923C',
    dark: '#EA580C',
    light: '#FED7AA',
    contrast: '#FFFFFF',
  },

  /** Neutral grays */
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  /** Text colors */
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },

  /** Status colors */
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#14B8A6',
  },

  /** Tracker type colors */
  tracker: {
    business: '#60A5FA',
    businessLight: '#DBEAFE',
    personal: '#A78BFA',
    personalLight: '#EDE9FE',
  },

  /** Background colors */
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
  },

  /** Surface/border */
  border: {
    light: '#E2E8F0',
    main: '#CBD5E1',
    dark: '#94A3B8',
  },

  /** Dark mode overrides */
  dark: {
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      card: '#1E293B',
      elevated: '#334155',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      muted: '#64748B',
    },
    border: {
      light: '#334155',
      main: '#475569',
      dark: '#64748B',
    },
  },
} as const;

export type Colors = typeof colors;
