import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Lottie from 'lottie-react';
import TypingAnimation from '../../common/TypingAnimation';

/**
 * GreetingHeader Component
 * Displays personalized greeting with typing animation and gradient username
 */
const GreetingHeader: React.FC = () => {
  const theme = useTheme();
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('User');
  const [showTyping, setShowTyping] = useState(false);
  const [hiAnimation, setHiAnimation] = useState<any>(null);

  const messages = [
    'How are you? Hope you are great!',
    'I hope you spend wisely today',
    "Let's track your expenses efficiently",
    'Managing money made simple',
  ];

  const [currentMessage] = useState(messages[Math.floor(Math.random() * messages.length)]);

  useEffect(() => {
    // Load animation data from public directory
    fetch('/animations/hi.json')
      .then(response => response.json())
      .then(data => setHiAnimation(data))
      .catch(error => console.error('Error loading animation:', error));

    // Get user from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.email?.split('@')[0] || 'User');
      }
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
    }

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    // Show typing animation after a brief delay
    const timer = setTimeout(() => setShowTyping(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1.5rem', md: '1.75rem' },
          }}
        >
          {greeting},
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.success.light} 50%, ${theme.palette.primary.main} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 50%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline',
          }}
        >
          {userName}!
        </Typography>
        <Box
          sx={{
            width: { xs: 28, md: 32 },
            height: { xs: 28, md: 32 },
            display: 'inline-block',
          }}
        >
          {hiAnimation && (
            <Lottie
              animationData={hiAnimation}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </Box>
      </Box>
      <Box sx={{ minHeight: 24 }}>
        {showTyping && (
          <TypingAnimation
            text={currentMessage}
            speed={40}
            delay={100}
            variant="body2"
            color="text.secondary"
          />
        )}
      </Box>
    </Box>
  );
};

export default GreetingHeader;
