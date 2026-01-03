import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { MonthlyExpense } from '../../../types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MonthlyExpensesChartProps {
  data: MonthlyExpense[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

/**
 * MonthlyExpensesChart Component
 * Displays line chart for monthly expense trends
 */
const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({
  data,
  selectedYear,
  onYearChange,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [openDialog, setOpenDialog] = useState(false);

  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const monthLabels = [
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

  // Map data to 12 months (fill with 0 if no data for that month)
  const monthlyTotals = Array(12).fill(0);
  const monthlyTransactions = Array(12).fill(0);

  data.forEach(item => {
    if (item.month >= 1 && item.month <= 12) {
      monthlyTotals[item.month - 1] = item.total;
      monthlyTransactions[item.month - 1] = item.count;
    }
  });

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: `Expenses ${selectedYear}`,
        data: monthlyTotals,
        borderColor: isDarkMode ? 'rgba(102, 126, 234, 1)' : 'rgba(102, 126, 234, 1)',
        backgroundColor: isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: isDarkMode ? 'rgba(102, 126, 234, 1)' : 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 3,
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
          color: textColor,
          font: {
            size: 12,
            weight: 500,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return ` ₹${context.parsed.y?.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return '₹' + value.toLocaleString('en-IN');
          },
        },
      },
    },
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const totalYearExpenses = monthlyTotals.reduce((sum, val) => sum + val, 0);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
          backdropFilter: 'blur(10px)',
        }}
      >
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 600,
                color: textColor,
              }}
            >
              Monthly Expenses Trend
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
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={selectedYear} onChange={e => onYearChange(Number(e.target.value))}>
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ height: { xs: 250, md: 300 }, mt: 2 }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDarkMode ? 'rgba(30, 30, 30, 0.98)' : 'background.paper',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}
        >
          <Typography variant="h6" fontWeight={600}>
            Monthly Expenses Details ({selectedYear})
          </Typography>
          <IconButton
            edge="end"
            onClick={() => setOpenDialog(false)}
            size="small"
            sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Amount
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Transactions
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    %
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthLabels.map((month, index) => {
                  const amount = monthlyTotals[index];
                  const count = monthlyTransactions[index];
                  const percentage =
                    totalYearExpenses > 0 ? ((amount / totalYearExpenses) * 100).toFixed(1) : '0.0';
                  return (
                    <TableRow key={index} hover>
                      <TableCell>{month}</TableCell>
                      <TableCell align="right">₹{amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell align="right">{count}</TableCell>
                      <TableCell align="right">{percentage}%</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow
                  sx={{ bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ₹{totalYearExpenses.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {monthlyTransactions.reduce((sum, val) => sum + val, 0)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    100%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthlyExpensesChart;
