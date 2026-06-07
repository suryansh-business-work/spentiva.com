import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { RegisterValues } from './register.schema';

interface RegisterFormProps {
  register: UseFormRegister<RegisterValues>;
  errors: FieldErrors<RegisterValues>;
  isSubmitting: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ register, errors, isSubmitting }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="First Name"
            {...register('firstName')}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
            autoFocus
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            {...register('lastName')}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
          />
        </Grid>
      </Grid>
      <TextField
        fullWidth
        label="Email"
        type="email"
        {...register('email')}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        autoComplete="email"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        {...register('password')}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        autoComplete="new-password"
      />
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        {...register('confirmPassword')}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword?.message}
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
