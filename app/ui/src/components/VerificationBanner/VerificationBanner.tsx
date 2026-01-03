import React from 'react';
import { Box, Button, Typography, useTheme, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

/**
 * VerificationBanner Component
 * Non-dismissible banner shown to unverified users
 */
const VerificationBanner: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate('/profile');
  };

  return (
    <Box
      sx={{
        width: '100%',
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)`
            : `linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)`,
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#A78BFA' : '#C4B5FD'}`,
        py: 0.75,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 250 }}>
            <WarningAmberIcon
              sx={{
                color: theme.palette.mode === 'dark' ? theme.palette.common.white : '#7C3AED',
                fontSize: { xs: 20, sm: 24 },
              }}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : '#5B21B6',
                  fontWeight: 600,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                }}
              >
                Email Not Verified
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.85)' : '#6D28D9',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                }}
              >
                Please verify your email to access all features
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={handleVerify}
            startIcon={<VerifiedUserIcon sx={{ fontSize: 16 }} />}
            size="small"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.common.white : '#7C3AED',
              color: theme.palette.mode === 'dark' ? '#7C3AED' : theme.palette.common.white,
              fontWeight: 600,
              fontSize: '0.8rem',
              px: 2,
              py: 0.5,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.2)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : '#6D28D9',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Verify Email
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default VerificationBanner;
