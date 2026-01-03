import React, { useState, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  Chip,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';
import { useProfileUpdate } from './hooks/useProfileUpdate';
import { useEmailVerification } from './hooks/useEmailVerification';
import EmailVerificationDialog from './components/EmailVerificationDialog';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const Profile: React.FC = () => {
  const { user, updateUser, token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [name, setName] = useState(user?.name || '');
  const [emailSettings, setEmailSettings] = useState({
    daily: true,
    weekly: true,
    monthly: false,
    promotional: false,
    productUpdates: true,
    securityAlerts: true,
  });

  const {
    loading: updateLoading,
    error: updateError,
    message: updateMessage,
    getPhotoUrl,
    updateProfile,
    uploadPhoto,
    clearMessages: _clearUpdateMessages,
  } = useProfileUpdate(user, updateUser, token);

  const handleVerificationSuccess = useCallback(async () => {
    if (user) {
      const updatedUser: User = { ...user, emailVerified: true };
      updateUser(updatedUser);
    }
  }, [user, updateUser]);

  const {
    loading: verificationLoading,
    error: verificationError,
    success: verificationSuccess,
    isDialogOpen,
    otpSent,
    countdown,
    sendVerificationOtp,
    verifyEmail,
    openDialog,
    closeDialog,
    clearMessages: clearVerificationMessages,
  } = useEmailVerification(user?.email || '', handleVerificationSuccess);

  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await uploadPhoto(file);
  };

  const handleUpdateProfile = async () => {
    if (name !== user?.name) {
      await updateProfile(name);
    }
  };

  const handleEmailSettingChange = (setting: keyof typeof emailSettings) => {
    setEmailSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSaveEmailSettings = () => {
    console.log('Email settings saved:', emailSettings);
    // TODO: Implement API call to save email settings
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={800} mb={4}>
          My Profile
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Vertical Tabs */}
          <Paper
            elevation={0}
            sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
          >
            <Tabs
              orientation={isMobile ? 'horizontal' : 'vertical'}
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                borderRight: isMobile ? 0 : 1,
                borderColor: 'divider',
                minWidth: isMobile ? '100%' : 200,
              }}
            >
              <Tab
                icon={<PersonIcon />}
                label="Personal Info"
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', minHeight: 60 }}
              />
              <Tab
                icon={<EmailIcon />}
                label="Email Settings"
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', minHeight: 60 }}
              />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Paper
            elevation={0}
            sx={{ flex: 1, p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
          >
            {/* Personal Information Tab */}
            {activeTab === 0 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Personal Information
                </Typography>

                {/* Profile Photo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={getPhotoUrl()}
                      sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        bgcolor: theme.palette.primary.main,
                        color: '#fff',
                        '&:hover': { bgcolor: theme.palette.primary.dark },
                      }}
                      size="small"
                    >
                      <PhotoCameraIcon fontSize="small" />
                      <input hidden accept="image/*" type="file" onChange={handlePhotoChange} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Name */}
                <TextField
                  label="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                />

                {/* Email with Verification */}
                <Box>
                  <TextField label="Email" value={user?.email} fullWidth disabled />
                  {!user?.emailVerified && (
                    <Button size="small" onClick={openDialog} sx={{ mt: 1 }}>
                      Verify Email
                    </Button>
                  )}
                  {user?.emailVerified && (
                    <Chip label="Verified" color="success" size="small" sx={{ mt: 1 }} />
                  )}
                </Box>

                {updateMessage && <Alert severity="success">{updateMessage}</Alert>}
                {updateError && <Alert severity="error">{updateError}</Alert>}

                <Button
                  variant="contained"
                  onClick={handleUpdateProfile}
                  disabled={updateLoading || name === user?.name}
                >
                  Save Changes
                </Button>
              </Stack>
            )}

            {/* Email Subscription Settings Tab */}
            {activeTab === 1 && (
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Email Subscription Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage which emails you'd like to receive from Spentiva
                </Typography>

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.daily}
                        onChange={() => handleEmailSettingChange('daily')}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Daily Digest
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Get a daily summary of your expenses
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.weekly}
                        onChange={() => handleEmailSettingChange('weekly')}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Weekly Summary
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Receive weekly spending reports
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.monthly}
                        onChange={() => handleEmailSettingChange('monthly')}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Monthly Reports
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Monthly financial insights
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.promotional}
                        onChange={() => handleEmailSettingChange('promotional')}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Promotional Emails
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Special offers and discounts
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.productUpdates}
                        onChange={() => handleEmailSettingChange('productUpdates')}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Product Updates
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          New features and improvements
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailSettings.securityAlerts}
                        onChange={() => handleEmailSettingChange('securityAlerts')}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          Security Alerts
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Important security notifications (recommended)
                        </Typography>
                      </Box>
                    }
                  />
                </FormGroup>

                <Button variant="contained" onClick={handleSaveEmailSettings}>
                  Save Email Preferences
                </Button>
              </Stack>
            )}
          </Paper>
        </Box>
      </Container>

      <EmailVerificationDialog
        open={isDialogOpen}
        email={user?.email || ''}
        loading={verificationLoading}
        error={verificationError}
        success={verificationSuccess}
        otpSent={otpSent}
        countdown={countdown}
        onClose={closeDialog}
        onSendOtp={sendVerificationOtp}
        onVerify={verifyEmail}
        onClearMessages={clearVerificationMessages}
      />
    </Box>
  );
};

export default Profile;
