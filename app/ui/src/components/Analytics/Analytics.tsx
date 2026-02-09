import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Skeleton,
  Alert,
  useTheme,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import DownloadIcon from '@mui/icons-material/Download';
import AnalyticsFilters from './components/AnalyticsFilters';
import SummaryCards from './components/SummaryCards';
import ExpensesByCategoryChart from './components/ExpensesByCategoryChart';
import MonthlyExpensesChart from './components/MonthlyExpensesChart';
import ExpensesByPaymentMethodChart from './components/ExpensesByPaymentMethodChart';
import CategoryBreakdownList from './components/CategoryBreakdownList';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { endpoints } from '../../config/api';
import { postRequest } from '../../utils/http';

interface AnalyticsProps {
  trackerId?: string;
  currency?: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ trackerId, currency }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [filter, setFilter] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');

  const { summary, categoryData, monthlyData, paymentMethodData, loading, error, refetch } =
    useAnalyticsData({ trackerId });

  useEffect(() => {
    refetch({
      filter: filter as any,
      customStart: customStartDate,
      customEnd: customEndDate,
      year: selectedYear,
    });
  }, [filter, customStartDate, customEndDate, selectedYear]);

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
    return () => window.removeEventListener('expenseUpdated', handleExpenseUpdate);
  }, [filter, customStartDate, customEndDate, selectedYear]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const handleEmailReport = async () => {
    try {
      setEmailLoading(true);
      await postRequest(endpoints.analytics.emailReport, {
        filter,
        ...(customStartDate && { startDate: customStartDate }),
        ...(customEndDate && { endDate: customEndDate }),
        ...(trackerId && { trackerId }),
      });
      setSnackMsg('Report sent to your email!');
      setSettingsOpen(false);
    } catch (err) {
      setSnackMsg((err as Error).message || 'Failed to send report');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    try {
      const rows = [
        ['Spentiva Finance Report'],
        [`Period: ${filter}`],
        [],
        ['Metric', 'Value'],
        ['Total Expenses', summary.totalExpenses],
        ['Total Income', summary.totalIncome],
        ['Net Balance', summary.netBalance],
        ['Transaction Count', summary.transactionCount],
        ['Avg Expense', Math.round(summary.averageExpense)],
        ['Avg Income', Math.round(summary.averageIncome)],
      ];
      const blob = new Blob([rows.map(r => r.join(',')).join('\n')], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spentiva-report-${filter}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSnackMsg('Report downloaded!');
      setSettingsOpen(false);
    } catch {
      setSnackMsg('Failed to download report');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <AnalyticsFilters
              filter={filter}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onFilterChange={handleFilterChange}
              onCustomStartDateChange={setCustomStartDate}
              onCustomEndDateChange={setCustomEndDate}
            />
          </Box>
          <Tooltip title="Report & Settings" arrow>
            <IconButton
              onClick={() => setSettingsOpen(true)}
              size="small"
              sx={{
                mt: 0.25,
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                borderRadius: 1.5,
                width: 34,
                height: 34,
              }}
            >
              <SettingsIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map(i => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" height={50} />
              </Paper>
            </Grid>
          ))}
          {[1, 2].map(i => (
            <Grid key={`c${i}`} size={{ xs: 12, md: 6 }}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
              </Paper>
            </Grid>
          ))}
          <Grid size={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Skeleton variant="text" width="30%" height={30} />
              <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid size={12}>
            <SummaryCards summary={summary} currency={currency} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ExpensesByCategoryChart data={categoryData} currency={currency} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ExpensesByPaymentMethodChart data={paymentMethodData} currency={currency} />
          </Grid>
          <Grid size={12}>
            <MonthlyExpensesChart
              data={monthlyData}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              currency={currency}
            />
          </Grid>
          <Grid size={12}>
            <CategoryBreakdownList data={categoryData} currency={currency} />
          </Grid>
        </Grid>
      )}

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem', pb: 1 }}>
          Report & Settings
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Export or email your financial report for the current filter period.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={handleEmailReport}
              disabled={emailLoading}
              fullWidth
              sx={{ textTransform: 'none', justifyContent: 'flex-start', py: 1.25 }}
            >
              {emailLoading ? 'Sending...' : 'Email Report'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadCSV}
              fullWidth
              sx={{ textTransform: 'none', justifyContent: 'flex-start', py: 1.25 }}
            >
              Download CSV
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)} size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackMsg}
        autoHideDuration={3000}
        onClose={() => setSnackMsg('')}
        message={snackMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default Analytics;
