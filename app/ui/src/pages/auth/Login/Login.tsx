import React from 'react';
import { Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import LoginForm from './LoginForm';
import { loginSchema, type LoginValues } from './login.schema';
import { LoginMutation } from '../../../graphql/operations/auth';
import { setAuthToken } from '../../../utils/localStorage';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [login] = useMutation(LoginMutation);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    setError('');
    try {
      const { data } = await login({ variables: { input: values } });
      if (data?.login?.token) {
        setAuthToken(data.login.token);
        localStorage.setItem('user', JSON.stringify(data.login.user));
        onLoginSuccess();
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
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

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <LoginForm register={register} errors={errors} isSubmitting={isSubmitting} />
        </form>

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
