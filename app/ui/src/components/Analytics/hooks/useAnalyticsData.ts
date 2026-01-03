import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { getRequest } from '../../../utils/http';
import { parseResponseData } from '../../../utils/response-parser';
import {
  AnalyticsSummary,
  CategoryExpense,
  MonthlyExpense,
  PaymentMethodExpense,
  AnalyticsFilter,
} from '../../../types/analytics';

interface UseAnalyticsDataProps {
  trackerId?: string;
}

interface UseAnalyticsDataReturn {
  summary: AnalyticsSummary;
  categoryData: CategoryExpense[];
  monthlyData: MonthlyExpense[];
  paymentMethodData: PaymentMethodExpense[];
  loading: boolean;
  error: string | null;
  refetch: (filters?: Partial<AnalyticsFilter>) => Promise<void>;
}

/**
 * Custom hook to fetch and manage analytics data
 */
export const useAnalyticsData = ({ trackerId }: UseAnalyticsDataProps): UseAnalyticsDataReturn => {
  const [summary, setSummary] = useState<AnalyticsSummary>({ total: 0, average: 0, count: 0 });
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyExpense[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = useCallback(
    async (filters: Partial<AnalyticsFilter> = {}) => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, string> = {};

        if (filters.filter) params.filter = filters.filter;
        if (filters.customStart) params.customStart = filters.customStart;
        if (filters.customEnd) params.customEnd = filters.customEnd;
        if (trackerId) params.trackerId = trackerId;
        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.year !== undefined) params.year = filters.year.toString();

        const [summaryRes, categoryRes, monthlyRes, paymentRes] = await Promise.all([
          getRequest(endpoints.analytics.summary, params),
          getRequest(endpoints.analytics.byCategory, params),
          getRequest(endpoints.analytics.byMonth, {
            year: filters.year?.toString() || new Date().getFullYear().toString(),
            ...(trackerId && { trackerId }),
          }),
          getRequest(endpoints.analytics.byPaymentMethod, params),
        ]);

        // Handle different response structures
        // Summary API returns: data.data.stats with totalExpenses, transactionCount, averageExpense
        const summaryData = parseResponseData<any>(summaryRes, {});
        const summaryStats = summaryData?.stats || {};
        const summary = {
          total: summaryStats.totalExpenses || 0,
          average: summaryStats.averageExpense || 0,
          count: summaryStats.transactionCount || 0,
        };

        // Category, Monthly, and Payment APIs return: data.data.data (double nested)
        const categoryData = parseResponseData<any>(categoryRes, {});
        const monthlyData = parseResponseData<any>(monthlyRes, {});
        const paymentData = parseResponseData<any>(paymentRes, {});

        const categoryList = categoryData?.data || [];
        const monthlyList = monthlyData?.data || [];
        const paymentList = paymentData?.data || [];

        setSummary(summary);
        setCategoryData(categoryList);
        setMonthlyData(monthlyList);
        setPaymentMethodData(paymentList);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    },
    [trackerId]
  );

  useEffect(() => {
    fetchAnalyticsData({ filter: 'thisMonth', year: new Date().getFullYear() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackerId]); // Only depend on trackerId, not fetchAnalyticsData

  return {
    summary,
    categoryData,
    monthlyData,
    paymentMethodData,
    loading,
    error,
    refetch: fetchAnalyticsData,
  };
};
