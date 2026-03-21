import React from 'react';
import { Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import LoginForm from './LoginForm';
import { postRequest } from '../../../utils/http';
import { endpoints } from '../../../config/api';
import { setAuthToken } from '../../../utils/localStorage';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

interface LoginValues {
  email: string;
  password: string;
}

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleLogin = async (values: LoginValues) => {
    setError('');
    try {
      const response = await postRequest(endpoints.auth.login, values);
      const data = response?.data;
      if (data?.data?.token) {
        setAuthToken(data.data.token);
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        onLoginSuccess();
      } else {
        setError(data?.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          maxWidth: 420,
          width: '100%',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={0.5}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to Spentiva
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {(formikProps) => (
            <Form>
              <LoginForm {...formikProps} />
            </Form>
          )}
        </Formik>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <MuiLink
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate('/forgot-password')}
            sx={{ cursor: 'pointer' }}
          >
            Forgot Password?
          </MuiLink>
          <MuiLink
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate('/signup')}
            sx={{ cursor: 'pointer' }}
          >
            Create Account
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
