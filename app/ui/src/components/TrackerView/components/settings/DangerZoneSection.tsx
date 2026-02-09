import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface DangerZoneSectionProps {
  trackerId: string;
  onDelete: () => void;
}

const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({ trackerId, onDelete }) => {
  const theme = useTheme();
  const [clearChatDialogOpen, setClearChatDialogOpen] = useState(false);
  const [chatCleared, setChatCleared] = useState(false);

  const handleClearChat = () => {
    window.dispatchEvent(new CustomEvent('clearChat', { detail: { trackerId } }));
    setChatCleared(true);
    setClearChatDialogOpen(false);
    setTimeout(() => setChatCleared(false), 3000);
  };

  const dangerActions = [
    {
      title: 'Clear Chat History',
      description: 'Remove all chat messages from this tracker. This resets the conversation.',
      icon: <CleaningServicesIcon />,
      buttonLabel: 'Clear Chat',
      color: 'warning' as const,
      onClick: () => setClearChatDialogOpen(true),
    },
    {
      title: 'Delete Tracker',
      description:
        'Permanently delete this tracker and all its data including expenses, categories, and shared access.',
      icon: <DeleteOutlineIcon />,
      buttonLabel: 'Delete Tracker',
      color: 'error' as const,
      onClick: onDelete,
    },
  ];

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <WarningAmberIcon color="error" sx={{ fontSize: 20 }} />
        <Typography variant="subtitle1" fontWeight={600} color="error.main">
          Danger Zone
        </Typography>
      </Box>

      {chatCleared && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Chat history cleared successfully.
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {dangerActions.map((action) => (
          <Box
            key={action.title}
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
              <Box sx={{ color: `${action.color}.main`, mt: 0.25 }}>{action.icon}</Box>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {action.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {action.description}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              color={action.color}
              size="small"
              onClick={action.onClick}
              sx={{ textTransform: 'none', whiteSpace: 'nowrap', minWidth: 'fit-content' }}
            >
              {action.buttonLabel}
            </Button>
          </Box>
        ))}
      </Box>

      {/* Clear Chat Confirmation Dialog */}
      <Dialog
        open={clearChatDialogOpen}
        onClose={() => setClearChatDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Clear Chat History?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will remove all chat messages from this tracker session. Your expenses and data will
            not be affected.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setClearChatDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleClearChat}
            color="warning"
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            Clear Chat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DangerZoneSection;
