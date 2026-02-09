import React from 'react';
import { Box, Card, CardContent, Typography, Chip, useTheme } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import SavingsIcon from '@mui/icons-material/Savings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { AnalyticsSummary } from '../../../types/analytics';

interface SummaryCardsProps {
  summary: AnalyticsSummary;
  currency?: string;
  loading?: boolean;
}

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return symbols[currency] || currency;
};

/**
 * SummaryCards Component
 * Displays income, expenses, net balance, averages, savings rate, and transaction count
 */
const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, currency = 'INR' }) => {
  const theme = useTheme();
  const sym = getCurrencySymbol(currency);

  const totalExpenses = summary.totalExpenses ?? 0;
  const totalIncome = summary.totalIncome ?? 0;
  const netBalance = summary.netBalance ?? totalIncome - totalExpenses;
  const txnCount = summary.transactionCount ?? 0;
  const avgExpense = summary.averageExpense ?? 0;
  const avgIncome = summary.averageIncome ?? 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const cards = [
    {
      title: 'Total Expenses',
      value: `${sym}${totalExpenses.toLocaleString('en-IN')}`,
      chip: `${summary.expenseCount ?? txnCount} expenses`,
      icon: <TrendingDownIcon sx={{ fontSize: 24, opacity: 0.8 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
    },
    {
      title: 'Total Income',
      value: `${sym}${totalIncome.toLocaleString('en-IN')}`,
      chip: `${summary.incomeCount ?? 0} entries`,
      icon: <TrendingUpIcon sx={{ fontSize: 24, opacity: 0.8 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    },
    {
      title: 'Net Balance',
      value: `${netBalance >= 0 ? '+' : '-'}${sym}${Math.abs(netBalance).toLocaleString('en-IN')}`,
      chip: `${txnCount} transactions`,
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 24, opacity: 0.8 }} />,
      gradient: netBalance >= 0
        ? `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`
        : `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
    },
    {
      title: 'Avg Expense',
      value: `${sym}${Math.round(avgExpense).toLocaleString('en-IN')}`,
      chip: `avg income ${sym}${Math.round(avgIncome).toLocaleString('en-IN')}`,
      icon: <BarChartIcon sx={{ fontSize: 24, opacity: 0.8 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      chip: savingsRate >= 0 ? 'saving' : 'overspending',
      icon: <SavingsIcon sx={{ fontSize: 24, opacity: 0.8 }} />,
      gradient: savingsRate >= 20
        ? 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)'
        : savingsRate >= 0
          ? 'linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%)'
          : 'linear-gradient(135deg, #e53935 0%, #c62828 100%)',
    },
    {
      title: 'Transactions',
      value: `${txnCount}`,
      chip: `${summary.expenseCount ?? 0} out / ${summary.incomeCount ?? 0} in`,
      icon: <ReceiptLongIcon sx={{ fontSize: 24, opacity: 0.8 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
        gap: { xs: 1.5, md: 2 },
        mb: 3,
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          sx={{
            background: card.gradient,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 1,
            border: 'none',
          }}
        >
          <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 1.5, md: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontSize: { xs: '0.7rem', md: '0.8rem' }, fontWeight: 500 }}>
                {card.title}
              </Typography>
              {card.icon}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', sm: '1.5rem', md: '2rem' } }}>
              {card.value}
            </Typography>
            <Chip
              label={card.chip}
              size="small"
              sx={{ height: 18, fontSize: '0.6rem', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SummaryCards;
