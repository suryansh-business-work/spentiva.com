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
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import ChatInterface from '../ChatInterface/ChatInterface';
import Analytics from '../Analytics/Analytics';
import Transactions from '../Transactions/Transactions';
import { endpoints } from '../../config/api';
import { getRequest } from '../../utils/http';
import { parseResponseData } from '../../utils/response-parser';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tracker-tabpanel-${index}`}
      aria-labelledby={`tracker-tab-${index}`}
      style={{
        height: '100%',
        display: value === index ? 'flex' : 'none',
        flexDirection: 'column',
      }}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const TrackerView: React.FC = () => {
  const { trackerId } = useParams<{ trackerId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [tracker, setTracker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'chat';

  const getTabValue = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 1;
      case 'transactions':
        return 2;
      default:
        return 0;
    }
  };

  const tabValue = getTabValue(currentTab);

  useEffect(() => {
    if (trackerId) {
      loadTracker();
    }
  }, [trackerId]);

  // Handle body overflow for chat tab
  // useEffect(() => {
  //   if (currentTab === 'chat') {
  //     document.body.style.overflowY = 'hidden';
  //   } else {
  //     document.body.style.overflowY = 'auto';
  //   }

  //   return () => {
  //     document.body.style.overflowY = 'auto';
  //   };
  // }, [currentTab]);

  const loadTracker = async () => {
    setLoading(true);
    try {
      const response = await getRequest(endpoints.trackers.byId(trackerId!));
      const data = parseResponseData<any>(response, {});
      const trackerData = data?.tracker || null;
      setTracker(trackerData);
    } catch (error) {
      console.error('Error loading tracker:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const tabs = ['chat', 'dashboard', 'transactions'];
    navigate(`/tracker/${trackerId}?tab=${tabs[newValue]}`);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'INR':
        return '₹';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return currency;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1, mb: 3 }} />
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
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Fixed Header with Tabs */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: 10,
          flexShrink: 0,
          position: 'sticky',
          top: { xs: 0 },
        }}
      >
        {/* Tracker Info Row */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 1.75 }, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
            <IconButton
              onClick={() => navigate('/trackers')}
              size="small"
              sx={{
                mr: 1,
                color: theme.palette.text.secondary,
                '&:hover': {
                  background: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <Box
                sx={{
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  borderRadius: 1,
                  background:
                    tracker.type === 'business'
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                      : `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.primary.contrastText,
                  flexShrink: 0,
                }}
              >
                {tracker.type === 'business' ? (
                  <BusinessIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                ) : (
                  <PersonIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                )}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', sm: '1.05rem' },
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    mb: 0.15,
                  }}
                >
                  {tracker.name}
                </Typography>
                {tracker.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tracker.description}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.75, ml: 2 }}>
              <Chip
                label={tracker.type}
                size="small"
                sx={{
                  backgroundColor:
                    tracker.type === 'business'
                      ? `${theme.palette.primary.main}15`
                      : `${theme.palette.success.main}15`,
                  color:
                    tracker.type === 'business'
                      ? theme.palette.primary.main
                      : theme.palette.success.main,
                  fontWeight: 600,
                  height: { xs: 20, sm: 22 },
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                  textTransform: 'capitalize',
                  border: `1px solid ${tracker.type === 'business' ? `${theme.palette.primary.main}30` : `${theme.palette.success.main}30`}`,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
              <Chip
                label={getCurrencySymbol(tracker.currency)}
                size="small"
                sx={{
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  height: { xs: 20, sm: 22 },
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                  border: `1px solid ${theme.palette.divider}`,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Tabs Row */}
        <Box sx={{ px: { xs: 1, sm: 2 } }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              minHeight: { xs: 40, sm: 44 },
              '& .MuiTab-root': {
                minHeight: { xs: 40, sm: 44 },
                py: { xs: 0.75, sm: 1 },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                fontWeight: 500,
                color: theme.palette.text.secondary,
                textTransform: 'none',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color:
                    tracker.type === 'business'
                      ? theme.palette.primary.main
                      : theme.palette.success.main,
                  fontWeight: 600,
                },
                '&:hover': {
                  color: theme.palette.text.primary,
                  background: theme.palette.action.hover,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor:
                  tracker.type === 'business'
                    ? theme.palette.primary.main
                    : theme.palette.success.main,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-iconWrapper': {
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                marginRight: { xs: 0.5, sm: 0.75 },
              },
            }}
          >
            <Tab icon={<ChatIcon />} label="Chat" iconPosition="start" />
            <Tab icon={<DashboardIcon />} label="Dashboard" iconPosition="start" />
            <Tab icon={<ReceiptLongIcon />} label="Transactions" iconPosition="start" />
          </Tabs>
        </Box>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
          bgcolor: theme.palette.background.default,
        }}
      >
        <TabPanel value={tabValue} index={0}>
          <ChatInterface trackerId={trackerId!} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Analytics trackerId={trackerId!} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Transactions trackerId={trackerId!} />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default TrackerView;
