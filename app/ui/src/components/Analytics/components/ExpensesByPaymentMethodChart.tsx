import React, { useState } from 'react';
import { Box, Paper, Typography, useTheme, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { PaymentMethodExpense } from '../../../types/analytics';
import { getCurrencySymbol } from '../utils/currency';
import PaymentMethodDetailsDialog from './PaymentMethodDetailsDialog';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface ExpensesByPaymentMethodChartProps {
  data: PaymentMethodExpense[];
  currency?: string;
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
const ExpensesByPaymentMethodChart: React.FC<ExpensesByPaymentMethodChartProps> = ({
  data,
  currency = 'INR',
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [openDialog, setOpenDialog] = useState(false);
  const sym = getCurrencySymbol(currency);

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
          label: (ctx: any) => ` ${sym}${ctx.parsed?.toLocaleString('en-IN')}`,
        },
      },
    },
  };

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

      <PaymentMethodDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        data={data}
        currency={currency}
      />
    </>
  );
};

export default ExpensesByPaymentMethodChart;
