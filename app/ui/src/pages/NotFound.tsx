import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * NotFound Component
 * 404 Error page with Lottie animation
 * Note: Requires 404.json file in public/animations directory
 */
const NotFound: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Dynamically load the 404.json animation
    fetch('/animations/404.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => {
        console.error('Error loading 404 animation:', error);
        // Fallback animation if 404.json is not found
        setAnimationData({
          v: '5.7.4',
          fr: 30,
          ip: 0,
          op: 60,
          w: 500,
          h: 500,
          nm: '404',
          ddd: 0,
          assets: [],
          layers: [],
        });
      });
  }, []);

  const handleBackToTrackers = () => {
    navigate('/trackers');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 4,
        }}
      >
        {/* Lottie Animation */}
        {animationData && (
          <Box
            sx={{
              width: { xs: 280, sm: 350, md: 400 },
              height: { xs: 280, sm: 350, md: 400 },
              mb: 3,
            }}
          >
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        )}

        {/* Error Message */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            fontWeight: 800,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.warning.light} 100%)`
                : `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            mb: 1,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          Oops! Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 4,
            maxWidth: 500,
            px: 2,
          }}
        >
          The page you're looking for doesn't exist or has been moved. Don't worry, let's get you
          back on track!
        </Typography>

        {/* Back to Trackers Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleBackToTrackers}
          startIcon={<ArrowBackIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
            boxShadow: `0 4px 14px 0 ${theme.palette.primary.main}40`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 20px 0 ${theme.palette.primary.main}60`,
            },
          }}
        >
          Back to Trackers
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
