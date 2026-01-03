import React from 'react';
import { Box, Skeleton, Fade, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material';

interface LoadingStateProps {
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ count = 4 }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Fade in={true} timeout={300 * (i + 1)} key={i}>
          <Card
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              {/* Header with icon and type */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 2 }} />
              </Box>

              {/* Tracker name */}
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />

              {/* Description */}
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />

              {/* Stats */}
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="70%" height={20} sx={{ mt: 0.5 }} />
              </Box>

              {/* Action button */}
              <Box sx={{ mt: 3 }}>
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
              </Box>
            </CardContent>
          </Card>
        </Fade>
      ))}
    </Box>
  );
};

export default LoadingState;
