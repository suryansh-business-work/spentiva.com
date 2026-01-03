import React from 'react';
import { Paper, Typography, Button, useTheme } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';

interface EmptyStateProps {
  onCreateClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
      }}
    >
      <AccountBalanceWalletIcon sx={{ fontSize: 80, color: theme.palette.text.disabled, mb: 2 }} />
      <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }} gutterBottom>
        No trackers yet
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mb: 3 }}>
        Create your first tracker to start managing expenses
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateClick}
        sx={{
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: theme.shadows[4],
          '&:hover': {
            boxShadow: theme.shadows[8],
          },
        }}
      >
        Create Tracker
      </Button>
    </Paper>
  );
};

export default EmptyState;
