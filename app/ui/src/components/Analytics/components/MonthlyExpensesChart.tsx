import React, { useState } from 'react';
import {
  Box, Paper, Typography, FormControl, Select, MenuItem,
  useTheme, IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, LineElement,
  PointElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { MonthlyExpense } from '../../../types/analytics';
import { getCurrencySymbol } from '../utils/currency';
import MonthlyDetailsDialog from './MonthlyDetailsDialog';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

interface MonthlyExpensesChartProps {
  data: MonthlyExpense[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  currency?: string;
}

/**
 * MonthlyExpensesChart Component
 * Displays line chart for monthly expense trends
 */
const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({
  data, selectedYear, onYearChange, currency = 'INR',
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [openDialog, setOpenDialog] = useState(false);
  const sym = getCurrencySymbol(currency);

  const textColor = isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.87)';
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyExpenses = Array(12).fill(0);
  const monthlyIncome = Array(12).fill(0);
  const monthlyTransactions = Array(12).fill(0);

  data.forEach(item => {
    if (item.month >= 1 && item.month <= 12) {
      monthlyExpenses[item.month - 1] = item.expenses ?? item.total;
      monthlyIncome[item.month - 1] = item.income ?? 0;
      monthlyTransactions[item.month - 1] = item.count;
    }
  });

  const hasIncome = monthlyIncome.some(v => v > 0);

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: `Expenses ${selectedYear}`,
        data: monthlyExpenses,
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
      ...(hasIncome
        ? [{
            label: `Income ${selectedYear}`,
            data: monthlyIncome,
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderWidth: 3,
          }]
        : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { color: textColor, font: { size: 12, weight: 500 as const }, padding: 15 } },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
        titleColor: isDarkMode ? '#fff' : '#000', bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', borderWidth: 1, padding: 12,
        callbacks: { label: (ctx: any) => ` ${sym}${ctx.parsed.y?.toLocaleString('en-IN')}` },
      },
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 }, callback: (v: any) => sym + v.toLocaleString('en-IN') },
      },
    },
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <>
      <Paper elevation={3}
        sx={{ p: { xs: 2, md: 3 }, mb: 3, bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper', backdropFilter: 'blur(10px)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 600, color: textColor }}>
              Income vs Expenses Trend
            </Typography>
            <IconButton size="small" onClick={() => setOpenDialog(true)}
              sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' } }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={selectedYear} onChange={e => onYearChange(Number(e.target.value))}>
              {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ height: { xs: 250, md: 300 }, mt: 2 }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </Paper>

      <MonthlyDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        selectedYear={selectedYear}
        monthlyExpenses={monthlyExpenses}
        monthlyIncome={monthlyIncome}
        monthlyTransactions={monthlyTransactions}
        currency={currency}
      />
    </>
  );
};

export default MonthlyExpensesChart;
