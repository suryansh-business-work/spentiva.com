import { useState, useCallback } from 'react';
import { createPayment } from '../../../services/paymentService';
import { useAuth } from '../../../contexts/AuthContext';
import {
  CreatePaymentRequest,
  PaymentState,
  UserSelectedPlan,
  PlanDuration,
  PaymentMethod,
  Currency,
  PaymentType,
  CardStore,
} from '../../../types/payment';

interface UsePaymentDialogReturn {
  processing: boolean;
  success: boolean;
  error: string | null;
  initiatePayment: (
    plan: UserSelectedPlan,
    duration: PlanDuration,
    amount: number,
    cardData: CardStore
  ) => Promise<void>;
  reset: () => void;
}

// Generate unique payment ID
const generatePaymentId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `PAY_${timestamp}_${random}`;
};

export const usePaymentDialog = (): UsePaymentDialogReturn => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async (plan: UserSelectedPlan, duration: PlanDuration, amount: number, cardData: CardStore) => {
      if (!user || !user.id) {
        setError('User not authenticated');
        return;
      }

      setProcessing(true);
      setError(null);
      setSuccess(false);

      try {
        const paymentData: CreatePaymentRequest = {
          userId: user.id,
          userSelectedPlan: plan,
          planDuration: duration,
          amount,
          currency: Currency.USD,
          paymentUsing: PaymentMethod.CREDIT_CARD,
          paymentType: PaymentType.SUBSCRIPTION,
          paymentId: generatePaymentId(),
          paymentCountry: 'US', // Default to US, can be changed based on user location
          cardData,
        };

        const response = await createPayment(paymentData);

        if (response.success && response.payment.paymentState === PaymentState.SUCCESS) {
          setSuccess(true);
          // Optionally update user context here
        } else if (response.payment.paymentState === PaymentState.FAILED) {
          throw new Error(response.payment.paymentStateReason || 'Payment failed');
        } else {
          // Payment is processing
          setSuccess(true);
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err.message || 'Payment failed';
        setError(errorMessage);
        console.error('Payment error:', err);
        throw err;
      } finally {
        setProcessing(false);
      }
    },
    [user]
  );

  const reset = useCallback(() => {
    setProcessing(false);
    setSuccess(false);
    setError(null);
  }, []);

  return {
    processing,
    success,
    error,
    initiatePayment,
    reset,
  };
};
