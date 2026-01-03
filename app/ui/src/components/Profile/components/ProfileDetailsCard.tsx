import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Grow,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ProfileDetailsCardProps {
  user: any;
  loading: boolean;
  verificationLoading: boolean;
  message: string;
  error: string;
  verificationSuccess: string;
  verificationError: string;
  onUpdateProfile: (name: string) => Promise<boolean>;
  onClearMessages: () => void;
  onVerifyEmail: () => void;
  onResendOtp: () => void;
  onClearVerificationMessages: () => void;
}

const ProfileDetailsCard: React.FC<ProfileDetailsCardProps> = ({
  user,
  loading,
  verificationLoading,
  message,
  error,
  verificationSuccess,
  verificationError,
  onUpdateProfile,
  onClearMessages,
  onVerifyEmail,
  onResendOtp,
  onClearVerificationMessages,
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  // Memoize initial values to prevent infinite re-renders with enableReinitialize
  const initialValues = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
    }),
    [user?.name, user?.email]
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async values => {
      const success = await onUpdateProfile(values.name);
      if (success) {
        setIsEditing(false);
      }
    },
  });

  return (
    <Grow in={true} timeout={800}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Profile Information
            </Typography>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: theme.palette.primary.main,
                '&:hover': {
                  background: theme.palette.action.hover,
                },
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Box>

          {/* Messages */}
          {message && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={onClearMessages}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={onClearMessages}>
              {error}
            </Alert>
          )}

          {/* Verification Messages */}
          {verificationSuccess && (
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={onClearVerificationMessages}
            >
              {verificationSuccess}
            </Alert>
          )}

          {verificationError && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={onClearVerificationMessages}
            >
              {verificationError}
            </Alert>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {/* Name Field */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  mb: 1,
                  display: 'block',
                }}
              >
                Full Name
              </Typography>
              <TextField
                fullWidth
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                disabled={!isEditing || loading}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: theme.palette.text.disabled, mr: 1.5 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: isEditing ? theme.palette.background.paper : '#F9FAFB',
                    '& fieldset': {
                      borderColor: theme.palette.divider,
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Box>

            {/* Email Field with Verification */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  mb: 1,
                  display: 'block',
                }}
              >
                Email Address
              </Typography>
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={true}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: theme.palette.text.disabled, mr: 1.5 }} />
                  ),
                  endAdornment: user?.emailVerified ? (
                    <Chip
                      icon={<CheckCircleIcon style={{ color: '#10b981' }} />}
                      label="Verified"
                      size="small"
                      sx={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        fontWeight: 600,
                        border: 'none',
                      }}
                    />
                  ) : (
                    <Chip
                      label="Unverified"
                      size="small"
                      sx={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        fontWeight: 600,
                        border: 'none',
                      }}
                    />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#F9FAFB',
                    '& fieldset': {
                      borderColor: theme.palette.divider,
                    },
                  },
                }}
              />

              {/* Verification Info/Button */}
              {!user?.emailVerified ? (
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                      Please verify your email address
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={onVerifyEmail}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          background: theme.palette.action.hover,
                        },
                      }}
                    >
                      Verify OTP
                    </Button>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'block',
                    }}
                  >
                    Didn't receive the email?{' '}
                    <Button
                      size="small"
                      onClick={onResendOtp}
                      disabled={verificationLoading}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: 'auto',
                        p: 0,
                        verticalAlign: 'baseline',
                        color: verificationLoading
                          ? theme.palette.text.disabled
                          : theme.palette.primary.main,
                        textDecoration: 'underline',
                        '&:hover': {
                          background: 'transparent',
                          textDecoration: 'underline',
                          color: verificationLoading
                            ? theme.palette.text.disabled
                            : theme.palette.primary.dark,
                        },
                      }}
                    >
                      {verificationLoading ? (
                        <>
                          <CircularProgress size={12} sx={{ mr: 0.5 }} />
                          Sending...
                        </>
                      ) : (
                        'Resend OTP'
                      )}
                    </Button>
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.disabled, mt: 0.5, display: 'block' }}
                >
                  Email cannot be changed directly. Contact support for assistance.
                </Typography>
              )}
            </Box>

            {/* Action Buttons */}
            {isEditing && (
              <Grow in={true}>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    sx={{
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.25,
                      borderRadius: 2,
                      borderColor: '#D1D5DB',
                      color: '#374151',
                      '&:hover': {
                        borderColor: theme.palette.text.disabled,
                        background: '#F9FAFB',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !formik.isValid}
                    sx={{
                      flex: 1,
                      background: theme.palette.primary.main,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.25,
                      borderRadius: 2,
                      boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
                      '&:hover': {
                        background: theme.palette.primary.dark,
                        boxShadow: '0 4px 8px rgba(22, 163, 74, 0.3)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: theme.palette.background.paper }} />
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </Box>
              </Grow>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default ProfileDetailsCard;
