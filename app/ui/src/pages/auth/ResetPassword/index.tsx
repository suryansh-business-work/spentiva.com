import React from 'react';
import { Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ResetPasswordForm from './ResetPasswordForm';
import { postRequest } from '../../../utils/http';
import { endpoints } from '../../../config/api';

const resetPasswordSchema = Yup.object().shape({
  token: Yup.string().required('Reset token is required'),
  password: Yup.string()
    .min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[a-z]/, 'Must contain lowercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

interface ResetPasswordValues {
  token: string;
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const tokenFromUrl = searchParams.get('token') || '';

  const handleSubmit = async (values: ResetPasswordValues) => {
    setError('');
    try {
      await postRequest(endpoints.auth.resetPassword, {
        token: values.token,
        password: values.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reset password');
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
            <Formik
              initialValues={{
                token: tokenFromUrl,
                password: '',
                confirmPassword: '',
              }}
              validationSchema={resetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {(formikProps) => (
                <Form>
                  <ResetPasswordForm {...formikProps} />
                </Form>
              )}
            </Formik>

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
