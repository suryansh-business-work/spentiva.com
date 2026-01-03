import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Tracker } from '../types/tracker.types';

interface DeleteDialogProps {
  open: boolean;
  tracker: Tracker | null;
  onClose: () => void;
  onConfirm: () => void;
  deleting?: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  tracker,
  onClose,
  onConfirm,
  deleting = false,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ color: theme.palette.text.primary }}>Delete Tracker</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: theme.palette.text.primary }}>
          Are you sure you want to delete "<strong>{tracker?.name}</strong>"?
        </Typography>
        <Typography
          sx={{
            mt: 1,
            color: theme.palette.error.main,
          }}
        >
          This will also delete all expenses associated with this tracker. This action cannot be
          undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={deleting} sx={{ color: theme.palette.text.secondary }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : undefined}
          sx={{
            bgcolor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            '&:hover': {
              bgcolor: theme.palette.error.dark,
            },
          }}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
