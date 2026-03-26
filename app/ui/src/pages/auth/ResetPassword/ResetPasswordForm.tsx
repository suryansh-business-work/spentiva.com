import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import { FormikProps } from 'formik';

interface ResetPasswordValues {
  token: string;
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm: React.FC<FormikProps<ResetPasswordValues>> = ({
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
        name="token"
        label="Reset Token"
        value={values.token}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.token && Boolean(errors.token)}
        helperText={touched.token && errors.token}
        autoFocus
      />
      <TextField
        fullWidth
        name="password"
        label="New Password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && Boolean(errors.password)}
        helperText={touched.password && errors.password}
        autoComplete="new-password"
      />
      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
        helperText={touched.confirmPassword && errors.confirmPassword}
        autoComplete="new-password"
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isSubmitting}
        sx={{ mt: 1, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
      >
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </Button>
    </Box>
  );
};

export default ResetPasswordForm;
