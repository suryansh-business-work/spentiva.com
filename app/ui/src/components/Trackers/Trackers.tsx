import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Snackbar, Alert, useMediaQuery, useTheme, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Tracker, TrackerFormData } from './types/tracker.types';
import { useTrackers } from './hooks/useTrackers';
import TrackerActionsDrawer from './components/TrackerActionsDrawer';
import CreateEditDialog from './components/CreateEditDialog';
import DeleteDialog from './components/DeleteDialog';
import TrackerListSidebar from './components/TrackerListSidebar';
import TrackerView from '../TrackerView/TrackerView';
import { endpoints } from '../../config/api';
import { getRequest } from '../../utils/http';
import { parseResponseData } from '../../utils/response-parser';

interface MonthlyStats { income: number; expense: number }

const Trackers: React.FC = () => {
  const navigate = useNavigate();
  const { trackerId: activeTrackerId } = useParams<{ trackerId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    trackers, loading, saving, deleting, snackbar,
    createTracker, updateTracker, deleteTracker, closeSnackbar,
  } = useTrackers();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState<Tracker | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTracker, setMenuTracker] = useState<Tracker | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthlyStats, setMonthlyStats] = useState<Record<string, MonthlyStats>>({});
  const [formData, setFormData] = useState<TrackerFormData>({
    name: '', type: 'personal', description: '', currency: 'INR',
  });

  // Fetch monthly stats for all trackers
  useEffect(() => {
    if (!trackers.length) return;
    const fetchStats = async () => {
      const results: Record<string, MonthlyStats> = {};
      await Promise.all(
        trackers.map(async (t) => {
          try {
            const res = await getRequest(endpoints.analytics.summary, {
              trackerId: t.id, filter: 'thisMonth',
            });
            const data = parseResponseData<{ stats?: { totalExpenses?: number; totalIncome?: number } }>(res, {});
            results[t.id] = {
              expense: data?.stats?.totalExpenses || 0,
              income: data?.stats?.totalIncome || 0,
            };
          } catch { /* ignore */ }
        })
      );
      setMonthlyStats(results);
    };
    fetchStats();
  }, [trackers]);

  const handleOpenDialog = useCallback((tracker?: Tracker) => {
    if (tracker) {
      setEditMode(true);
      setSelectedTracker(tracker);
      setFormData({
        name: tracker.name, type: tracker.type,
        description: tracker.description || '', currency: tracker.currency,
      });
    } else {
      setEditMode(false);
      setSelectedTracker(null);
      setFormData({ name: '', type: 'personal', description: '', currency: 'INR' });
    }
    setDialogOpen(true);
  }, []);

  // Listen for Header's create tracker event
  useEffect(() => {
    const handler = () => handleOpenDialog();
    window.addEventListener('createTracker', handler);
    return () => window.removeEventListener('createTracker', handler);
  }, [handleOpenDialog]);

  const filteredTrackers = useMemo(() => {
    if (!searchTerm.trim()) return trackers;
    const term = searchTerm.toLowerCase();
    return trackers.filter(
      t => t.name.toLowerCase().includes(term) ||
        t.type.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term)
    );
  }, [trackers, searchTerm]);

  const handleSave = async () => {
    const success = editMode && selectedTracker
      ? await updateTracker(selectedTracker.id, formData)
      : await createTracker(formData);
    if (success) { setDialogOpen(false); setEditMode(false); setSelectedTracker(null); }
  };

  const handleTrackerClick = (tracker: Tracker) => navigate(`/tracker/${tracker.id}`);

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    return symbols[currency] || currency;
  };

  const sidebarProps = {
    trackers: filteredTrackers, loading, searchTerm, activeTrackerId,
    monthlyStats, onSearchChange: setSearchTerm, onTrackerClick: handleTrackerClick,
  };

  const dialogs = (
    <>
      <TrackerActionsDrawer
        anchorEl={anchorEl}
        tracker={menuTracker}
        onClose={() => { setAnchorEl(null); setMenuTracker(null); }}
        onEdit={() => menuTracker && handleOpenDialog(menuTracker)}
        onDelete={() => { if (menuTracker) { setSelectedTracker(menuTracker); setDeleteDialogOpen(true); } }}
        onSettings={() => menuTracker && navigate(`/tracker/${menuTracker.id}?tab=settings`)}
        onAddToHome={() => { if (menuTracker) window.open(`/tracker/${menuTracker.id}`, '_blank'); }}
        getCurrencySymbol={getCurrencySymbol}
      />
      <CreateEditDialog
        open={dialogOpen}
        editMode={editMode}
        formData={formData}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
        disabled={saving}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        tracker={selectedTracker}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (selectedTracker) {
            const success = await deleteTracker(selectedTracker.id);
            if (success) setDeleteDialogOpen(false);
          }
        }}
        deleting={deleting}
      />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={closeSnackbar}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Box sx={{ height: 'calc(100dvh - 52px)', display: 'flex', flexDirection: 'column' }}>
          {!activeTrackerId ? <TrackerListSidebar {...sidebarProps} /> : <TrackerView />}
        </Box>
        {dialogs}
      </>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 52px)', overflow: 'hidden' }}>
        <Box sx={{
          width: 320, minWidth: 280, maxWidth: 360,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex', flexDirection: 'column', flexShrink: 0,
        }}>
          <TrackerListSidebar {...sidebarProps} />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeTrackerId ? (
            <TrackerView />
          ) : (
            <Box sx={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f0f2f5',
            }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" fontWeight={500}>
                Select a tracker to start
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                Choose a tracker from the sidebar or create a new one
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      {dialogs}
    </>
  );
};

export default Trackers;
