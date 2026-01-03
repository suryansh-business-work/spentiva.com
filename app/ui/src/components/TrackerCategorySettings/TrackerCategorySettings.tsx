import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Container, useTheme, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategorySettings from '../CategorySettings/CategorySettings';

const TrackerCategorySettings: React.FC = () => {
  const { trackerId } = useParams<{ trackerId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  if (!trackerId) return null;

  return (
    <Box
      sx={{ minHeight: '100vh', bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f8f9fa' }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.success.main,
          height: 64,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(0,0,0,0.4)'
              : '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} width="100%">
          <IconButton
            onClick={() => navigate(`/tracker/${trackerId}`)}
            sx={{
              color: '#fff',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, flex: 1 }}>
            Category Settings
          </Typography>
        </Stack>
      </Box>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <CategorySettings trackerId={trackerId} />
      </Container>
    </Box>
  );
};

export default TrackerCategorySettings;
