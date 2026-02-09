import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Paper, Box, Skeleton, Alert, useTheme, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Snackbar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ResponsiveGridLayout, useContainerWidth, Layout, Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import AnalyticsFilters from './components/AnalyticsFilters';
import SummaryCards from './components/SummaryCards';
import ExpensesByCategoryChart from './components/ExpensesByCategoryChart';
import MonthlyExpensesChart from './components/MonthlyExpensesChart';
import ExpensesByPaymentMethodChart from './components/ExpensesByPaymentMethodChart';
import CategoryBreakdownList from './components/CategoryBreakdownList';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { endpoints } from '../../config/api';
import { postRequest } from '../../utils/http';

const DEFAULT_LAYOUTS: Layouts = {
  lg: [
    { i: 'summary', x: 0, y: 0, w: 12, h: 4, minH: 3 },
    { i: 'categoryChart', x: 0, y: 4, w: 6, h: 6, minH: 4, minW: 4 },
    { i: 'paymentChart', x: 6, y: 4, w: 6, h: 6, minH: 4, minW: 4 },
    { i: 'monthlyChart', x: 0, y: 10, w: 12, h: 6, minH: 4 },
    { i: 'categoryList', x: 0, y: 16, w: 12, h: 6, minH: 3 },
  ],
  sm: [
    { i: 'summary', x: 0, y: 0, w: 6, h: 4, minH: 3 },
    { i: 'categoryChart', x: 0, y: 4, w: 6, h: 6, minH: 4 },
    { i: 'paymentChart', x: 0, y: 10, w: 6, h: 6, minH: 4 },
    { i: 'monthlyChart', x: 0, y: 16, w: 6, h: 6, minH: 4 },
    { i: 'categoryList', x: 0, y: 22, w: 6, h: 6, minH: 3 },
  ],
};

const LAYOUT_STORAGE_KEY = (trackerId?: string) =>
  trackerId ? `dashboard-layout-${trackerId}` : 'dashboard-layout-global';
// TODO: Persist layouts to DB via API for cross-device sync

interface AnalyticsProps {
  trackerId?: string;
  currency?: string;
}

/**
 * Analytics Component
 * Main container for analytics dashboard with charts and summary
 */
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
  const [gridLocked, setGridLocked] = useState(true);
  const [layouts, setLayouts] = useState<Layouts>(DEFAULT_LAYOUTS);
  const layoutInitRef = useRef(false);
  const { width: containerWidth, containerRef, mounted: containerMounted } = useContainerWidth();

  const { summary, categoryData, monthlyData, paymentMethodData, loading, error, refetch } =
    useAnalyticsData({ trackerId });

  // Load saved grid layout from localStorage
  useEffect(() => {
    if (layoutInitRef.current) return;
    layoutInitRef.current = true;
    try {
      const saved = localStorage.getItem(LAYOUT_STORAGE_KEY(trackerId));
      if (saved) {
        setLayouts(JSON.parse(saved));
      }
    } catch {
      // ignore bad data
    }
  }, [trackerId]);

  const handleLayoutChange = useCallback((_current: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY(trackerId), JSON.stringify(allLayouts));
    } catch {
      // quota exceeded
    }
  }, [trackerId]);

  const handleResetLayout = useCallback(() => {
    setLayouts(DEFAULT_LAYOUTS);
    localStorage.removeItem(LAYOUT_STORAGE_KEY(trackerId));
    setSnackMsg('Dashboard layout reset to default');
  }, [trackerId]);

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
    } catch (error) {
      setSnackMsg((error as Error).message || 'Failed to send report');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    try {
      const csvRows = [
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
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
          backdropFilter: 'blur(10px)',
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
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={gridLocked ? 'Unlock dashboard' : 'Lock dashboard'} arrow>
              <IconButton
                onClick={() => setGridLocked(prev => !prev)}
                size="small"
                sx={{
                  mt: 0.25,
                  bgcolor: gridLocked
                    ? isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                    : isDarkMode ? 'rgba(76,175,80,0.25)' : 'rgba(76,175,80,0.12)',
                  borderRadius: 1.5,
                  width: 34,
                  height: 34,
                }}
              >
                {gridLocked ? <LockIcon sx={{ fontSize: 16 }} /> : <LockOpenIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
            {!gridLocked && (
              <Tooltip title="Reset layout" arrow>
                <IconButton
                  onClick={handleResetLayout}
                  size="small"
                  sx={{
                    mt: 0.25,
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    borderRadius: 1.5,
                    width: 34,
                    height: 34,
                  }}
                >
                  <RestartAltIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
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
        </Box>
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
        <div ref={containerRef as React.Ref<HTMLDivElement>}>
          {containerMounted && (
            <ResponsiveGridLayout
              width={containerWidth}
              layouts={layouts}
              breakpoints={{ lg: 900, sm: 0 }}
              cols={{ lg: 12, sm: 6 }}
              rowHeight={60}
              isDraggable={!gridLocked}
              isResizable={!gridLocked}
              onLayoutChange={handleLayoutChange}
              draggableHandle=".grid-drag-handle"
              containerPadding={[0, 0]}
              margin={[16, 16]}
            >
              <div key="summary">
                <Box sx={{ height: '100%', overflow: 'auto' }}>
                  <SummaryCards summary={summary} currency={currency} />
                </Box>
              </div>
              <div key="categoryChart">
                <Box sx={{ height: '100%', overflow: 'auto' }}>
                  {!gridLocked && <Box className="grid-drag-handle" sx={{ cursor: 'grab', height: 8, borderRadius: 1, mx: 'auto', width: 48, bgcolor: 'divider', mb: 0.5 }} />}
                  <ExpensesByCategoryChart data={categoryData} />
                </Box>
              </div>
              <div key="paymentChart">
                <Box sx={{ height: '100%', overflow: 'auto' }}>
                  {!gridLocked && <Box className="grid-drag-handle" sx={{ cursor: 'grab', height: 8, borderRadius: 1, mx: 'auto', width: 48, bgcolor: 'divider', mb: 0.5 }} />}
                  <ExpensesByPaymentMethodChart data={paymentMethodData} />
                </Box>
              </div>
              <div key="monthlyChart">
                <Box sx={{ height: '100%', overflow: 'auto' }}>
                  {!gridLocked && <Box className="grid-drag-handle" sx={{ cursor: 'grab', height: 8, borderRadius: 1, mx: 'auto', width: 48, bgcolor: 'divider', mb: 0.5 }} />}
                  <MonthlyExpensesChart
                    data={monthlyData}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                  />
                </Box>
              </div>
              <div key="categoryList">
                <Box sx={{ height: '100%', overflow: 'auto' }}>
                  {!gridLocked && <Box className="grid-drag-handle" sx={{ cursor: 'grab', height: 8, borderRadius: 1, mx: 'auto', width: 48, bgcolor: 'divider', mb: 0.5 }} />}
                  <CategoryBreakdownList data={categoryData} />
                </Box>
              </div>
            </ResponsiveGridLayout>
          )}
        </div>
      )}

      {/* Settings / Report Dialog */}
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
          <Button onClick={() => setSettingsOpen(false)} size="small">Close</Button>
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
