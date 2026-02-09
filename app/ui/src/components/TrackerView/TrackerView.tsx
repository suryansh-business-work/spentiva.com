import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Skeleton } from '@mui/material';
import ChatInterface from '../ChatInterface/ChatInterface';
import Analytics from '../Analytics/Analytics';
import Transactions from '../Transactions/Transactions';
import SettingsTab from './components/SettingsTab';
import TrackerHeader from './components/TrackerHeader';
import { endpoints } from '../../config/api';
import { getRequest } from '../../utils/http';
import { parseResponseData } from '../../utils/response-parser';

const TAB_KEYS = ['chat', 'dashboard', 'transactions', 'settings'] as const;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    style={{ height: '100%', display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
  >
    {value === index && children}
  </div>
);

const TrackerView: React.FC = () => {
  const { trackerId, tab } = useParams<{ trackerId: string; tab?: string }>();
  const navigate = useNavigate();
  const [tracker, setTracker] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  const currentTab = tab || 'chat';
  const tabValue = Math.max(0, TAB_KEYS.indexOf(currentTab as (typeof TAB_KEYS)[number]));

  useEffect(() => {
    if (trackerId) loadTracker();
  }, [trackerId]);

  const loadTracker = async () => {
    setLoading(true);
    try {
      const response = await getRequest(endpoints.trackers.byId(trackerId!));
      const data = parseResponseData<Record<string, any>>(response, {});
      setTracker(data?.tracker || null);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newValue: number) => {
    // Index 4 = "Share" shortcut from mobile menu → open settings with Share sub-tab
    if (newValue === 4) {
      navigate(`/tracker/${trackerId}/settings/share`);
      return;
    }
    navigate(`/tracker/${trackerId}/${TAB_KEYS[newValue]}`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1, mb: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
      </Container>
    );
  }

  if (!tracker) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Tracker not found
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <TrackerHeader
        trackerName={tracker.name}
        trackerType={tracker.type}
        tabValue={tabValue}
        onTabChange={handleTabChange}
        onBack={() => navigate('/trackers')}
      />

      {/* Tab content — each panel scrolls independently */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TabPanel value={tabValue} index={0}>
          <ChatInterface
            trackerId={trackerId!}
            botImage={tracker?.botImage}
            botName={tracker?.name}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Analytics trackerId={trackerId!} currency={tracker?.currency} />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Transactions trackerId={trackerId!} />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <SettingsTab
            trackerId={trackerId!}
            tracker={tracker as any}
            onEdit={() => window.dispatchEvent(new CustomEvent('editTracker', { detail: tracker }))}
            onDelete={() =>
              window.dispatchEvent(new CustomEvent('deleteTracker', { detail: tracker }))
            }
            onBotImageChange={(url: string) => {
              setTracker(prev => (prev ? { ...prev, botImage: url } : prev));
            }}
            onSharedUsersChange={users => {
              setTracker(prev => (prev ? { ...prev, sharedWith: users } : prev));
            }}
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default TrackerView;
