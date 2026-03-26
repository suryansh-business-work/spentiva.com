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
        component="img"
        src="/spentiva-logo.png"
        alt="Spentiva"
        sx={{
          width: iconSize,
          height: iconSize,
          objectFit: 'contain',
        }}
      />
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
          component="img"
          src="/spentiva-logo.png"
          alt="Spentiva"
          sx={{
            width: 36,
            height: 36,
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
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
          component="img"
          src="/spentiva-logo.png"
          alt="Spentiva"
          sx={{
            width: 36,
            height: 36,
            objectFit: 'contain',
          }}
        />
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
