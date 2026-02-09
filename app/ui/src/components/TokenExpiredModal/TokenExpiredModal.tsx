import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,  
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface TokenExpiredModalProps {
  open: boolean;
  onLogout: () => void;
}

const TokenExpiredModal: React.FC<TokenExpiredModalProps> = ({ open, onLogout }) => {
  const theme = useTheme();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, onLogout]);

  return (
    <Dialog
      open={open}
      onClose={onLogout}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[8],
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 2,
        }}
      >
        <WarningAmberIcon
          sx={{
            fontSize: 28,
            color: 'error.main',
          }}
        />
        <Typography variant="h6" fontWeight={700} color="error.main">
          Session Expired
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, pb: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your login session has expired. For security reasons, you will be logged out automatically.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 3,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.03))',
            borderRadius: 2,
            border: `1px solid ${theme.palette.error.main}20`,
          }}
        >
          <AccessTimeIcon 
            sx={{ 
              fontSize: 40, 
              color: 'error.main',
              animation: 'pulse 1s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 },
              },
            }} 
          />
          <Typography 
            variant="h4" 
            fontWeight={700} 
            color="error.main"
            sx={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {countdown}
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center">
            Automatically logging out in {countdown} second{countdown !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onLogout}
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          fullWidth
          sx={{
            py: 1.5,
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Log Out Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TokenExpiredModal;