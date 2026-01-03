import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

interface UpgradeCardProps {
  onUpgrade: () => void;
}

/**
 * UpgradeCard Component
 * Card promoting Pro plan upgrade
 */
const UpgradeCard: React.FC<UpgradeCardProps> = ({ onUpgrade }) => {
  const theme = useTheme();

  const proFeatures = [
    'Unlimited trackers',
    'Unlimited messages',
    'Advanced analytics',
    'AI-powered insights',
    'Export to CSV/PDF',
    'Priority support',
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.primary.dark}50 0%, ${theme.palette.success.dark}50 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.light}30 0%, ${theme.palette.success.light}30 100%)`,
        border: `2px solid ${theme.palette.primary.main}`,
        boxShadow: `0 8px 24px ${theme.palette.primary.main}20`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <RocketLaunchIcon
            sx={{
              fontSize: 48,
              color: theme.palette.primary.main,
              mb: 1,
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Upgrade to Pro
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
              $99
            </Typography>
            <Typography variant="body1" color="text.secondary">
              /year
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Save 17% with annual billing
          </Typography>
        </Box>

        {/* Features */}
        <List sx={{ mb: 2 }}>
          {proFeatures.map(feature => (
            <ListItem key={feature} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Upgrade Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={onUpgrade}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
            py: 1.5,
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.success.dark} 100%)`,
              boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradeCard;
