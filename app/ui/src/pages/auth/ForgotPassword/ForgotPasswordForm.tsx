import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import { FormikProps } from 'formik';

interface ForgotPasswordValues {
  email: string;
}

const ForgotPasswordForm: React.FC<FormikProps<ForgotPasswordValues>> = ({
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
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isSubmitting}
        sx={{ mt: 1, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </Box>
  );
};

export default ForgotPasswordForm;
