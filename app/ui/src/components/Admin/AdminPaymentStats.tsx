import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  Stack,
  Divider,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { getPaymentStats } from '../../services/paymentService';
import { getRefundStats } from '../../services/refundService';
import { PaymentStatistics } from '../../types/payment';
import { RefundStatistics } from '../../types/refund';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: subtitle ? 0.5 : 0 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
};

const AdminPaymentStats: React.FC = () => {
  const theme = useTheme();
  const [paymentStats, setPaymentStats] = useState<PaymentStatistics | null>(null);
  const [refundStats, setRefundStats] = useState<RefundStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [paymentRes, refundRes] = await Promise.all([getPaymentStats(), getRefundStats()]);
      setPaymentStats(paymentRes.stats);
      setRefundStats(refundRes.stats);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!paymentStats || !refundStats) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Payment & Refund Statistics
      </Typography>

      {/* Payment Stats */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Payment Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Revenue"
            value={`$${paymentStats.totalRevenue.toFixed(2)}`}
            icon={<MoneyIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Successful Payments"
            value={paymentStats.successfulPayments}
            icon={<SuccessIcon />}
            color={theme.palette.success.main}
            subtitle={`${paymentStats.successRate.toFixed(1)}% success rate`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Failed Payments"
            value={paymentStats.failedPayments}
            icon={<ErrorIcon />}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Pending Payments"
            value={paymentStats.pendingPayments}
            icon={<PendingIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Refund Stats */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Refund Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Refunded"
            value={`$${refundStats.totalRefundedAmount.toFixed(2)}`}
            icon={<MoneyIcon />}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Successful Refunds"
            value={refundStats.successfulRefunds}
            icon={<SuccessIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Refund Rate"
            value={`${refundStats.refundRate.toFixed(1)}%`}
            icon={<ErrorIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Average Refund"
            value={`$${refundStats.averageRefundAmount.toFixed(2)}`}
            icon={<MoneyIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPaymentStats;
