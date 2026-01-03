import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { getRequest } from '../../../utils/http';
import { parseResponseData } from '../../../utils/response-parser';
import { UsageOverview } from '../../../types/usage';

interface UseUsageOverviewReturn {
  data: UsageOverview | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch overall usage overview
 */
export const useUsageOverview = (): UseUsageOverviewReturn => {
  const [data, setData] = useState<UsageOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRequest(endpoints.usage.overview);
      const usageData = parseResponseData<UsageOverview | null>(response, null);

      // Validate data structure
      if (!usageData || !usageData.overall) {
        setData({
          overall: {
            totalMessages: 0,
            totalTokens: 0,
            userMessages: 0,
            aiMessages: 0,
          },
          byTracker: [],
          recentActivity: [],
        });
      } else {
        setData(usageData);
      }
    } catch (err: any) {
      console.error('Error fetching usage overview:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load usage overview');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
