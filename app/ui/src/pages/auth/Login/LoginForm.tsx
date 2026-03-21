import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import { FormikProps } from 'formik';

interface LoginValues {
  email: string;
  password: string;
}

const LoginForm: React.FC<FormikProps<LoginValues>> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  isSubmitting,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        name="email"
        label="Email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
        autoComplete="email"
        autoFocus
      />
      <TextField
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && Boolean(errors.password)}
        helperText={touched.password && errors.password}
        autoComplete="current-password"
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isSubmitting}
        sx={{ mt: 1, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </Box>
  );
};

export default LoginForm;
