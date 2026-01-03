import React, { useState, useEffect } from 'react';
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
  Button,
  useTheme,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import RefundIcon from '@mui/icons-material/MoneyOff';
import { usePayments } from './hooks/usePayments';
import { useRefunds } from './hooks/useRefunds';
import { Payment, PaymentState } from '../../types/payment';
import RefundDialog from './RefundDialog';

const AdminPayments: React.FC = () => {
  const theme = useTheme();
  const { payments, total, page, limit, loading, error, fetchPayments, setPage, setLimit } =
    usePayments();

  const { createRefund } = useRefunds();

  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [statusFilter, setStatusFilter] = useState<PaymentState | 'all'>('all');

  // Fetch payments on mount and when filters change
  useEffect(() => {
    const params = {
      state: statusFilter !== 'all' ? statusFilter : undefined,
    };
    fetchPayments(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    fetchPayments({
      state: statusFilter !== 'all' ? statusFilter : undefined,
      page: newPage + 1,
    });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(0);
    fetchPayments({
      state: statusFilter !== 'all' ? statusFilter : undefined,
      page: 1,
      limit: newLimit,
    });
  };

  const handleRefundClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundDialogOpen(true);
  };

  const handleRefund = async (paymentId: string, amount: number, reason: string) => {
    try {
      await createRefund({
        paymentId,
        amount,
        reason,
      });
      // Refresh payments after successful refund
      fetchPayments({
        state: statusFilter !== 'all' ? statusFilter : undefined,
      });
    } catch (err) {
      console.error('Refund error:', err);
    }
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
      {/* Filters and Actions */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center">
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
            <MenuItem value={PaymentState.INITIATED}>Initiated</MenuItem>
            <MenuItem value={PaymentState.FAILED}>Failed</MenuItem>
            <MenuItem value={PaymentState.EXPIRED}>Expired</MenuItem>
            <MenuItem value={PaymentState.CANCELLED}>Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() =>
            fetchPayments({ state: statusFilter !== 'all' ? statusFilter : undefined })
          }
          disabled={loading}
        >
          Refresh
        </Button>
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
                <strong>Payment ID</strong>
              </TableCell>
              <TableCell>
                <strong>User</strong>
              </TableCell>
              <TableCell>
                <strong>Plan</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Duration</strong>
              </TableCell>
              <TableCell>
                <strong>Method</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (!payments || payments.length === 0) ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : !payments || payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No payments found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map(payment => (
                <TableRow key={payment._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {payment._id.slice(-8)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {typeof payment.userId === 'object'
                      ? payment.userId.name
                      : payment.userName || 'N/A'}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {typeof payment.userId === 'object'
                        ? payment.userId.email
                        : payment.userEmail || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{payment.userSelectedPlan.toUpperCase()}</TableCell>
                  <TableCell align="right">
                    {payment.currency} {payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{payment.planDuration === 'yearly' ? 'Annual' : 'Monthly'}</TableCell>
                  <TableCell>{payment.paymentUsing}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.paymentState}
                      color={getStatusColor(payment.paymentState)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    {payment.paymentState === PaymentState.SUCCESS && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<RefundIcon />}
                        onClick={() => handleRefundClick(payment)}
                      >
                        Refund
                      </Button>
                    )}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <RefundDialog
        open={refundDialogOpen}
        onClose={() => setRefundDialogOpen(false)}
        payment={selectedPayment}
        onRefund={handleRefund}
      />
    </Box>
  );
};

export default AdminPayments;
