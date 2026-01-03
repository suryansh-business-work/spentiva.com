import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Lottie from 'lottie-react';

interface WelcomeAnimationProps {
  userName: string;
}

/**
 * WelcomeAnimation Component
 * Displays an animated welcome message with Lottie animations and gradient username text
 */
const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ userName }) => {
  const theme = useTheme();
  const [botAnimation, setBotAnimation] = React.useState<any>(null);

  React.useEffect(() => {
    // Load animation data from public directory
    fetch('/animations/bot.json')
      .then(response => response.json())
      .then(data => setBotAnimation(data))
      .catch(error => console.error('Error loading bot animation:', error));
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        py: 2,
      }}
    >
      {/* Bot Animation */}
      <Box
        sx={{
          width: { xs: 80, sm: 100 },
          height: { xs: 80, sm: 100 },
        }}
      >
        {botAnimation && (
          <Lottie
            animationData={botAnimation}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </Box>

      {/* Welcome Text with Animation */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Welcome
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 700,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.success.light} 50%, ${theme.palette.primary.main} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 50%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {userName}!
        </Typography>
      </Box>

      {/* Welcome Message */}
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          textAlign: 'center',
          px: 2,
          fontSize: { xs: '0.875rem', sm: '0.95rem' },
          lineHeight: 1.6,
        }}
      >
        I'm your expense tracker assistant. Tell me about your expenses naturally, like
        <Typography
          component="span"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            fontStyle: 'italic',
            mx: 0.5,
          }}
        >
          "spend food 50 from credit card"
        </Typography>
        or
        <Typography
          component="span"
          sx={{
            fontWeight: 600,
            color: theme.palette.success.main,
            fontStyle: 'italic',
            mx: 0.5,
          }}
        >
          "bought groceries 200 cash"
        </Typography>
      </Typography>
    </Box>
  );
};

export default WelcomeAnimation;
