import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
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
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { PaymentMethodExpense } from '../../../types/analytics';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface ExpensesByPaymentMethodChartProps {
  data: PaymentMethodExpense[];
}

const paymentMethodColors = [
  { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgba(16, 185, 129, 1)' },
  { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgba(59, 130, 246, 1)' },
  { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgba(245, 158, 11, 1)' },
  { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgba(239, 68, 68, 1)' },
  { bg: 'rgba(139, 92, 246, 0.8)', border: 'rgba(139, 92, 246, 1)' },
];

/**
 * ExpensesByPaymentMethodChart Component
 * Displays pie chart for payment method distribution
 */
const ExpensesByPaymentMethodChart: React.FC<ExpensesByPaymentMethodChartProps> = ({ data }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [openDialog, setOpenDialog] = useState(false);

  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)';

  const chartData = {
    labels: data.map(item => item.paymentMethod),
    datasets: [
      {
        label: 'Total Expenses',
        data: data.map(item => item.total),
        backgroundColor: paymentMethodColors.map(c => c.bg),
        borderColor: paymentMethodColors.map(c => c.border),
        borderWidth: 2,
        hoverOffset: 10,
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
            return ` ₹${context.parsed?.toLocaleString('en-IN')}`;
          },
        },
      },
    },
  };

  const totalExpenses = data.reduce((sum, item) => sum + item.total, 0);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 600,
              color: textColor,
            }}
          >
            Expenses by Payment Method
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
          <Pie data={chartData} options={chartOptions} />
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
            Payment Method Details
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
                  <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
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
                {data.map((item, index) => {
                  const percentage =
                    totalExpenses > 0 ? ((item.total / totalExpenses) * 100).toFixed(1) : '0.0';
                  return (
                    <TableRow key={index} hover>
                      <TableCell>{item.paymentMethod}</TableCell>
                      <TableCell align="right">₹{item.total.toLocaleString('en-IN')}</TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                      <TableCell align="right">{percentage}%</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow
                  sx={{ bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ₹{totalExpenses.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {data.reduce((sum, item) => sum + item.count, 0)}
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

export default ExpensesByPaymentMethodChart;
