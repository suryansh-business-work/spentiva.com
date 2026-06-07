import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface ForgotPasswordValues {
  email: string;
}

interface ForgotPasswordFormProps {
  register: UseFormRegister<ForgotPasswordValues>;
  errors: FieldErrors<ForgotPasswordValues>;
  isSubmitting: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  register,
  errors,
  isSubmitting,
}) => {
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
