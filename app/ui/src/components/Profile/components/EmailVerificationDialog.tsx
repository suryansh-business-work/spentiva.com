import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';

interface EmailVerificationDialogProps {
  open: boolean;
  email: string;
  loading: boolean;
  error: string;
  success: string;
  otpSent: boolean;
  countdown: number;
  onClose: () => void;
  onSendOtp: () => void;
  onVerify: (otp: string) => void;
  onClearMessages: () => void;
}

const EmailVerificationDialog: React.FC<EmailVerificationDialogProps> = ({
  open,
  email,
  loading,
  error,
  countdown,
  onClose,
  onSendOtp,
  onVerify,
  onClearMessages,
}) => {
  const theme = useTheme();
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (!open) {
      setOtp('');
      onClearMessages();
    }
  }, [open, onClearMessages]);

  const handleSendOtp = async () => {
    await onSendOtp();
  };

  const handleVerify = () => {
    if (otp.trim().length === 6) {
      onVerify(otp.trim());
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.palette.primary.light,
            }}
          >
            <EmailIcon sx={{ color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Verify Email
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mb: 3, lineHeight: 1.6 }}
          >
            A verification code was sent to <strong>{email}</strong> when you signed up. Please
            enter the 6-digit code below.
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, mb: 1, display: 'block' }}
          >
            Enter 6-digit verification code
          </Typography>

          <TextField
            fullWidth
            value={otp}
            onChange={handleOtpChange}
            placeholder="000000"
            disabled={loading}
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
                fontWeight: 600,
              },
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: theme.palette.divider,
                  borderWidth: 2,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.light,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={onClearMessages}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Didn't receive the code?
            </Typography>
            {countdown > 0 ? (
              <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                Resend in {countdown}s
              </Typography>
            ) : (
              <Button
                size="small"
                onClick={handleSendOtp}
                disabled={loading}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Resend Code
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            borderRadius: 2,
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailVerificationDialog;
