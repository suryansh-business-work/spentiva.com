import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { getUserPayments } from '../../services/paymentService';
import { Payment, PaymentState } from '../../types/payment';

interface PaymentHistoryProps {
  userId: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ userId }) => {
  const theme = useTheme();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaymentState | 'all'>('all');

  useEffect(() => {
    fetchPayments();
  }, [userId, page, limit, statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserPayments(userId, {
        page: page + 1,
        limit,
        state: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setPayments(response.payments);
      setTotal(response.total);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch payment history');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (state: PaymentState) => {
    switch (state) {
      case PaymentState.SUCCESS:
        return 'success';
      case PaymentState.PROCESSING:
      case PaymentState.INITIATED:
        return 'warning';
      case PaymentState.FAILED:
      case PaymentState.EXPIRED:
        return 'error';
      case PaymentState.CANCELLED:
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Payment History
      </Typography>

      {/* Filter */}
      <Stack direction="row" spacing={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as PaymentState | 'all')}
            label="Filter by Status"
          >
            <MenuItem value="all">All Payments</MenuItem>
            <MenuItem value={PaymentState.SUCCESS}>Success</MenuItem>
            <MenuItem value={PaymentState.PROCESSING}>Processing</MenuItem>
            <MenuItem value={PaymentState.FAILED}>Failed</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: `1px solid ${theme.palette.divider}` }}
      >
        <Table>
          <TableHead
            sx={{
              bgcolor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <TableRow>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Plan</strong>
              </TableCell>
              <TableCell>
                <strong>Duration</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Method</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (!payments || payments.length === 0) ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : !payments || payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No payments found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map(payment => (
                <TableRow key={payment._id} hover>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.userSelectedPlan.toUpperCase()}</TableCell>
                  <TableCell>{payment.planDuration === 'yearly' ? 'Annual' : 'Monthly'}</TableCell>
                  <TableCell align="right">
                    {payment.currency} {payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{payment.paymentUsing}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.paymentState}
                      color={getStatusColor(payment.paymentState)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total ?? 0}
          page={page ?? 0}
          onPageChange={handleChangePage}
          rowsPerPage={limit ?? 10}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
};

export default PaymentHistory;
