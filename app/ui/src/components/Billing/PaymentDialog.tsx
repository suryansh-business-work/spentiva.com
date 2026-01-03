import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Stack,
  Paper,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Lottie from 'lottie-react';
import CreditCardForm from './CreditCardForm';
import { usePaymentDialog } from './hooks/usePaymentDialog';
import {
  PLAN_NAMES,
  PLAN_PRICING,
  type BillingPeriod,
  type PlanType,
} from '../../config/planConfig';
import { UserSelectedPlan, PlanDuration, CardStore } from '../../types/payment';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  selectedPlan?: PlanType | null;
}

const STEPS = ['Choose Billing Period', 'Payment Details'];

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose, selectedPlan }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');
  const [paymentAnim, setPaymentAnim] = useState<any>(null);
  const [successAnim, setSuccessAnim] = useState<any>(null);

  const { processing, success, error, initiatePayment, reset } = usePaymentDialog();

  useEffect(() => {
    fetch('/animations/payment_animation.json')
      .then(res => res.json())
      .then(data => setPaymentAnim(data))
      .catch(err => console.error('Error loading payment animation:', err));

    fetch('/animations/payment_successful.json')
      .then(res => res.json())
      .then(data => setSuccessAnim(data))
      .catch(err => console.error('Error loading success animation:', err));
  }, []);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setBillingPeriod('yearly');
      reset();
    }
  }, [open, reset]);

  const handlePaymentSubmit = async (cardData: CardStore) => {
    if (!selectedPlan || selectedPlan === 'free') return;

    const plan = selectedPlan === 'pro' ? UserSelectedPlan.PRO : UserSelectedPlan.BUSINESS_PRO;
    const duration = billingPeriod === 'yearly' ? PlanDuration.YEARLY : PlanDuration.MONTHLY;
    const amount =
      billingPeriod === 'yearly'
        ? PLAN_PRICING[selectedPlan].yearly
        : PLAN_PRICING[selectedPlan].monthly;

    try {
      await initiatePayment(plan, duration, amount, cardData);
      // Success handled by hook
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Payment submission error:', err);
    }
  };

  const handleClose = () => {
    if (!processing && !success) {
      onClose();
    }
  };

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  if (!selectedPlan || selectedPlan === 'free') return null;

  const planPricing = PLAN_PRICING[selectedPlan];
  const currentPrice = billingPeriod === 'yearly' ? planPricing.yearly : planPricing.monthly;
  const monthlyPrice = planPricing.monthly;
  const savings = billingPeriod === 'yearly' ? monthlyPrice * 12 - planPricing.yearly : 0;

  // Success screen
  if (success && successAnim) {
    return (
      <Dialog
        open={open}
        maxWidth={false}
        PaperProps={{ sx: { width: isMobile ? '90%' : '50%', maxWidth: 600, borderRadius: 3 } }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Lottie
            animationData={successAnim}
            loop={false}
            style={{ width: 200, height: 200, margin: '0 auto' }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: theme.palette.success.main, mt: 2 }}
          >
            Payment Successful!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Welcome to {PLAN_NAMES[selectedPlan]}! 🎉
          </Typography>
        </Box>
      </Dialog>
    );
  }

  // Processing screen
  if (processing && paymentAnim) {
    return (
      <Dialog
        open={open}
        maxWidth={false}
        PaperProps={{ sx: { width: isMobile ? '90%' : '50%', maxWidth: 600, borderRadius: 3 } }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Lottie
            animationData={paymentAnim}
            loop={true}
            style={{ width: 300, height: 300, margin: '0 auto' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
            Processing Payment...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we process your payment
          </Typography>
        </Box>
      </Dialog>
    );
  }

  // Main dialog with stepper
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{ sx: { width: isMobile ? '95%' : '600px', maxWidth: 700, borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          fontWeight: 700,
          fontSize: '1.5rem',
        }}
      >
        Upgrade to {PLAN_NAMES[selectedPlan]}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ pt: 3, pb: 4 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={reset}>
            {error}
          </Alert>
        )}

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        {activeStep === 0 && (
          <Box>
            {/* Billing Period Selection */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
              Choose Your Billing Period
            </Typography>

            <ToggleButtonGroup
              value={billingPeriod}
              exclusive
              onChange={(_, newPeriod) => {
                if (newPeriod !== null) {
                  setBillingPeriod(newPeriod);
                }
              }}
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton
                value="monthly"
                sx={{
                  py: 2,
                  flexDirection: 'column',
                  gap: 1,
                  '&.Mui-selected': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  },
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Monthly
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  ${monthlyPrice}
                </Typography>
                <Typography variant="caption">per month</Typography>
              </ToggleButton>

              <ToggleButton
                value="yearly"
                sx={{
                  py: 2,
                  flexDirection: 'column',
                  gap: 1,
                  position: 'relative',
                  '&.Mui-selected': {
                    bgcolor: theme.palette.success.main,
                    color: theme.palette.success.contrastText,
                    '&:hover': {
                      bgcolor: theme.palette.success.dark,
                    },
                  },
                }}
              >
                <Chip
                  label={`Save ${planPricing.yearlyDiscount}%`}
                  color="success"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontWeight: 700,
                  }}
                />
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Yearly
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  ${planPricing.yearly.toFixed(2)}
                </Typography>
                <Typography variant="caption">per year</Typography>
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Pricing Summary */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Stack spacing={2}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Plan
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {PLAN_NAMES[selectedPlan]} - {billingPeriod === 'yearly' ? 'Annual' : 'Monthly'}
                  </Typography>
                </Box>

                {billingPeriod === 'yearly' && (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      You Save
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: theme.palette.success.main }}
                    >
                      ${savings.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                <Divider />

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, color: theme.palette.primary.main }}
                  >
                    ${currentPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Next Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleNext}
              sx={{ mt: 3, py: 1.5, fontWeight: 700 }}
            >
              Continue to Payment
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            {/* Payment Summary */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                background:
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.success.dark} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.success.light} 100%)`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {PLAN_NAMES[selectedPlan]} - {billingPeriod === 'yearly' ? 'Annual' : 'Monthly'}
                </Typography>
                {billingPeriod === 'yearly' && (
                  <Chip label={`${planPricing.yearlyDiscount}% OFF`} color="success" size="small" />
                )}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                ${currentPrice.toFixed(2)}
              </Typography>
              {billingPeriod === 'yearly' && (
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Save ${savings.toFixed(2)} compared to monthly billing
                </Typography>
              )}
            </Paper>

            {/* Credit Card Form */}
            <CreditCardForm onSubmit={handlePaymentSubmit} disabled={processing} />

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{ flex: 1 }}
                disabled={processing}
              >
                Back
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
