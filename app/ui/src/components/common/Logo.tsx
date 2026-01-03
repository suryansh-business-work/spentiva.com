import React from 'react';
import { Box } from '@mui/material';

interface LogoProps {
  width?: number;
  height?: number;
}

/**
 * Logo Component
 * Displays Spentiva logo from CDN
 */
const Logo: React.FC<LogoProps> = ({ width = 120, height = 40 }) => {
  return (
    <Box
      component="img"
      src="https://spentiva.com/logo.svg"
      alt="Spentiva"
      sx={{
        width: width,
        height: height,
        objectFit: 'contain',
      }}
    />
  );
};

export default Logo;
