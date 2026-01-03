import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const AdminGreeting: React.FC<{ stats: any }> = ({ stats }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [displayText, setDisplayText] = useState('');
  const [showStats, setShowStats] = useState(false);

  const greeting = `Hello ${user?.name || 'Admin'}! 👋`;
  const statsText = stats
    ? `We have ${stats.allTime.total} total users: ${stats.allTime.free} Free, ${stats.allTime.pro} Pro, and ${stats.allTime.businesspro} Business Pro users.`
    : '';

  useEffect(() => {
    let index = 0;
    const fullText = greeting;

    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowStats(true), 300);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 3,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      }}
    >
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        {displayText}
        <Box component="span" sx={{ animation: 'blink 1s infinite', ml: 0.5 }}>
          |
        </Box>
      </Typography>

      {showStats && statsText && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ animation: 'fadeIn 0.5s ease-in' }}
        >
          {statsText}
        </Typography>
      )}

      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default AdminGreeting;
