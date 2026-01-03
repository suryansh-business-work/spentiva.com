import React from 'react';
import { Box, CircularProgress, Backdrop } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  transparent?: boolean;
  size?: number;
}

/**
 * LoadingOverlay Component
 * Full-screen or inline loading spinner
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  transparent = false,
  size = 40,
}) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1,
        backgroundColor: transparent ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.5)',
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={size} />
    </Backdrop>
  );
};

interface InlineSpinnerProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
}

/**
 * InlineSpinner Component
 * Small inline spinner for buttons and inline loading
 */
export const InlineSpinner: React.FC<InlineSpinnerProps> = ({ size = 20, color = 'primary' }) => {
  return <CircularProgress size={size} color={color} />;
};

interface CenteredSpinnerProps {
  size?: number;
  minHeight?: string;
}

/**
 * CenteredSpinner Component
 * Centered spinner for page/section loading
 */
export const CenteredSpinner: React.FC<CenteredSpinnerProps> = ({
  size = 40,
  minHeight = '400px',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        width: '100%',
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingOverlay;
