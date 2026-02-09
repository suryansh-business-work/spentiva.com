import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  useTheme,
  Paper,
  Button,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import Lottie from 'lottie-react';
import EmailIcon from '@mui/icons-material/Email';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ActivePlanDisplay from '../components/Billing/ActivePlanDisplay';
import PlanBox from '../components/Billing/PlanBox';
import DowngradeWarningDialog from '../components/Billing/DowngradeWarningDialog';
import PaymentDialog from '../components/Billing/PaymentDialog';
import PaymentHistory from '../components/Billing/PaymentHistory';
import SupportDialog from '../components/Support/SupportDialog';
import { endpoints } from '../config/api';
import { getRequest } from '../utils/http';
import { parseResponseData } from '../utils/response-parser';
import { useAuth } from '../contexts/AuthContext';
import { type PlanType } from '../config/planConfig';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const Billing: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [trackerCount, setTrackerCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingAnim, setLoadingAnim] = useState<any>(null);

  // Dialog states
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  useEffect(() => {
    fetch('/animations/payment_animation.json')
      .then(res => res.json())
      .then(data => setLoadingAnim(data))
      .catch(err => console.error('Error loading animation:', err));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Use user from AuthContext — auth server doesn't return accountType, derive from role
      const accountType: PlanType = user?.roleSlug === 'admin' ? 'businesspro' : 'free';
      setCurrentPlan(accountType);

      // Fetch trackers
      try {
        const trackersResponse = await getRequest(endpoints.trackers.getAll);
        const data = parseResponseData<{ trackers?: Array<Record<string, unknown>> }>(
          trackersResponse,
          {}
        );
        const trackers = data?.trackers || [];
        setTrackerCount(Array.isArray(trackers) ? trackers.length : 0);
      } catch {
        setTrackerCount(0);
      }

      // Fetch messages
      try {
        const usageResponse = await getRequest(endpoints.usage.overview);
        const usageData = parseResponseData<Record<string, any>>(usageResponse, {});
        const messages = usageData?.overall?.totalMessages || usageData?.totalMessages || 0;
        setMessageCount(messages);
      } catch {
        setMessageCount(0);
      }
    } catch {
      /* top-level fallback */
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: PlanType) => {
    if (plan === 'free') return;
    setSelectedPlan(plan);
    setPaymentDialogOpen(true);
  };

  const handleDowngrade = (plan: PlanType) => {
    setSelectedPlan(plan);
    setDowngradeDialogOpen(true);
  };

  const confirmDowngrade = () => {
    console.log('Downgrading to:', selectedPlan);
    setDowngradeDialogOpen(false);
    setSelectedPlan(null);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        {loadingAnim && (
          <Lottie animationData={loadingAnim} loop style={{ width: 300, height: 300 }} />
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.success.light} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Billing & Subscription
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your plan, upgrade or view payment history
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <Tab
            icon={<AccountBoxIcon />}
            iconPosition="start"
            label="Your Plan"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<CreditCardIcon />}
            iconPosition="start"
            label="Plans"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<ReceiptIcon />}
            iconPosition="start"
            label="Payment Logs"
            sx={{ fontWeight: 600 }}
          />
        </Tabs>

        {/* Tab Panels */}
        <Box sx={{ p: 3 }}>
          {/* Tab 1: Your Plan */}
          <TabPanel value={currentTab} index={0}>
            <ActivePlanDisplay
              plan={currentPlan}
              trackerCount={trackerCount}
              messageCount={messageCount}
            />
          </TabPanel>

          {/* Tab 2: Plans */}
          <TabPanel value={currentTab} index={1}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <PlanBox
                  plan="free"
                  currentPlan={currentPlan}
                  onUpgrade={handleUpgrade}
                  onDowngrade={handleDowngrade}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <PlanBox
                  plan="pro"
                  currentPlan={currentPlan}
                  onUpgrade={handleUpgrade}
                  onDowngrade={handleDowngrade}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <PlanBox
                  plan="businesspro"
                  currentPlan={currentPlan}
                  onUpgrade={handleUpgrade}
                  onDowngrade={handleDowngrade}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Payment Logs */}
          <TabPanel value={currentTab} index={2}>
            {user?.id ? (
              <PaymentHistory userId={user.id} />
            ) : (
              <Typography color="text.secondary" textAlign="center" py={4}>
                Please log in to view payment history
              </Typography>
            )}
          </TabPanel>
        </Box>
      </Paper>

      {/* Support Section */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(46,125,50,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(25,118,210,0.03) 0%, rgba(46,125,50,0.03) 100%)',
        }}
      >
        <SupportAgentIcon
          sx={{
            fontSize: 48,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Need Help?
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
        >
          Our support team is here to assist you with any questions about billing, features, or
          technical issues.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              support@spentiva.com
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          size="large"
          onClick={() => setSupportDialogOpen(true)}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 700,
            borderRadius: 2,
          }}
        >
          Contact Support
        </Button>
      </Paper>

      {/* Dialogs */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => {
          setPaymentDialogOpen(false);
          setSelectedPlan(null);
        }}
        selectedPlan={selectedPlan}
      />
      <DowngradeWarningDialog
        open={downgradeDialogOpen}
        targetPlan={selectedPlan}
        onConfirm={confirmDowngrade}
        onCancel={() => {
          setDowngradeDialogOpen(false);
          setSelectedPlan(null);
        }}
      />
      <SupportDialog open={supportDialogOpen} onClose={() => setSupportDialogOpen(false)} />
    </Container>
  );
};

export default Billing;
