import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { getRequest, deleteRequest } from '../../../utils/http';
import { parseResponseData, parseResponseMessage } from '../../../utils/response-parser';
import { UsageLog, UsageLogsResponse } from '../../../types/usage';

interface UseUsageLogsParams {
  trackerId?: string;
  limit?: number;
  offset?: number;
  autoFetch?: boolean;
}

interface UseUsageLogsReturn {
  logs: UsageLog[];
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  deletingTracker: boolean;
  deletingAll: boolean;
  fetchLogs: (params?: { trackerId?: string; limit?: number; offset?: number }) => Promise<void>;
  deleteTrackerLogs: (
    trackerId: string
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  deleteAllUserLogs: () => Promise<{ success: boolean; data?: any; message?: string }>;
}

/**
 * Custom hook to manage usage logs with pagination
 */
export const useUsageLogs = (params: UseUsageLogsParams = {}): UseUsageLogsReturn => {
  const { trackerId, limit = 50, offset = 0, autoFetch = true } = params;

  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [deletingTracker, setDeletingTracker] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const fetchLogs = useCallback(
    async (fetchParams?: { trackerId?: string; limit?: number; offset?: number }) => {
      setLoading(true);
      setError(null);

      const queryParams: Record<string, string> = {};

      const finalTrackerId = fetchParams?.trackerId || trackerId;
      const finalLimit = fetchParams?.limit || limit;
      const finalOffset = fetchParams?.offset || offset;

      if (finalTrackerId) queryParams.trackerId = finalTrackerId;
      if (finalLimit) queryParams.limit = finalLimit.toString();
      if (finalOffset) queryParams.offset = finalOffset.toString();

      try {
        const response = await getRequest(endpoints.usageLogs.getAll, queryParams);
        const data = parseResponseData<UsageLogsResponse>(response, {
          logs: [],
          totalCount: 0,
          limit: finalLimit,
          offset: finalOffset,
          hasMore: false,
        });

        setLogs(data?.logs ?? []);
        setTotalCount(data?.totalCount ?? 0);
        setHasMore(data?.hasMore ?? false);
      } catch (err: any) {
        console.error('Error fetching usage logs:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load usage logs');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    },
    [trackerId, limit, offset]
  );

  const deleteTrackerLogs = useCallback(async (trackerId: string) => {
    setDeletingTracker(true);
    try {
      const response = await deleteRequest(endpoints.usageLogs.deleteByTracker(trackerId));

      return {
        success: true,
        data: parseResponseData<any>(response, null),
        message: parseResponseMessage(response, 'Tracker logs deleted successfully'),
      };
    } catch (err: any) {
      console.error('Error deleting tracker logs:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete tracker logs',
      };
    } finally {
      setDeletingTracker(false);
    }
  }, []);

  const deleteAllUserLogs = useCallback(async () => {
    setDeletingAll(true);
    try {
      const response = await deleteRequest(endpoints.usageLogs.deleteAllUser);

      return {
        success: true,
        data: parseResponseData<any>(response, null),
        message: parseResponseMessage(response, 'All user logs deleted successfully'),
      };
    } catch (err: any) {
      console.error('Error deleting all user logs:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete all user logs',
      };
    } finally {
      setDeletingAll(false);
    }
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    logs,
    totalCount,
    hasMore,
    loading,
    error,
    deletingTracker,
    deletingAll,
    fetchLogs,
    deleteTrackerLogs,
    deleteAllUserLogs,
  };
};
