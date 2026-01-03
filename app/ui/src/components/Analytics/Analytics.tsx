import React, { useState, useEffect } from 'react';
import { Container, Paper, Box, Skeleton, Alert, useTheme } from '@mui/material';
import AnalyticsFilters from './components/AnalyticsFilters';
import SummaryCards from './components/SummaryCards';
import ExpensesByCategoryChart from './components/ExpensesByCategoryChart';
import MonthlyExpensesChart from './components/MonthlyExpensesChart';
import ExpensesByPaymentMethodChart from './components/ExpensesByPaymentMethodChart';
import CategoryBreakdownList from './components/CategoryBreakdownList';
import { useAnalyticsData } from './hooks/useAnalyticsData';

interface AnalyticsProps {
  trackerId?: string;
}

/**
 * Analytics Component
 * Main container for analytics dashboard with charts and summary
 */
const Analytics: React.FC<AnalyticsProps> = ({ trackerId }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [filter, setFilter] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { summary, categoryData, monthlyData, paymentMethodData, loading, error, refetch } =
    useAnalyticsData({ trackerId });

  // Refetch data when filters change
  useEffect(() => {
    refetch({
      filter: filter as any,
      customStart: customStartDate,
      customEnd: customEndDate,
      year: selectedYear,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, customStartDate, customEndDate, selectedYear]); // Don't include refetch in deps

  // Listen for expense updates from other components
  useEffect(() => {
    const handleExpenseUpdate = () => {
      refetch({
        filter: filter as any,
        customStart: customStartDate,
        customEnd: customEndDate,
        year: selectedYear,
      });
    };

    window.addEventListener('expenseUpdated', handleExpenseUpdate);
    return () => {
      window.removeEventListener('expenseUpdated', handleExpenseUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, customStartDate, customEndDate, selectedYear]); // Don't include refetch in deps

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
          backdropFilter: 'blur(10px)',
        }}
      >
        <AnalyticsFilters
          filter={filter}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onFilterChange={handleFilterChange}
          onCustomStartDateChange={setCustomStartDate}
          onCustomEndDateChange={setCustomEndDate}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <>
          {/* Summary Cards Skeleton */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 3,
            }}
          >
            {[1, 2, 3].map(i => (
              <Paper key={i} elevation={3} sx={{ p: 2 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" height={50} />
              </Paper>
            ))}
          </Box>

          {/* Charts Skeleton */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              mb: 3,
            }}
          >
            {[1, 2].map(i => (
              <Paper key={i} elevation={3} sx={{ p: 3 }}>
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
              </Paper>
            ))}
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Skeleton variant="text" width="30%" height={30} />
            <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Skeleton variant="text" width="30%" height={30} sx={{ mb: 2 }} />
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2 }} />
            ))}
          </Paper>
        </>
      ) : (
        <>
          <SummaryCards summary={summary} />
          <ExpensesByCategoryChart data={categoryData} />
          <ExpensesByPaymentMethodChart data={paymentMethodData} />
          <MonthlyExpensesChart
            data={monthlyData}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
          <CategoryBreakdownList data={categoryData} />
        </>
      )}
    </Container>
  );
};

export default Analytics;
