import { useState, useCallback } from 'react';
import {
  getAllPayments,
  updatePaymentState,
  deletePayment,
} from '../../../services/paymentService';
import { Payment, PaymentQueryParams, UpdatePaymentStateRequest } from '../../../types/payment';

interface UsePaymentsReturn {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  fetchPayments: (params?: PaymentQueryParams) => Promise<void>;
  updateState: (paymentId: string, data: UpdatePaymentStateRequest) => Promise<void>;
  removePayment: (paymentId: string) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const usePayments = (): UsePaymentsReturn => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(
    async (params?: PaymentQueryParams) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllPayments({
          ...params,
          page: params?.page ?? page + 1,
          limit: params?.limit ?? limit,
        });
        setPayments(response.payments);
        setTotal(response.total);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch payments');
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  const updateState = useCallback(
    async (paymentId: string, data: UpdatePaymentStateRequest) => {
      setLoading(true);
      setError(null);
      try {
        await updatePaymentState(paymentId, data);
        // Refresh payments after update
        await fetchPayments();
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to update payment state');
        console.error('Error updating payment state:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPayments]
  );

  const removePayment = useCallback(
    async (paymentId: string) => {
      setLoading(true);
      setError(null);
      try {
        await deletePayment(paymentId);
        // Refresh payments after deletion
        await fetchPayments();
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to delete payment');
        console.error('Error deleting payment:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPayments]
  );

  return {
    payments,
    total,
    page,
    limit,
    loading,
    error,
    fetchPayments,
    updateState,
    removePayment,
    setPage,
    setLimit,
  };
};
