/**
 * Spentiva - Modern Teal Color Palette
 * Smooth, premium design with proper dark mode support
 */

export const palette = {
  // Primary Colors - Modern Teal
  primary: {
    main: '#14B8A6', // Teal - Main brand color
    light: '#5EEAD4', // Light teal - Hover states
    lighter: '#99F6E4', // Very light teal
    lightest: '#CCFBF1', // Faintest teal
    dark: '#0D9488', // Dark teal
    darker: '#0F766E', // Darker teal
  },

  // Secondary/Accent Colors
  accent: {
    orange: '#FB923C', // Orange - CTAs
    orangeLight: '#FDBA74',
    orangeDark: '#F97316',
  },

  // Background Colors - Light Mode
  background: {
    default: '#FAFAFA', // Clean light gray
    paper: '#FFFFFF', // White cards
    subtle: '#F5F5F5', // Subtle sections
    hover: '#F9FAFB', // Hover state
  },

  // Text Colors - Light Mode
  text: {
    primary: '#1F2937', // Dark gray - Main text
    secondary: '#6B7280', // Medium gray
    muted: '#9CA3AF', // Light gray
    light: '#D1D5DB', // Very light
    white: '#FFFFFF',
  },

  // Border Colors - Light Mode
  border: {
    light: '#E5E7EB',
    default: '#D1D5DB',
    medium: '#9CA3AF',
  },

  // Status Colors
  status: {
    success: {
      main: '#10B981',
      light: '#34D399',
      bg: '#D1FAE5',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      bg: '#FEE2E2',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      bg: '#FEF3C7',
    },
    info: {
      main: '#14B8A6',
      light: '#5EEAD4',
      bg: '#CCFBF1',
    },
  },

  // Gradient Combinations
  gradients: {
    primary: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    accent: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
  },

  // Tracker Type Colors - Lighter & Softer
  trackerTypes: {
    business: {
      primary: '#60A5FA', // Soft blue
      light: '#93C5FD', // Lighter blue
      lighter: '#BFDBFE', // Very light blue
      dark: '#3B82F6', // Darker blue for contrast
      bg: 'rgba(96, 165, 250, 0.08)', // Very subtle background
      border: 'rgba(96, 165, 250, 0.2)', // Light border
      gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
    },
    personal: {
      primary: '#A78BFA', // Soft purple
      light: '#C4B5FD', // Lighter purple
      lighter: '#DDD6FE', // Very light purple
      dark: '#8B5CF6', // Darker purple for contrast
      bg: 'rgba(167, 139, 250, 0.08)', // Very subtle background
      border: 'rgba(167, 139, 250, 0.2)', // Light border
      gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
    },
  },

  // Shadow Colors (minimal use)
  shadows: {
    subtle: 'rgba(0, 0, 0, 0.03)',
  },
};

/**
 * Dark Mode Palette - Using reference colors
 */
