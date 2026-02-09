import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Tracker } from '../types/tracker.types';

interface DeleteDialogProps {
  open: boolean;
  tracker: Tracker | null;
  onClose: () => void;
  onRequestOtp: () => Promise<boolean>;
  onConfirm: (otp: string) => Promise<boolean>;
  deleting?: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  tracker,
  onClose,
  onRequestOtp,
  onConfirm,
  deleting = false,
}) => {
  const theme = useTheme();
  const [step, setStep] = useState<'confirm' | 'otp'>('confirm');
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setStep('confirm');
      setOtp('');
      setError('');
      setSending(false);
    }
  }, [open]);

  const handleSendOtp = async () => {
    setSending(true);
    setError('');
    const ok = await onRequestOtp();
    setSending(false);
    if (ok) setStep('otp');
    else setError('Failed to send verification code. Please try again.');
  };

  const handleConfirm = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setError('');
    const ok = await onConfirm(otp);
    if (!ok) setError('Invalid or expired code. Please try again.');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { bgcolor: theme.palette.background.paper, borderRadius: 3, minWidth: 360 },
      }}
    >
      <DialogTitle sx={{ color: theme.palette.text.primary }}>Delete Tracker</DialogTitle>
      <DialogContent>
        {step === 'confirm' ? (
          <>
            <Typography sx={{ color: theme.palette.text.primary }}>
              Are you sure you want to delete &quot;<strong>{tracker?.name}</strong>&quot;?
            </Typography>
            <Typography sx={{ mt: 1, color: theme.palette.error.main }}>
              This will delete all expenses and categories. This action cannot be undone.
            </Typography>
          </>
        ) : (
          <>
            <Typography sx={{ color: theme.palette.text.primary, mb: 2 }}>
              A 6-digit verification code has been sent to your email. Enter it below to confirm
              deletion.
            </Typography>
            <TextField
              fullWidth
              label="Verification Code"
              value={otp}
              onChange={e => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              inputProps={{
                maxLength: 6,
                inputMode: 'numeric',
                style: { letterSpacing: 8, fontWeight: 700, fontSize: 22, textAlign: 'center' },
              }}
              autoFocus
            />
          </>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={deleting || sending}
          sx={{ color: theme.palette.text.secondary }}
        >
          Cancel
        </Button>
        {step === 'confirm' ? (
          <Box>
            <Button
              onClick={handleSendOtp}
              variant="contained"
              disabled={sending}
              startIcon={sending ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{
                bgcolor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                '&:hover': { bgcolor: theme.palette.error.dark },
              }}
            >
              {sending ? 'Sending...' : 'Send Code & Delete'}
            </Button>
          </Box>
        ) : (
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={deleting || otp.length !== 6}
            startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={{
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
              '&:hover': { bgcolor: theme.palette.error.dark },
            }}
          >
            {deleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
