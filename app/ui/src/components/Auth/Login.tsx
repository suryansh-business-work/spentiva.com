import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { endpoints } from '../../config/api';
import { postRequest } from '../../utils/http';
import { parseResponseData } from '../../utils/response-parser';
import Logo from '../Logo/Logo';

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      setLoading(true);
      setError('');

      try {
        const response = await postRequest(endpoints.auth.login, {
          email: values.email,
          password: values.password,
        });

        const data = parseResponseData<any>(response, null);
        if (data && data.token && data.user) {
          const { token, user } = data;

          // Save user information to localStorage
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));

          // Update auth context
          login(token, user);

          // Redirect to trackers page
          navigate('/trackers');
        } else {
          setError(data?.message || 'Login failed');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

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
                Welcome back
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#6B7280',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              >
                Please enter your details to sign in.
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

            {/* Form */}
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
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
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      disabled={loading}
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
                        '& .MuiFormHelperText-root': {
                          mx: 0,
                          mt: 0.75,
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Password Field */}
                {loading ? (
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="password"
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
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                      disabled={loading}
                      autoComplete="current-password"
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
                        '& .MuiFormHelperText-root': {
                          mx: 0,
                          mt: 0.75,
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Forgot Password */}
                <Box sx={{ textAlign: 'right', mt: -1 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    sx={{
                      color: '#16a34a',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontFamily: 'inherit',
                      '&:hover': {
                        color: '#15803d',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                {/* Submit Button */}
                {loading ? (
                  <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading || !formik.isValid}
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
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#6B7280', fontFamily: 'inherit' }}>
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/signup"
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
                  Sign up for free
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
                Manage your expenses with confidence.
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
                Join thousands of businesses that trust Spentiva for their financial tracking needs.
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
