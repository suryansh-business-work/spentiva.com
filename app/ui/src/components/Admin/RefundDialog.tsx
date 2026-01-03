import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Divider,
  Stack,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Payment } from '../../types/payment';

interface RefundFormValues {
  refundAmount: number;
  reason: string;
}

interface RefundDialogProps {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
  onRefund: (paymentId: string, amount: number, reason: string) => void;
}

const RefundDialog: React.FC<RefundDialogProps> = ({ open, onClose, payment, onRefund }) => {
  const theme = useTheme();

  if (!payment) return null;

  const refundSchema = yup.object({
    refundAmount: yup
      .number()
      .required('Refund amount is required')
      .min(1, 'Minimum refund amount is 1')
      .max(payment.amount, `Maximum refund amount is ${payment.amount}`),
    reason: yup
      .string()
      .required('Refund reason is required')
      .min(10, 'Reason must be at least 10 characters'),
  });

  const initialValues: RefundFormValues = {
    refundAmount: payment.amount,
    reason: '',
  };

  const handleSubmit = (values: RefundFormValues) => {
    onRefund(payment._id, values.refundAmount, values.reason);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          fontWeight: 700,
        }}
      >
        Process Refund
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <Formik
        initialValues={initialValues}
        validationSchema={refundSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <DialogContent sx={{ pt: 3 }}>
              {/* Payment Information */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  Payment Information
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>User:</strong>{' '}
                  {typeof payment.userId === 'object'
                    ? `${payment.userId.name} (${payment.userId.email})`
                    : `${payment.userName || 'N/A'} (${payment.userEmail || 'N/A'})`}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Plan:</strong> {payment.userSelectedPlan.toUpperCase()} -{' '}
                  {payment.planDuration === 'yearly' ? 'Annual' : 'Monthly'}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Payment Amount:</strong> {payment.currency} {payment.amount.toFixed(2)}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Payment Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Payment ID:</strong> {payment._id}
                </Typography>
              </Alert>

              {/* Refund Amount Field */}
              <Field name="refundAmount">
                {() => (
                  <TextField
                    fullWidth
                    label={`Refund Amount (${payment.currency})`}
                    type="number"
                    value={values.refundAmount}
                    onChange={e => setFieldValue('refundAmount', parseFloat(e.target.value))}
                    error={touched.refundAmount && Boolean(errors.refundAmount)}
                    helperText={touched.refundAmount && errors.refundAmount}
                    sx={{ mb: 2 }}
                    inputProps={{
                      step: '0.01',
                      min: '1',
                      max: payment.amount,
                    }}
                  />
                )}
              </Field>

              {/* Amount Info */}
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="caption" color="text.secondary">
                    Minimum: {payment.currency} 1.00
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Maximum: {payment.currency} {payment.amount.toFixed(2)}
                  </Typography>
                </Stack>
              </Box>

              {/* Refund Reason Field */}
              <Field name="reason">
                {() => (
                  <TextField
                    fullWidth
                    label="Refund Reason"
                    multiline
                    rows={4}
                    value={values.reason}
                    onChange={e => setFieldValue('reason', e.target.value)}
                    error={touched.reason && Boolean(errors.reason)}
                    helperText={touched.reason && errors.reason}
                    placeholder="Please provide a detailed reason for this refund..."
                  />
                )}
              </Field>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="warning">
                Process Refund
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default RefundDialog;
