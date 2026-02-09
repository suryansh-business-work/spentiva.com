import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  useTheme,
  Avatar,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

/** Slack-like icon placeholder */
const SlackIcon: React.FC<{ sx?: object }> = ({ sx }) => (
  <Box
    component="span"
    sx={{
      fontWeight: 800,
      fontSize: 20,
      lineHeight: 1,
      fontFamily: '"Segoe UI", Roboto, sans-serif',
      ...sx,
    }}
  >
    #
  </Box>
);

interface Integration {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const integrations: Integration[] = [
  {
    name: 'WhatsApp',
    icon: <WhatsAppIcon sx={{ fontSize: 32 }} />,
    color: '#25D366',
    description: 'Log expenses and income by simply messaging the Spentiva WhatsApp bot.',
  },
  {
    name: 'Slack',
    icon: <SlackIcon />,
    color: '#4A154B',
    description: 'Track your finances from your Slack workspace with slash commands.',
  },
  {
    name: 'Telegram',
    icon: <TelegramIcon sx={{ fontSize: 32 }} />,
    color: '#0088cc',
    description: 'Use the Spentiva Telegram bot for instant expense logging on the go.',
  },
];

const Integrations: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IntegrationInstructionsIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          <Typography variant="h4" fontWeight={800}>
            Integrations
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>
          Connect Spentiva with your favourite apps to log expenses from anywhere.
        </Typography>
        <Chip
          label="Coming Soon"
          color="warning"
          sx={{ mt: 2, fontWeight: 700, fontSize: '0.85rem', px: 1 }}
        />
      </Box>

      {/* Integration Cards */}
      <Grid container spacing={3} justifyContent="center">
        {integrations.map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.name}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `2px solid ${theme.palette.divider}`,
                borderRadius: 3,
                textAlign: 'center',
                opacity: 0.7,
                transition: 'all 0.3s ease',
                '&:hover': {
                  opacity: 1,
                  borderColor: item.color,
                  transform: 'translateY(-4px)',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(0,0,0,0.3)'
                      : '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: `${item.color}20`,
                    color: item.color,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                  <Chip label="Coming Soon" size="small" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer */}
      <Box
        sx={{
          mt: 6,
          p: 3,
          borderRadius: 3,
          bgcolor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          border: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Want a specific integration? Reach out through{' '}
          <Typography component="span" color="primary" fontWeight={600}>
            Support
          </Typography>{' '}
          and let us know!
        </Typography>
      </Box>
    </Container>
  );
};

export default Integrations;
