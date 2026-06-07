import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { LoginValues } from './login.schema';

interface LoginFormProps {
  register: UseFormRegister<LoginValues>;
  errors: FieldErrors<LoginValues>;
  isSubmitting: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ register, errors, isSubmitting }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Email"
        type="email"
        {...register('email')}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        autoComplete="email"
        autoFocus
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        {...register('password')}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
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
