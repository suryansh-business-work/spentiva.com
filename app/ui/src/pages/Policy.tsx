import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, useTheme, Link } from '@mui/material';
import Lottie from 'lottie-react';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import CookieIcon from '@mui/icons-material/Cookie';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface PolicyLink {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * Policy Component
 * Displays links to all policy documents with Lottie animation
 */
const Policy: React.FC = () => {
  const theme = useTheme();
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Load policy.json animation
    fetch('/animations/policy.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading policy animation:', error));
  }, []);

  const policyLinks: PolicyLink[] = [
    {
      title: 'Privacy Policy',
      description: 'Learn how we collect, use, and protect your personal information',
      url: 'https://spentiva.com/privacy-policy',
      icon: <PrivacyTipIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Terms & Conditions',
      description: 'Review our terms of service and user agreement',
      url: 'https://spentiva.com/terms-and-conditions',
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
    },
    {
      title: 'Data Policy',
      description: 'Understand how we handle and store your data',
      url: 'https://spentiva.com/data-policy',
      icon: <StorageIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Cookie Policy',
      description: 'Details about our use of cookies and tracking technologies',
      url: 'https://spentiva.com/cookie-policy',
      icon: <CookieIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Lottie Animation */}
      {animationData && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: 200, sm: 250, md: 300 },
              height: { xs: 200, sm: 250, md: 300 },
            }}
          >
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.info.light} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Privacy & Policies
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your privacy and security are our top priorities
        </Typography>
      </Box>

      {/* Policy Links Grid */}
      <Grid container spacing={3}>
        {policyLinks.map(policy => (
          <Grid size={{ xs: 12, sm: 6 }} key={policy.title}>
            <Link
              href={policy.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${theme.palette.divider}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px ${policy.color}30`,
                    borderColor: policy.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${policy.color}20, ${policy.color}40)`,
                        color: policy.color,
                      }}
                    >
                      {policy.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          mb: 0.5,
                        }}
                      >
                        {policy.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: policy.color,
                            fontWeight: 600,
                          }}
                        >
                          View Policy
                        </Typography>
                        <OpenInNewIcon sx={{ fontSize: 14, color: policy.color }} />
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {policy.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Footer Info */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          For any questions or concerns, please contact us at{' '}
          <Link href="mailto:privacy@spentiva.com" sx={{ color: theme.palette.primary.main }}>
            privacy@spentiva.com
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Policy;
