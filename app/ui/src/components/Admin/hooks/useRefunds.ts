import { useState, useCallback } from 'react';
import {
  getAllRefunds,
  createRefund as createRefundService,
  updateRefundStatus,
  getRefundsByPayment,
} from '../../../services/refundService';
import {
  Refund,
  RefundQueryParams,
  CreateRefundRequest,
  UpdateRefundStatusRequest,
} from '../../../types/refund';

interface UseRefundsReturn {
  refunds: Refund[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  fetchRefunds: (params?: RefundQueryParams) => Promise<void>;
  fetchRefundsByPayment: (paymentId: string) => Promise<void>;
  createRefund: (data: CreateRefundRequest) => Promise<Refund>;
  updateStatus: (refundId: string, data: UpdateRefundStatusRequest) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useRefunds = (): UseRefundsReturn => {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRefunds = useCallback(
    async (params?: RefundQueryParams) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllRefunds({
          ...params,
          page: params?.page ?? page + 1,
          limit: params?.limit ?? limit,
        });
        setRefunds(response.refunds);
        setTotal(response.total);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch refunds');
        console.error('Error fetching refunds:', err);
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  const fetchRefundsByPayment = useCallback(async (paymentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRefundsByPayment(paymentId);
      setRefunds(response.refunds);
      setTotal(response.total);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch refunds');
      console.error('Error fetching refunds:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRefund = useCallback(
    async (data: CreateRefundRequest): Promise<Refund> => {
      setLoading(true);
      setError(null);
      try {
        const response = await createRefundService(data);
        // Refresh refunds after creation
        await fetchRefunds();
        return response.refund;
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to create refund');
        console.error('Error creating refund:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchRefunds]
  );

  const updateStatus = useCallback(
    async (refundId: string, data: UpdateRefundStatusRequest) => {
      setLoading(true);
      setError(null);
      try {
        await updateRefundStatus(refundId, data);
        // Refresh refunds after update
        await fetchRefunds();
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to update refund status');
        console.error('Error updating refund status:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchRefunds]
  );

  return {
    refunds,
    total,
    page,
    limit,
    loading,
    error,
    fetchRefunds,
    fetchRefundsByPayment,
    createRefund,
    updateStatus,
    setPage,
    setLimit,
  };
};
