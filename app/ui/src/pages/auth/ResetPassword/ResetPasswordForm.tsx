import React from 'react';
import { TextField, Button, Box } from '@mui/material';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ResetPasswordValues } from './reset-password.schema';

interface ResetPasswordFormProps {
  register: UseFormRegister<ResetPasswordValues>;
  errors: FieldErrors<ResetPasswordValues>;
  isSubmitting: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ register, errors, isSubmitting }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Reset Token"
        {...register('token')}
        error={Boolean(errors.token)}
        helperText={errors.token?.message}
        autoFocus
      />
      <TextField
        fullWidth
        label="New Password"
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
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </Button>
    </Box>
  );
};

export default ResetPasswordForm;
