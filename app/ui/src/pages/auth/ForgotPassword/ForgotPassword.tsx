import React from 'react';
import { Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { z } from 'zod';
import ForgotPasswordForm, { type ForgotPasswordValues } from './ForgotPasswordForm';
import { ForgotPasswordMutation } from '../../../graphql/operations/auth';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [forgotPassword] = useMutation(ForgotPasswordMutation);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setError('');
    try {
      await forgotPassword({ variables: { email: values.email } });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your email to receive a reset link
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        {success ? (
          <Box>
            <Typography variant="body2" color="success.main" mb={2}>
              If an account with that email exists, a password reset link has been sent.
            </Typography>
            <MuiLink
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate('/reset-password')}
              sx={{ cursor: 'pointer' }}
            >
              Enter Reset Token
            </MuiLink>
          </Box>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <ForgotPasswordForm register={register} errors={errors} isSubmitting={isSubmitting} />
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer' }}
              >
                Back to Sign In
              </MuiLink>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
