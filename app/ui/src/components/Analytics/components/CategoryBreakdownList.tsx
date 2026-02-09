import React from 'react';
import { Box, Paper, Typography, Card, CardContent, Chip, useTheme } from '@mui/material';
import { CategoryExpense } from '../../../types/analytics';
import { formatAmount } from '../utils/currency';

interface CategoryBreakdownListProps {
  data: CategoryExpense[];
  currency?: string;
}

/**
 * CategoryBreakdownList Component
 * Displays detailed breakdown of expenses by category
 */
const CategoryBreakdownList: React.FC<CategoryBreakdownListProps> = ({ data, currency = 'INR' }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontSize: { xs: '1.1rem', md: '1.25rem' },
          fontWeight: 600,
        }}
      >
        Category Breakdown
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
        {data.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No category data available for the selected period.
          </Typography>
        ) : (
          data.map((item, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'background.paper',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s',
                },
              }}
            >
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
                    sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
                  >
                    {item.category}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.count} transaction{item.count !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                <Chip
                  label={formatAmount(item.total, currency)}
                  color="primary"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '0.85rem', md: '1rem' },
                    alignSelf: { xs: 'flex-start', sm: 'center' },
                    bgcolor: isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'primary.main',
                    color: isDarkMode ? 'rgba(102, 126, 234, 1)' : 'white',
                  }}
                />
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default CategoryBreakdownList;
