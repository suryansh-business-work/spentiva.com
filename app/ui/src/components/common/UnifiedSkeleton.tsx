import React from 'react';
import { Box, Skeleton, Card, CardContent, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';

interface CardSkeletonProps {
  count?: number;
}

/**
 * CardSkeleton Component
 * Skeleton loader for card grids
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 4 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rounded" width={60} height={24} />
              </Box>
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
              <Box sx={{ mt: 3 }}>
                <Skeleton variant="rounded" width="100%" height={40} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * TableSkeleton Component
 * Skeleton loader for tables
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <Box>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'flex',
            gap: 2,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width={`${100 / columns}%`} height={20} />
          ))}
        </Box>
      ))}
    </Box>
  );
};

interface StatCardSkeletonProps {
  count?: number;
}

/**
 * StatCardSkeleton Component
 * Skeleton loader for statistic cards
 */
export const StatCardSkeleton: React.FC<StatCardSkeletonProps> = ({ count = 4 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={48} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardSkeleton;
