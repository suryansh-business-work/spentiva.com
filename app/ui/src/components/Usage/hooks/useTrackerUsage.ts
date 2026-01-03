import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { getRequest } from '../../../utils/http';
import { parseResponseData } from '../../../utils/response-parser';
import { TrackerStats, TrackerGraphs } from '../../../types/usage';

interface UseTrackerUsageReturn {
  stats: TrackerStats | null;
  graphs: TrackerGraphs | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch tracker-specific usage data
 * @param trackerId - The ID of the tracker to fetch data for
 */
export const useTrackerUsage = (trackerId: string | null): UseTrackerUsageReturn => {
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [graphs, setGraphs] = useState<TrackerGraphs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!trackerId) {
      setStats(null);
      setGraphs(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [statsRes, graphsRes] = await Promise.all([
        getRequest(endpoints.usage.trackerStats(trackerId)),
        getRequest(endpoints.usage.trackerGraphs(trackerId)),
      ]);

      const statsData = parseResponseData<TrackerStats | null>(statsRes, null);
      const graphsData = parseResponseData<TrackerGraphs | null>(graphsRes, null);

      setStats(statsData);
      setGraphs(graphsData);
    } catch (err: any) {
      console.error('Error fetching tracker usage:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load tracker usage');
      setStats(null);
      setGraphs(null);
    } finally {
      setLoading(false);
    }
  }, [trackerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    graphs,
    loading,
    error,
    refetch: fetchData,
  };
};
