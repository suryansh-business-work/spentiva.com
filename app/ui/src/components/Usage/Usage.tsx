import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import { Refresh as RefreshIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';

// Hooks
import { useUsageOverview } from './hooks/useUsageOverview';
import { useUsageGraphs } from './hooks/useUsageGraphs';
import { useTrackerUsage } from './hooks/useTrackerUsage';
import { useUsageLogs } from './hooks/useUsageLogs';

// Components
import UsageOverviewCards, { UsageOverviewCardsSkeleton } from './components/UsageOverviewCards';
import TrackerSelector from './components/TrackerSelector';
import UsageGraphsPanel from './components/UsageGraphsPanel';
import TrackerStatsPanel from './components/TrackerStatsPanel';
import UsageLogsTable from './components/UsageLogsTable';

const Usage: React.FC = () => {
  const theme = useTheme();
  // State
  const [selectedTrackerId, setSelectedTrackerId] = useState<string>('');
  const [logPage, setLogPage] = useState(0);
  const [logRowsPerPage, setLogRowsPerPage] = useState(50);

  // Hooks
  const {
    data: overviewData,
    loading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useUsageOverview();

  const { data: graphsData, loading: graphsLoading, refetch: refetchGraphs } = useUsageGraphs();

  const {
    stats: trackerStats,
    graphs: trackerGraphs,
    loading: trackerLoading,
    error: trackerError,
    refetch: refetchTracker,
  } = useTrackerUsage(selectedTrackerId || null);

  const {
    logs,
    totalCount,
    loading: logsLoading,
    error: logsError,
    fetchLogs,
    deleteTrackerLogs,
    deleteAllUserLogs,
    deletingTracker,
    deletingAll,
  } = useUsageLogs({
    limit: logRowsPerPage,
    offset: logPage * logRowsPerPage,
    autoFetch: false,
  });

  // Effects
  useEffect(() => {
    if (selectedTrackerId) {
      fetchLogs({
        trackerId: selectedTrackerId,
        limit: logRowsPerPage,
        offset: logPage * logRowsPerPage,
      });
    }
  }, [selectedTrackerId, logPage, logRowsPerPage, fetchLogs]);

  // Handlers
  const handleRefresh = () => {
    refetchOverview();
    refetchGraphs();
    if (selectedTrackerId) {
      refetchTracker();
      fetchLogs();
    }
  };

  const handleTrackerChange = (trackerId: string) => {
    setSelectedTrackerId(trackerId);
    setLogPage(0);
  };

  const handleDeleteTrackerLogs = async () => {
    if (!selectedTrackerId) return;
    if (
      window.confirm(
        'Are you sure you want to delete all logs for this tracker? This action cannot be undone.'
      )
    ) {
      const result = await deleteTrackerLogs(selectedTrackerId);
      if (result.success) {
        fetchLogs();
        refetchTracker();
        refetchOverview();
        refetchGraphs();
      }
      alert(result.message);
    }
  };

  const handleDeleteAllLogs = async () => {
    if (
      window.confirm(
        'WARNING: Are you sure you want to delete ALL usage logs? This will wipe your entire history and cannot be undone.'
      )
    ) {
      const result = await deleteAllUserLogs();
      if (result.success) {
        fetchLogs();
        if (selectedTrackerId) refetchTracker();
        refetchOverview();
        refetchGraphs();
      }
      alert(result.message);
    }
  };

  if (overviewLoading && !overviewData) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          mt: 3,
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
          minHeight: '400px',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          Usage Statistics
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete ALL usage logs (irreversible)">
            <span>
              <Button
                variant="outlined"
                color="error"
                startIcon={deletingAll ? <CircularProgress size={16} /> : <DeleteForeverIcon />}
                onClick={handleDeleteAllLogs}
                disabled={deletingAll}
                size="small"
              >
                Delete All Logs
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {overviewError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {overviewError}
        </Alert>
      )}

      {/* Overall Stats */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}>
          Overall Usage
        </Typography>
        {overviewLoading ? (
          <UsageOverviewCardsSkeleton />
        ) : overviewData ? (
          <UsageOverviewCards data={overviewData} />
        ) : (
          <Alert severity="info">No usage data available.</Alert>
        )}
      </Box>

      {/* Global Graphs */}
      <Box sx={{ mb: 5 }}>
        <UsageGraphsPanel data={graphsData} loading={graphsLoading} />
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Tracker Details Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: theme.palette.text.primary }}>
          Tracker Details
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TrackerSelector
            trackers={
              overviewData?.byTracker.map(t => ({
                _id: t.trackerId,
                name: t.trackerName,
                type: t.trackerType,
              })) || []
            }
            selectedTrackerId={selectedTrackerId}
            onChange={handleTrackerChange}
          />
        </Box>

        {selectedTrackerId && (
          <Box>
            {/* Tracker Stats */}
            <Box sx={{ mb: 4 }}>
              <TrackerStatsPanel
                data={trackerStats}
                loading={trackerLoading}
                error={trackerError}
              />
            </Box>

            {/* Tracker Graphs */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
              >
                Tracker Usage Graphs
              </Typography>
              <UsageGraphsPanel
                data={trackerGraphs}
                loading={trackerLoading}
                pieChartTitle="Message Distribution (User vs AI)"
              />
            </Box>

            {/* Logs Table */}
            <Box>
              <UsageLogsTable
                logs={logs}
                totalCount={totalCount}
                loading={logsLoading}
                error={logsError}
                page={logPage}
                rowsPerPage={logRowsPerPage}
                onPageChange={setLogPage}
                onRowsPerPageChange={setLogRowsPerPage}
                onRefresh={() => fetchLogs()}
                selectedTrackerId={selectedTrackerId}
                onDeleteTrackerLogs={handleDeleteTrackerLogs}
                deletingTracker={deletingTracker}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Usage;
