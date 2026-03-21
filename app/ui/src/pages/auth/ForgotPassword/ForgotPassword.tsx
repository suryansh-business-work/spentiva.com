import React from 'react';
import { Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ForgotPasswordForm from './ForgotPasswordForm';
import { postRequest } from '../../../utils/http';
import { endpoints } from '../../../config/api';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setError('');
    try {
      await postRequest(endpoints.auth.forgotPassword, values);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
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
              onClick={() => navigate('/login')}
              sx={{ cursor: 'pointer' }}
            >
              Back to Sign In
            </MuiLink>
          </Box>
        ) : (
          <>
            <Formik
              initialValues={{ email: '' }}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              {(formikProps) => (
                <Form>
                  <ForgotPasswordForm {...formikProps} />
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

export default ForgotPassword;
