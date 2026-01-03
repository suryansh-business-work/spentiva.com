import React from 'react';
import { Box, Card, CardContent, Skeleton, Paper } from '@mui/material';

const DashboardSkeleton: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" height={50} />
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 3,
        }}
      >
        {[1, 2].map(i => (
          <Paper key={i} sx={{ p: 3 }}>
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="rectangular" height={300} sx={{ mt: 2, borderRadius: 1 }} />
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Skeleton variant="text" width="30%" height={30} />
        <Skeleton variant="rectangular" height={300} sx={{ mt: 2, borderRadius: 1 }} />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={30} sx={{ mb: 2 }} />
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
        ))}
      </Paper>
    </>
  );
};

export default DashboardSkeleton;
