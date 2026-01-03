import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface LogoProps {
  width?: number;
  height?: number;
  variant?: 'full' | 'icon' | 'horizontal';
  showSubtitle?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  width,
  height,
  variant = 'horizontal',
  showSubtitle = true,
}) => {
  const theme = useTheme();

  // Icon only variant
  if (variant === 'icon') {
    const iconSize = width || 36;
    return (
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: 2,
          background: '#14B8A6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: `${iconSize * 0.6}px` }}>
          S
        </Typography>
      </Box>
    );
  }

  // Horizontal variant (default) - used in header
  if (variant === 'horizontal') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: width || 'auto',
          height: height || 'auto',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: '#14B8A6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.3rem' }}>S</Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '1.2rem',
              color: theme.palette.text.primary,
              lineHeight: 1,
              transition: 'color 0.3s ease',
            }}
          >
            Spentiva
          </Typography>
          {showSubtitle && (
            <Typography
              sx={{
                fontSize: '0.65rem',
                color: theme.palette.text.secondary,
                letterSpacing: '0.08em',
                fontWeight: 500,
                transition: 'color 0.3s ease',
                textAlign: 'left',
                marginTop: '1px',
                marginLeft: '2px',
              }}
            >
              By Exyconn
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  // Full variant - stacked, for auth pages
  return (
    <Box sx={{ mb: showSubtitle ? 5 : 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.3rem' }}>S</Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              color: theme.palette.text.primary,
              lineHeight: 1,
              transition: 'color 0.3s ease',
            }}
          >
            Spentiva
          </Typography>
          {showSubtitle && (
            <Typography
              sx={{
                fontSize: '0.65rem',
                color: theme.palette.text.secondary,
                letterSpacing: '0.08em',
                fontWeight: 500,
                transition: 'color 0.3s ease',
              }}
            >
              BY EXYCONN
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Logo;
