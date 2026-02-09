import React from 'react';
import { Box, Paper, Typography, FormControl, Select, MenuItem, useTheme } from '@mui/material';
import { Bar, Pie, Line } from 'react-chartjs-2';

interface ChartSectionProps {
  categoryData: any[];
  monthlyData: any[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  categoryData,
  monthlyData,
  selectedYear,
  onYearChange,
}) => {
  const theme = useTheme();

  // Separate expense and income category data
  const expenseCats = categoryData.filter(
    (item: { type?: string }) => !item.type || item.type === 'expense'
  );
  const incomeCats = categoryData.filter((item: { type?: string }) => item.type === 'income');

  const categoryBarData = {
    labels: expenseCats.map((item: { category: string }) => item.category),
    datasets: [
      {
        label: 'Expenses',
        data: expenseCats.map((item: { total: number }) => item.total),
        backgroundColor: theme.palette.error.main,
        borderColor: theme.palette.error.main,
        borderWidth: 1,
      },
      ...(incomeCats.length > 0
        ? [
            {
              label: 'Income',
              data: incomeCats.map((item: { total: number }) => item.total),
              backgroundColor: theme.palette.success.main,
              borderColor: theme.palette.success.main,
              borderWidth: 1,
            },
          ]
        : []),
    ],
  };

  const categoryChartData = {
    labels: categoryData.map((item: { category: string }) => item.category),
    datasets: [
      {
        label: 'Amount',
        data: categoryData.map((item: { total: number }) => item.total),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderWidth: 0,
      },
    ],
  };

  // Build monthly data arrays with income/expense split
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthMap = new Map<number, { expenses: number; income: number }>();
  monthlyData.forEach(
    (item: { month: number; expenses?: number; income?: number; total: number }) => {
      monthMap.set(item.month, {
        expenses: item.expenses ?? item.total ?? 0,
        income: item.income ?? 0,
      });
    }
  );

  const monthlyChartData = {
    labels: months,
    datasets: [
      {
        label: `Expenses ${selectedYear}`,
        data: months.map((_, i) => monthMap.get(i + 1)?.expenses ?? 0),
        borderColor: theme.palette.error.main,
        backgroundColor: `${theme.palette.error.main}33`,
        tension: 0.4,
        fill: true,
      },
      {
        label: `Income ${selectedYear}`,
        data: months.map((_, i) => monthMap.get(i + 1)?.income ?? 0),
        borderColor: theme.palette.success.main,
        backgroundColor: `${theme.palette.success.main}33`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.secondary },
        grid: { color: theme.palette.divider },
      },
      y: {
        ticks: { color: theme.palette.text.secondary },
        grid: { color: theme.palette.divider },
      },
    },
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: { xs: 2, md: 3 },
          mb: 3,
        }}
      >
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: theme.palette.text.primary }}
          >
            Expenses by Category
          </Typography>
          <Box sx={{ height: { xs: 250, md: 300 }, mt: 2 }}>
            <Bar data={categoryBarData} options={chartOptions} />
          </Box>
        </Paper>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: theme.palette.text.primary }}
          >
            Category Distribution
          </Typography>
          <Box
            sx={{
              height: { xs: 250, md: 300 },
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Pie data={categoryChartData} options={chartOptions} />
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 2,
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: theme.palette.text.primary }}
          >
            Monthly Income vs Expenses Trend
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={selectedYear} onChange={e => onYearChange(Number(e.target.value))}>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ height: { xs: 250, md: 300 }, mt: 2 }}>
          <Line data={monthlyChartData} options={chartOptions} />
        </Box>
      </Paper>
    </>
  );
};

export default ChartSection;
