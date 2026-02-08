import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { AnalyticsSummary } from '../../../types/analytics';

interface SummaryCardsProps {
  summary: AnalyticsSummary;
  loading?: boolean;
}

/**
 * SummaryCards Component
 * Displays Total Expenses, Average, and Count in gradient cards
 */
const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 3,
      }}
    >
      {/* Total Expenses Card */}
      <Card
        elevation={4}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 2, md: 2.5 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              opacity: 0.9,
              mb: 1,
              fontSize: { xs: '0.75rem', md: '0.85rem' },
              fontWeight: 500,
            }}
          >
            Total Expenses
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
            }}
          >
            ₹{summary.totalExpenses.toLocaleString('en-IN')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.9 }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              Track your spending
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Average Expense Card */}
      <Card
        elevation={4}
        sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '20%',
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'rotate(45deg)',
          },
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 2, md: 2.5 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              opacity: 0.9,
              mb: 1,
              fontSize: { xs: '0.75rem', md: '0.85rem' },
              fontWeight: 500,
            }}
          >
            Average Expense
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
            }}
          >
            ₹{Math.round(summary.averageExpense).toLocaleString('en-IN')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.9 }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              Per transaction
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Total Transactions Card */}
      <Card
        elevation={4}
        sx={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -40,
            left: -40,
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 2, md: 2.5 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              opacity: 0.9,
              mb: 1,
              fontSize: { xs: '0.75rem', md: '0.85rem' },
              fontWeight: 500,
            }}
          >
            Total Transactions
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
            }}
          >
            {summary.transactionCount}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.9 }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              Recorded expenses
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SummaryCards;
