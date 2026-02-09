import React, { useState } from 'react';
import { Box, Paper, Typography, useTheme, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { CategoryExpense } from '../../../types/analytics';
import { getCurrencySymbol } from '../utils/currency';
import CategoryDetailsDialog from './CategoryDetailsDialog';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface ExpensesByCategoryChartProps {
  data: CategoryExpense[];
  currency?: string;
}

const categoryColors = [
  { bg: 'rgba(255, 99, 132, 0.8)', border: 'rgba(255, 99, 132, 1)' },
  { bg: 'rgba(54, 162, 235, 0.8)', border: 'rgba(54, 162, 235, 1)' },
  { bg: 'rgba(255, 206, 86, 0.8)', border: 'rgba(255, 206, 86, 1)' },
  { bg: 'rgba(75, 192, 192, 0.8)', border: 'rgba(75, 192, 192, 1)' },
  { bg: 'rgba(153, 102, 255, 0.8)', border: 'rgba(153, 102, 255, 1)' },
  { bg: 'rgba(255, 159, 64, 0.8)', border: 'rgba(255, 159, 64, 1)' },
  { bg: 'rgba(102, 126, 234, 0.8)', border: 'rgba(102, 126, 234, 1)' },
  { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgba(16, 185, 129, 1)' },
  { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgba(245, 158, 11, 1)' },
  { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgba(239, 68, 68, 1)' },
];

/**
 * ExpensesByCategoryChart Component
 * Displays Bar and Pie charts for category distribution
 */
const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ data, currency = 'INR' }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [openDialog, setOpenDialog] = useState(false);
  const sym = getCurrencySymbol(currency);

  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const getChartOptions = (isBar: boolean = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { color: textColor, font: { size: 12, weight: 500 as const }, padding: 15 } },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
        titleColor: isDarkMode ? '#fff' : '#000', bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', borderWidth: 1, padding: 12,
        callbacks: {
          label: (ctx: any) => ` ${sym}${(ctx.parsed.y ?? ctx.parsed)?.toLocaleString('en-IN')}`,
        },
      },
    },
    scales: isBar ? {
      x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 }, callback: (v: any) => sym + v.toLocaleString('en-IN') } },
    } : undefined,
  });

  const barChartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: 'Total Expenses',
        data: data.map(item => item.total),
        backgroundColor: categoryColors[0].bg,
        borderColor: categoryColors[0].border,
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 50,
        maxBarThickness: 60,
      },
    ],
  };

  const pieChartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: 'Total Expenses',
        data: data.map(item => item.total),
        backgroundColor: categoryColors.map(c => c.bg),
        borderColor: categoryColors.map(c => c.border),
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
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
        {/* Bar Chart */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 600,
                color: textColor,
              }}
            >
              Expenses by Category
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpenDialog(true)}
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ height: { xs: 250, md: 300 }, mt: 1 }}>
            <Bar data={barChartData} options={getChartOptions(true)} />
          </Box>
        </Paper>

        {/* Pie Chart */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 600,
                color: textColor,
              }}
            >
              Category Distribution
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpenDialog(true)}
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box
            sx={{
              height: { xs: 250, md: 300 },
              mt: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Pie data={pieChartData} options={getChartOptions(false)} />
          </Box>
        </Paper>
      </Box>

      <CategoryDetailsDialog open={openDialog} onClose={() => setOpenDialog(false)} data={data} currency={currency} />
    </>
  );
};

export default ExpensesByCategoryChart;
