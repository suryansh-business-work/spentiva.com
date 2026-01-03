import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../../utils/http';
import { parseResponseData } from '../../../utils/response-parser';
import { Tracker, TrackerFormData, SnackbarState } from '../types/tracker.types';

/**
 * useTrackers Hook
 * Manages tracker state and operations
 */
export const useTrackers = () => {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadTrackers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRequest(endpoints.trackers.getAll);
      const data = parseResponseData<any>(response, {});
      const trackersData = data?.trackers || [];
      setTrackers(trackersData);
    } catch (error) {
      console.error('Error loading trackers:', error);
      setSnackbar({ open: true, message: 'Failed to load trackers', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const createTracker = useCallback(
    async (formData: TrackerFormData) => {
      setSaving(true);
      try {
        await postRequest(endpoints.trackers.create, formData);
        setSnackbar({ open: true, message: 'Tracker created successfully', severity: 'success' });
        await loadTrackers();
        return true;
      } catch (error) {
        console.error('Error creating tracker:', error);
        setSnackbar({ open: true, message: 'Failed to create tracker', severity: 'error' });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [loadTrackers]
  );

  const updateTracker = useCallback(
    async (id: string, formData: TrackerFormData) => {
      setSaving(true);
      try {
        await putRequest(endpoints.trackers.update(id), formData);
        setSnackbar({ open: true, message: 'Tracker updated successfully', severity: 'success' });
        await loadTrackers();
        return true;
      } catch (error) {
        console.error('Error updating tracker:', error);
        setSnackbar({ open: true, message: 'Failed to update tracker', severity: 'error' });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [loadTrackers]
  );

  const deleteTracker = useCallback(
    async (id: string) => {
      setDeleting(true);
      try {
        await deleteRequest(endpoints.trackers.delete(id));
        setSnackbar({ open: true, message: 'Tracker deleted successfully', severity: 'success' });
        await loadTrackers();
        return true;
      } catch (error) {
        console.error('Error deleting tracker:', error);
        setSnackbar({ open: true, message: 'Failed to delete tracker', severity: 'error' });
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [loadTrackers]
  );

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    loadTrackers();
  }, [loadTrackers]);

  return {
    trackers,
    loading,
    saving,
    deleting,
    snackbar,
    loadTrackers,
    createTracker,
    updateTracker,
    deleteTracker,
    closeSnackbar,
  };
};
