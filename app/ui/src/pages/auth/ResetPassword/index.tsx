import React from 'react';
import { Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import ResetPasswordForm from './ResetPasswordForm';
import { resetPasswordSchema, type ResetPasswordValues } from './reset-password.schema';
import { ResetPasswordMutation } from '../../../graphql/operations/auth';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [resetPassword] = useMutation(ResetPasswordMutation);

  const tokenFromUrl = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: tokenFromUrl, password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    setError('');
    try {
      await resetPassword({ variables: { token: values.token, password: values.password } });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
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
          Enter your reset token and new password
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        {success ? (
          <Box>
            <Typography variant="body2" color="success.main" mb={2}>
              Your password has been reset successfully.
            </Typography>
            <MuiLink
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{ cursor: 'pointer' }}
            >
              Go to Sign In
            </MuiLink>
          </Box>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <ResetPasswordForm register={register} errors={errors} isSubmitting={isSubmitting} />
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

export default ResetPassword;
