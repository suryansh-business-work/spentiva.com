import React, { useState } from 'react';
import Logo from '../Logo/Logo';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Fade,
  Skeleton,
  InputAdornment,
} from '@mui/material';
import { Email as EmailIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { endpoints } from '../../config/api';
import { postRequest } from '../../utils/http';
import { parseResponseData } from '../../utils/response-parser';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await postRequest(endpoints.auth.forgotPassword, { email });

      const data = parseResponseData<any>(response, null);
      if (data && data.success !== false) {
        setSuccess(true);

        // Redirect to reset password after 2 seconds
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setError(data?.message || 'Failed to send reset code. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset code. Please try again.');
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

            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/login')}
              sx={{
                mb: 4,
                color: '#6B7280',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { color: '#111827', bgcolor: 'transparent' },
              }}
            >
              Back to log in
            </Button>

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
                Forgot password?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#6B7280',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              >
                No worries, we'll send you reset instructions.
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
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    alignItems: 'center',
                  }}
                >
                  Reset code sent! Redirecting...
                </Alert>
              </Fade>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSendOTP} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Email Field */}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="email"
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
                      Email
                    </Typography>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={loading || success}
                      autoFocus
                      autoComplete="email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
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
                    disabled={loading || !email || success}
                    sx={{
                      py: 1.75,
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
                    {loading ? 'Sending code...' : 'Send reset code'}
                  </Button>
                )}
              </Box>
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
              'url(https://images.pexels.com/photos/6608880/pexels-photo-6608880.jpeg)',
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
                Secure your financial data.
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
                We prioritize the security of your account and information above all else.
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
