import React from 'react';
import { Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import RegisterForm from './RegisterForm';
import { postRequest } from '../../../utils/http';
import { endpoints } from '../../../config/api';
import { setAuthToken } from '../../../utils/localStorage';

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleRegister = async (values: RegisterValues) => {
    setError('');
    try {
      const response = await postRequest(endpoints.auth.register, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      const data = response?.data;
      if (data?.data?.token) {
        setAuthToken(data.data.token);
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        onRegisterSuccess();
      } else {
        setError(data?.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
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

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {(formikProps) => (
            <Form>
              <RegisterForm {...formikProps} />
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
            Already have an account? Sign In
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
