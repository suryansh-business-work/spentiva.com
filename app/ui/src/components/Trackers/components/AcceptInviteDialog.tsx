import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { endpoints } from '../../../config/api';
import { postRequest } from '../../../utils/http';

interface AcceptInviteDialogProps {
  open: boolean;
  trackerId: string;
  email: string;
  onClose: () => void;
  onAccepted: (trackerId: string) => void;
  onDeclined: () => void;
}

const AcceptInviteDialog: React.FC<AcceptInviteDialogProps> = ({
  open,
  trackerId,
  email,
  onClose,
  onAccepted,
  onDeclined,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRespond = async (response: 'accepted' | 'rejected') => {
    setLoading(true);
    setError('');
    try {
      const res = await postRequest(endpoints.trackers.respondInvite(trackerId), { response });
      const message = res?.data?.message || '';

      if (response === 'accepted') {
        setSuccess(message || 'You have joined the tracker!');
        setTimeout(() => onAccepted(trackerId), 1500);
      } else {
        setSuccess('Invitation declined.');
        setTimeout(() => onDeclined(), 1500);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="xs"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: { bgcolor: theme.palette.background.paper, borderRadius: fullScreen ? 0 : 3 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GroupAddIcon color="primary" />
        Tracker Invitation
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Typography variant="body1" color="text.secondary">
            You have been invited to collaborate on a tracker.
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              INVITED AS
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
              {email}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" variant="outlined">
              {success}
            </Alert>
          )}
        </Box>
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{ color: theme.palette.text.secondary }}
          >
            Later
          </Button>
          <Button
            onClick={() => handleRespond('rejected')}
            disabled={loading}
            color="error"
            variant="outlined"
          >
            Decline
          </Button>
          <Button
            onClick={() => handleRespond('accepted')}
            disabled={loading}
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {loading ? 'Processing...' : 'Accept'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AcceptInviteDialog;