export const darkPalette = {
  // Primary Colors - Brighter for dark mode
  primary: {
    main: '#14B8A6',
    light: '#5EEAD4',
    lighter: '#99F6E4',
    lightest: '#CCFBF1',
    dark: '#0D9488',
    darker: '#0F766E',
  },

  // Secondary/Accent Colors
  accent: {
    orange: '#FB923C',
    orangeLight: '#FDBA74',
    orangeDark: '#F97316',
  },

  // Background Colors - Dark Mode (from reference)
  background: {
    default: '#191B19', // Darkest background
    paper: '#272927', // Card backgrounds
    subtle: '#363A36', // Subtle sections
    hover: '#4B4F4B', // Hover state
  },

  // Text Colors - Dark Mode (high contrast)
  text: {
    primary: '#FFFFFF', // Pure white for main text
    secondary: '#C0C4C4', // Light gray for secondary text
    muted: '#8D8E8E', // Medium gray for muted text
    light: '#696969', // Darker gray for less important text
    white: '#FFFFFF',
  },

  // Border Colors - Dark Mode
  border: {
    light: '#363A36',
    default: '#4B4F4B',
    medium: '#696969',
  },

  // Status Colors - Dark Mode (brighter)
  status: {
    success: {
      main: '#10B981',
      light: '#34D399',
      bg: '#064E3B',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      bg: '#7F1D1D',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      bg: '#78350F',
    },
    info: {
      main: '#14B8A6',
      light: '#5EEAD4',
      bg: '#134E4A',
    },
  },

  // Gradient Combinations
  gradients: {
    primary: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    accent: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
  },

  // Tracker Type Colors - Dark Mode
  trackerTypes: {
    business: {
      primary: '#60A5FA', // Soft blue (same)
      light: '#93C5FD', // Lighter blue
      lighter: '#BFDBFE', // Very light blue
      dark: '#3B82F6', // Darker blue
      bg: 'rgba(96, 165, 250, 0.12)', // Slightly more visible in dark
      border: 'rgba(96, 165, 250, 0.25)', // Slightly stronger border
      gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
    },
    personal: {
      primary: '#A78BFA', // Soft purple (same)
      light: '#C4B5FD', // Lighter purple
      lighter: '#DDD6FE', // Very light purple
      dark: '#8B5CF6', // Darker purple
      bg: 'rgba(167, 139, 250, 0.12)', // Slightly more visible in dark
      border: 'rgba(167, 139, 250, 0.25)', // Slightly stronger border
      gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
    },
  },

  // Shadow Colors
  shadows: {
    subtle: 'rgba(0, 0, 0, 0.2)',
  },
};

/**
 * Material-UI Theme Configuration
 */
export const themeConfig = {
  palette: {
    mode: 'light' as const,
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
      dark: palette.primary.dark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: palette.accent.orange,
      light: palette.accent.orangeLight,
      dark: palette.accent.orangeDark,
      contrastText: '#FFFFFF',
    },
    background: {
      default: palette.background.default,
      paper: palette.background.paper,
    },
    text: {
      primary: palette.text.primary,
      secondary: palette.text.secondary,
      disabled: palette.text.muted,
    },
    divider: palette.border.light,
    error: {
      main: palette.status.error.main,
      light: palette.status.error.light,
      dark: '#DC2626',
      contrastText: '#FFFFFF',
    },
    success: {
      main: palette.status.success.main,
      light: palette.status.success.light,
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: palette.status.warning.main,
      light: palette.status.warning.light,
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    info: {
      main: palette.status.info.main,
      light: palette.status.info.light,
      dark: '#0D9488',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 4, // Max 4px as requested
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
          borderRadius: 4,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: 'none',
          border: '1px solid',
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 600,
          fontSize: '0.875em',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
};

/**
 * Get dark mode theme configuration
 */
export const getDarkModeConfig = () => ({
  palette: {
    mode: 'dark' as const,
    primary: {
      main: darkPalette.primary.main,
      light: darkPalette.primary.light,
      dark: darkPalette.primary.dark,
      contrastText: darkPalette.background.default,
    },
    secondary: {
      main: darkPalette.accent.orange,
      light: darkPalette.accent.orangeLight,
      dark: darkPalette.accent.orangeDark,
      contrastText: darkPalette.background.default,
    },
    background: {
      default: darkPalette.background.default,
      paper: darkPalette.background.paper,
    },
    text: {
      primary: darkPalette.text.primary,
      secondary: darkPalette.text.secondary,
      disabled: darkPalette.text.muted,
    },
    divider: darkPalette.border.light,
    error: {
      main: darkPalette.status.error.main,
      light: darkPalette.status.error.light,
      dark: '#B91C1C',
      contrastText: darkPalette.text.primary,
    },
    success: {
      main: darkPalette.status.success.main,
      light: darkPalette.status.success.light,
      dark: '#047857',
      contrastText: darkPalette.text.primary,
    },
    warning: {
      main: darkPalette.status.warning.main,
      light: darkPalette.status.warning.light,
      dark: '#B45309',
      contrastText: darkPalette.text.primary,
    },
    info: {
      main: darkPalette.status.info.main,
      light: darkPalette.status.info.light,
      dark: '#115E59',
      contrastText: darkPalette.text.primary,
    },
  },
});

export default palette;
