import React from 'react';
import { Box, Card, CardContent, useTheme } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsChartProps {
  data: {
    free: number;
    pro: number;
    businesspro: number;
  };
}

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  const theme = useTheme();

  const chartData = {
    labels: ['Free', 'Pro', 'Business Pro'],
    datasets: [
      {
        data: [data.free, data.pro, data.businesspro],
        backgroundColor: [
          theme.palette.grey[500],
          theme.palette.success.main,
          theme.palette.warning.main,
        ],
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 12,
          font: { size: 11 },
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ height: 200 }}>
          <Doughnut data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsChart;
