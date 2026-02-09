import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  useTheme,
  LinearProgress,
} from '@mui/material';

interface CategoryBreakdownProps {
  categoryData: any[];
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categoryData }) => {
  const theme = useTheme();

  const expenseCats = categoryData.filter(
    (item: { type?: string }) => !item.type || item.type === 'expense'
  );
  const incomeCats = categoryData.filter((item: { type?: string }) => item.type === 'income');

  const maxExpense = Math.max(...expenseCats.map((i: any) => i.total), 1);
  const maxIncome = Math.max(...incomeCats.map((i: any) => i.total), 1);

  const renderCategoryList = (items: any[], maxVal: number, isIncome: boolean) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {items.map((item: any, index: number) => (
        <Card key={index} variant="outlined" sx={{ borderColor: theme.palette.divider }}>
          <CardContent
            sx={{
              py: 1.5,
              px: 2,
              '&:last-child': { pb: 1.5 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {item.category}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.count} transactions
                </Typography>
              </Box>
              <Chip
                label={`₹${item.total.toLocaleString('en-IN')}`}
                size="small"
                color={isIncome ? 'success' : 'error'}
                sx={{ fontWeight: 700, fontSize: '0.8rem' }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={(item.total / maxVal) * 100}
              color={isIncome ? 'success' : 'error'}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </CardContent>
        </Card>
      ))}
      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No data
        </Typography>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
      }}
    >
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: theme.palette.error.main }}
        >
          Expense Breakdown
        </Typography>
        {renderCategoryList(expenseCats, maxExpense, false)}
      </Paper>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: theme.palette.success.main }}
        >
          Income Breakdown
        </Typography>
        {renderCategoryList(incomeCats, maxIncome, true)}
      </Paper>
    </Box>
  );
};

export default CategoryBreakdown;
