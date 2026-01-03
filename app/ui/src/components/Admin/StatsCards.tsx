import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Stack, Skeleton, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsData {
  filtered: { total: number; free: number; pro: number; businesspro: number };
  allTime: { total: number; free: number; pro: number; businesspro: number };
  filter: string;
}

interface StatsCardsProps {
  data: StatsData | null;
  loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ data, loading }) => {
  const theme = useTheme();

  const chartData = data
    ? {
        labels: ['Free', 'Pro', 'Business Pro'],
        datasets: [
          {
            data: [data.allTime.free, data.allTime.pro, data.allTime.businesspro],
            backgroundColor: [
              theme.palette.grey[600],
              theme.palette.success.main,
              theme.palette.warning.main,
            ],
            borderWidth: 0,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
      },
    },
    cutout: '75%',
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const getFilterLabel = () => {
    const labels: Record<string, string> = {
      today: 'Today',
      yesterday: 'Yesterday',
      last7days: 'Last 7 Days',
      month: 'This Month',
      year: 'This Year',
    };
    return labels[data.filter] || 'Selected Period';
  };

  return (
    <Card sx={{ borderRadius: 2, border: 'none' }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2.5}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <TrendingUpIcon sx={{ fontSize: 20, color: theme.palette.success.main }} />
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                    Total Users
                  </Typography>
                </Stack>
                <Typography variant="h3" fontWeight={800} color="success.main">
                  {data.allTime.total.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Box
                  sx={{
                    flex: '1 1 100px',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(156, 163, 175, 0.15)'
                        : 'rgba(107, 114, 128, 0.1)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Free
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {data.allTime.free}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: '1 1 100px',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(52, 211, 153, 0.15)'
                        : 'rgba(16, 185, 129, 0.1)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Pro
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    {data.allTime.pro}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: '1 1 100px',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(251, 191, 36, 0.15)'
                        : 'rgba(245, 158, 11, 0.1)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Business
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="warning.main">
                    {data.allTime.businesspro}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(99, 102, 241, 0.1)'
                      : 'rgba(99, 102, 241, 0.05)',
                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <PeopleIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                  <Typography variant="caption" fontWeight={700} color="primary">
                    New Users ({getFilterLabel()})
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={800} color="primary.main">
                  +{data.filtered.total || 0}
                </Typography>
                <Stack direction="row" spacing={1.5} mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    Free: {data.filtered.free || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pro: {data.filtered.pro || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Business: {data.filtered.businesspro || 0}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                minHeight: 220,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {chartData && <Doughnut data={chartData} options={chartOptions} />}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Distribution
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  100%
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatsCards;
