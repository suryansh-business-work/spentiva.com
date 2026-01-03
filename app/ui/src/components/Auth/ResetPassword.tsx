import React, { useState } from 'react';
import Logo from '../Logo/Logo';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Fade,
  Skeleton,
  InputAdornment,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { endpoints } from '../../config/api';
import { postRequest } from '../../utils/http';
import { parseResponseData } from '../../utils/response-parser';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 40) return '#ef4444'; // red
    if (strength < 70) return '#f59e0b'; // orange
    return '#16a34a'; // green
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const strength = passwordStrength(newPassword);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Email is missing. Please restart the process.');
      return;
    }

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await postRequest(endpoints.auth.resetPassword, {
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      const data = parseResponseData<any>(response, null);
      if (data && data.success !== false) {
        setSuccess(true);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data?.message || 'Failed to reset password. Please check your OTP.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        background: '#ffffff',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }}
    >
      {/* Left Side - Form */}
      <Box
        sx={{
          flex: { xs: '1 1 100%', md: '0 0 500px', lg: '0 0 580px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, sm: 6, md: 8 },
          background: '#ffffff',
          overflowY: 'auto',
          height: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Fade in={true} timeout={600}>
          <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
            {/* Logo */}
            <Logo variant="full" showSubtitle={true} />

            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#111827',
                  mb: 1,
                  letterSpacing: '-0.02em',
                  fontFamily: 'inherit',
                }}
              >
                Reset password
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#6B7280',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              >
                Enter the code sent to {email} and create a new password.
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in={true}>
                <Alert
                  severity="error"
                  onClose={() => setError('')}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    alignItems: 'center',
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Success Alert */}
            {success && (
              <Fade in={true}>
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon />}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    alignItems: 'center',
                  }}
                >
                  Password reset successfully! Redirecting to login...
                </Alert>
              </Fade>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleResetPassword} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* OTP Field */}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="otp"
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.75,
                        fontWeight: 600,
                        color: '#111827',
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                      }}
                    >
                      Verification Code
                    </Typography>
                    <TextField
                      fullWidth
                      id="otp"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 6) setOtp(value);
                      }}
                      disabled={loading || success}
                      autoFocus
                      autoComplete="one-time-code"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKeyIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        maxLength: 6,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        style: { letterSpacing: '0.2em', fontWeight: 600 },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#D1D5DB',
                            borderWidth: '1.5px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#9CA3AF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16a34a',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 1.75,
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          color: '#111827',
                        },
                      }}
                    />
                  </Box>
                )}

                {/* New Password Field */}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="newPassword"
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.75,
                        fontWeight: 600,
                        color: '#111827',
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                      }}
                    >
                      New Password
                    </Typography>
                    <TextField
                      fullWidth
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      disabled={loading || success}
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={e => e.preventDefault()}
                              edge="end"
                              disabled={loading}
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#D1D5DB',
                            borderWidth: '1.5px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#9CA3AF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16a34a',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 1.75,
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          color: '#111827',
                        },
                      }}
                    />

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: '#6B7280', fontSize: '0.75rem' }}
                          >
                            Strength
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: getStrengthColor(strength),
                              fontSize: '0.75rem',
                            }}
                          >
                            {getStrengthLabel(strength)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={strength}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: '#E5E7EB',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getStrengthColor(strength),
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}

                {/* Confirm Password Field */}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="confirmPassword"
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.75,
                        fontWeight: 600,
                        color: '#111827',
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                      }}
                    >
                      Confirm Password
                    </Typography>
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      disabled={loading || success}
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              onMouseDown={e => e.preventDefault()}
                              edge="end"
                              disabled={loading}
                              size="small"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#D1D5DB',
                            borderWidth: '1.5px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#9CA3AF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16a34a',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 1.75,
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          color: '#111827',
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Submit Button */}
                {loading ? (
                  <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={
                      loading ||
                      !otp ||
                      otp.length !== 6 ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      success
                    }
                    sx={{
                      py: 1.75,
                      mt: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      bgcolor: '#16a34a',
                      color: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
                      '&:hover': {
                        bgcolor: '#15803d',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
                      },
                      '&:active': {
                        bgcolor: '#166534',
                      },
                      '&:disabled': {
                        bgcolor: '#E5E7EB',
                        color: '#9CA3AF',
                      },
                    }}
                  >
                    {loading ? 'Resetting password...' : 'Reset password'}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#6B7280', fontFamily: 'inherit' }}>
                Remember your password?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#16a34a',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'inherit',
                    '&:hover': {
                      color: '#15803d',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* Right Side - Image */}
      <Box
        sx={{
          flex: '1 1 auto',
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'url(https://images.pexels.com/photos/6347546/pexels-photo-6347546.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
            },
          }}
        />

        {/* Overlay Content */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 8,
            zIndex: 2,
            color: 'white',
          }}
        >
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  letterSpacing: '-0.02em',
                  fontFamily: 'inherit',
                  textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  color: '#ffffff',
                }}
              >
                Reset and recover.
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.95)',
                  fontFamily: 'inherit',
                  maxWidth: '600px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}
              >
                Get back to managing your finances with a secure new password.
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
