import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FormikProps } from 'formik';

interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC<FormikProps<RegisterValues>> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  isSubmitting,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="firstName"
            label="First Name"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName && Boolean(errors.firstName)}
            helperText={touched.firstName && errors.firstName}
            autoFocus
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="lastName"
            label="Last Name"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={touched.lastName && errors.lastName}
          />
        </Grid>
      </Grid>
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
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
    </Box>
  );
};

export default RegisterForm;
