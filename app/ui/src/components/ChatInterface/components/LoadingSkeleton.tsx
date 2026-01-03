import React from 'react';
import { Box, Avatar, Paper, Skeleton } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

/**
 * LoadingSkeleton Component
 * Displays a loading state while waiting for AI response
 */
const LoadingSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, gap: 1.5 }}>
      {/* Avatar */}
      <Avatar
        sx={{
          width: 40,
          height: 40,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <SmartToyIcon />
      </Avatar>

      {/* Loading Content */}
      <Paper elevation={2} sx={{ p: 2, minWidth: '200px', borderRadius: 2 }}>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="rectangular" height={60} sx={{ mt: 1 }} />
      </Paper>
    </Box>
  );
};

export default LoadingSkeleton;
