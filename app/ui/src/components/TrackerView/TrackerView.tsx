import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Skeleton,
  IconButton,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatInterface from '../ChatInterface/ChatInterface';
import Analytics from '../Analytics/Analytics';
import Transactions from '../Transactions/Transactions';
import SettingsTab from './components/SettingsTab';
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
  const { trackerId } = useParams<{ trackerId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [tracker, setTracker] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  const currentTab = new URLSearchParams(location.search).get('tab') || 'chat';
  const tabValue = Math.max(0, TAB_KEYS.indexOf(currentTab as typeof TAB_KEYS[number]));

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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(`/tracker/${trackerId}?tab=${TAB_KEYS[newValue]}`);
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
          <Typography variant="h6" color="error">Tracker not found</Typography>
        </Paper>
      </Container>
    );
  }

  const accentColor = tracker.type === 'business'
    ? theme.palette.primary.main
    : theme.palette.success.main;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Compact single-row header: back + name + tabs */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: { xs: 42, sm: 46 },
          minHeight: { xs: 42, sm: 46 },
          maxHeight: 48,
          px: { xs: 0.5, sm: 1 },
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={() => navigate('/trackers')}
          size="small"
          sx={{ color: theme.palette.text.secondary, mr: 0.5 }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Typography
          variant="subtitle2"
          noWrap
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            mr: 1,
            maxWidth: { xs: 100, sm: 160 },
          }}
        >
          {tracker.name}
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            flex: 1,
            minHeight: { xs: 42, sm: 46 },
            '& .MuiTab-root': {
              minHeight: { xs: 42, sm: 46 },
              py: 0,
              px: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              fontWeight: 500,
              textTransform: 'none',
              minWidth: 0,
              color: theme.palette.text.secondary,
              '&.Mui-selected': { color: accentColor, fontWeight: 600 },
            },
            '& .MuiTabs-indicator': {
              bgcolor: accentColor,
              height: 2.5,
              borderRadius: '2px 2px 0 0',
            },
            '& .MuiTab-iconWrapper': { fontSize: '1rem', mr: 0.5 },
          }}
        >
          <Tab icon={<ChatIcon />} label="Chat" iconPosition="start" />
          <Tab icon={<DashboardIcon />} label="Dashboard" iconPosition="start" />
          <Tab icon={<ReceiptLongIcon />} label="Transactions" iconPosition="start" />
          <Tab icon={<SettingsIcon />} label="Settings" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab content — each panel scrolls independently */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TabPanel value={tabValue} index={0}>
          <ChatInterface trackerId={trackerId!} />
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
            onDelete={() => window.dispatchEvent(new CustomEvent('deleteTracker', { detail: tracker }))}
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default TrackerView;
