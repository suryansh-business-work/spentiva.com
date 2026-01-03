import React from 'react';
import { Box, Paper, Typography, Alert, Skeleton, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { UsageGraphs, TrackerGraphs } from '../../../types/usage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface UsageGraphsPanelProps {
  data: UsageGraphs | TrackerGraphs | null;
  loading: boolean;
  pieChartTitle?: string;
}

/**
 * UsageGraphsPanel Component
 * Displays daily usage trends and distribution charts
 */
const UsageGraphsPanel: React.FC<UsageGraphsPanelProps> = ({ data, loading, pieChartTitle }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2].map(i => (
          <Grid size={{ xs: 12, md: 6 }} key={i}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const pieData = data
    ? 'byTrackerType' in data
      ? data.byTrackerType
      : (data as any).messageTypeDistribution || []
    : [];
  const hasData = data && (data.dailyUsage.length > 0 || pieData.length > 0);

  if (!hasData) {
    return <Alert severity="info">No graph data available yet.</Alert>;
  }

  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // Daily usage chart data
  const dailyChartData = {
    labels: data!.dailyUsage.map(d => d.label || d.date || ''),
    datasets: [
      {
        label: 'Messages',
        data: data!.dailyUsage.map(d => d.messages || d.messageCount || 0),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const dailyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: textColor },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor },
      },
    },
  };

  // Distribution chart data
  const typeColors = ['#667eea', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
  const typeChartData = {
    labels: pieData.map((t: any) => t.category || t.type),
    datasets: [
      {
        data: pieData.map((t: any) => t.count),
        backgroundColor: typeColors,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const typeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: textColor },
      },
    },
  };

  return (
    <Grid container spacing={3}>
      {data!.dailyUsage.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              bgcolor: theme.palette.background.paper,
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Daily Usage Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={dailyChartData} options={dailyChartOptions} />
            </Box>
          </Paper>
        </Grid>
      )}

      {pieData.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
              bgcolor: theme.palette.background.paper,
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {pieChartTitle || 'Tracker Type Distribution'}
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={typeChartData} options={typeChartOptions} />
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default UsageGraphsPanel;
