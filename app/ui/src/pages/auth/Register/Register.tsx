import React from 'react';
import { Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import RegisterForm from './RegisterForm';
import { registerSchema, type RegisterValues } from './register.schema';
import { RegisterMutation } from '../../../graphql/operations/auth';
import { setAuthToken } from '../../../utils/localStorage';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [registerUser] = useMutation(RegisterMutation);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterValues) => {
    setError('');
    try {
      const { data } = await registerUser({
        variables: {
          input: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          },
        },
      });
      if (data?.register?.token) {
        setAuthToken(data.register.token);
        localStorage.setItem('user', JSON.stringify(data.register.user));
        onRegisterSuccess();
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Join Spentiva today
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <RegisterForm register={register} errors={errors} isSubmitting={isSubmitting} />
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <MuiLink
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate('/login')}
            sx={{ cursor: 'pointer' }}
          >
            Already have an account? Sign In
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
