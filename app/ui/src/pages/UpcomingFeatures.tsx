import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const UpcomingFeatures: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      id: 1,
      title: 'Integration to Multiple Apps',
      icon: (
        <IntegrationInstructionsIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
      ),
      timeline: 'Coming Q3 2026',
      status: 'In Development',
      description:
        'Track your expenses directly from the apps you already use. Send a message and Spentiva will log it for you — no need to open the app.',
      benefits: [
        'WhatsApp integration — log expenses via chat',
        'Slack integration — track from your workspace',
        'Telegram bot — instant expense logging',
        'Real-time sync across all platforms',
        'Natural language parsing on every channel',
        'Secure & encrypted communication',
      ],
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <RocketLaunchIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          <Typography variant="h4" fontWeight={800}>
            Upcoming Features
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          We're constantly working to improve Spentiva. Here's what's coming next to make your
          expense tracking even better.
        </Typography>
      </Box>

      {/* Feature Cards */}
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, md: 8 }} sx={{ mx: 'auto' }} key={feature.id}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `2px solid ${theme.palette.divider}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-4px)',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(0,0,0,0.3)'
                      : '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Icon and Status */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  {feature.icon}
                  <Chip
                    label={feature.status}
                    color={index === 0 ? 'primary' : 'secondary'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Title */}
                <Typography variant="h5" fontWeight={700} mb={1}>
                  {feature.title}
                </Typography>

                {/* Timeline */}
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{
                    display: 'block',
                    mb: 2,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {feature.timeline}
                </Typography>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {feature.description}
                </Typography>

                {/* Benefits */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700} mb={1}>
                    Key Features:
                  </Typography>
                  <List dense disablePadding>
                    {feature.benefits.map((benefit, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleIcon
                            sx={{
                              fontSize: 18,
                              color:
                                index === 0
                                  ? theme.palette.primary.main
                                  : theme.palette.secondary.main,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={benefit}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontSize: '0.875rem',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer Note */}
      <Box
        sx={{
          mt: 6,
          p: 3,
          borderRadius: 3,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          border: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Have a feature request? Contact us through the{' '}
          <Typography component="span" color="primary" fontWeight={600}>
            Support
          </Typography>{' '}
          menu and let us know what you'd like to see!
        </Typography>
      </Box>
    </Container>
  );
};

export default UpcomingFeatures;
