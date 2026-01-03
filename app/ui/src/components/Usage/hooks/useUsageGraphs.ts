import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { getRequest } from '../../../utils/http';
import { parseResponseData } from '../../../utils/response-parser';
import { UsageGraphs } from '../../../types/usage';

interface UseUsageGraphsReturn {
  data: UsageGraphs | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch usage graphs data
 */
export const useUsageGraphs = (): UseUsageGraphsReturn => {
  const [data, setData] = useState<UsageGraphs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRequest(endpoints.usage.graphs);
      const graphsData = parseResponseData<UsageGraphs>(response, {
        dailyUsage: [],
        byTrackerType: [],
      });

      setData(graphsData || { dailyUsage: [], byTrackerType: [] });
    } catch (err: any) {
      console.error('Error fetching usage graphs:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load usage graphs');
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
