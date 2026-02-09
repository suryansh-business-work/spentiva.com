import React from 'react';
import { Box, Card, CardContent, Typography, Chip, useTheme } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import SavingsIcon from '@mui/icons-material/Savings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface StatCardsProps {
  summary: {
    totalExpenses: number;
    totalIncome: number;
    netBalance: number;
    transactionCount: number;
    expenseCount: number;
    incomeCount: number;
    averageExpense: number;
    averageIncome: number;
    // Legacy fallback fields
    total?: number;
    average?: number;
    count?: number;
  };
}

const StatCards: React.FC<StatCardsProps> = ({ summary }) => {
  const theme = useTheme();

  // Support legacy summary shape with graceful fallback
  const totalExpenses = summary.totalExpenses ?? summary.total ?? 0;
  const totalIncome = summary.totalIncome ?? 0;
  const netBalance = summary.netBalance ?? totalIncome - totalExpenses;
  const txnCount = summary.transactionCount ?? summary.count ?? 0;
  const avgExpense = summary.averageExpense ?? summary.average ?? 0;
  const avgIncome = summary.averageIncome ?? 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const cards = [
    {
      title: 'Total Expenses',
      value: `₹${totalExpenses.toLocaleString('en-IN')}`,
      chip: `${summary.expenseCount ?? txnCount}`,
      chipLabel: 'expenses',
      icon: <TrendingDownIcon sx={{ fontSize: 28, opacity: 0.8 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
    },
    {
      title: 'Total Income',
      value: `₹${totalIncome.toLocaleString('en-IN')}`,
      chip: `${summary.incomeCount ?? 0}`,
      chipLabel: 'income entries',
      icon: <TrendingUpIcon sx={{ fontSize: 28, opacity: 0.8 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    },
    {
      title: 'Net Balance',
      value: `${netBalance >= 0 ? '+' : ''}₹${Math.abs(netBalance).toLocaleString('en-IN')}`,
      chip: `${txnCount}`,
      chipLabel: 'transactions',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 28, opacity: 0.8 }} />,
      gradient:
        netBalance >= 0
          ? `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`
          : `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
    },
    {
      title: 'Avg Expense',
      value: `₹${Math.round(avgExpense).toLocaleString('en-IN')}`,
      chip: `avg income ₹${Math.round(avgIncome).toLocaleString('en-IN')}`,
      chipLabel: '',
      icon: <BarChartIcon sx={{ fontSize: 28, opacity: 0.8 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      chip: savingsRate >= 0 ? 'saving' : 'overspending',
      chipLabel: '',
      icon: <SavingsIcon sx={{ fontSize: 28, opacity: 0.8 }} />,
      gradient:
        savingsRate >= 20
          ? `linear-gradient(135deg, #43a047 0%, #2e7d32 100%)`
          : savingsRate >= 0
            ? `linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)`
            : `linear-gradient(135deg, #e53935 0%, #c62828 100%)`,
    },
    {
      title: 'Transactions',
      value: `${txnCount}`,
      chip: `${summary.expenseCount ?? 0} out / ${summary.incomeCount ?? 0} in`,
      chipLabel: '',
      icon: <ReceiptLongIcon sx={{ fontSize: 28, opacity: 0.8 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
        gap: { xs: 1.5, md: 3 },
        mb: 3,
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          sx={{
            background: card.gradient,
            color: theme.palette.primary.contrastText,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 1,
            border: 'none',
          }}
        >
          <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 1.5, md: 2.5 } }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  opacity: 0.9,
                  mb: 0.5,
                  fontSize: { xs: '0.7rem', md: '0.85rem' },
                  fontWeight: 500,
                }}
              >
                {card.title}
              </Typography>
              {card.icon}
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem' },
              }}
            >
              {card.value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.9 }}>
              {card.chipLabel && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  {card.chipLabel}
                </Typography>
              )}
              <Chip
                label={card.chip}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StatCards;
