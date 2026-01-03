import React from 'react';
import { Box, Paper, Typography, Card, CardContent, Chip, useTheme } from '@mui/material';

interface CategoryBreakdownProps {
  categoryData: any[];
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categoryData }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: theme.palette.text.primary }}
      >
        Category Breakdown
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
        {categoryData.map((item: any, index) => (
          <Card key={index} variant="outlined" sx={{ borderColor: theme.palette.divider }}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1, sm: 0 },
                py: { xs: 1.5, md: 1.5 },
                px: { xs: 2, md: 2 },
                '&:last-child': { pb: { xs: 1.5, md: 1.5 } },
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    color: theme.palette.text.primary,
                  }}
                >
                  {item.category}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {item.count} transactions
                </Typography>
              </Box>
              <Chip
                label={`₹${item.total.toLocaleString('en-IN')}`}
                color="primary"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  alignSelf: { xs: 'flex-start', sm: 'center' },
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Paper>
  );
};

export default CategoryBreakdown;
