import React from 'react';
import { Card, CardContent, Typography, Button, Box, Stack, Chip, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface PlanCardProps {
  plan: 'free' | 'pro' | 'businesspro';
  currentPlan: string;
  onUpgrade?: () => void;
  onDowngrade?: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, currentPlan, onUpgrade, onDowngrade }) => {
  const theme = useTheme();

  const planDetails = {
    free: {
      name: 'Free',
      price: '$0',
      features: ['1 Tracker', '50 Messages/month', 'Basic Analytics', 'Email Support'],
      color: theme.palette.grey[600],
    },
    pro: {
      name: 'Pro',
      price: '$9',
      features: ['5 Trackers', '500 Messages/month', 'Advanced Analytics', 'Priority Support'],
      color: theme.palette.success.main,
    },
    businesspro: {
      name: 'Business Pro',
      price: '$19',
      features: ['Unlimited Trackers', 'Unlimited Messages', 'Premium Analytics', '24/7 Support'],
      color: theme.palette.warning.main,
    },
  };

  const details = planDetails[plan];
  const isCurrentPlan = currentPlan.toLowerCase() === plan;
  const canUpgrade =
    (currentPlan === 'free' && plan !== 'free') ||
    (currentPlan === 'pro' && plan === 'businesspro');
  const canDowngrade =
    (currentPlan === 'pro' && plan === 'free') ||
    (currentPlan === 'businesspro' && (plan === 'pro' || plan === 'free'));

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: isCurrentPlan ? `2px solid ${details.color}` : '1px solid',
        borderColor: isCurrentPlan ? details.color : theme.palette.divider,
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      {isCurrentPlan && (
        <Chip
          label="Current Plan"
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: details.color,
            color: '#fff',
            fontWeight: 700,
          }}
        />
      )}

      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={800} mb={1} color={details.color}>
          {details.name}
        </Typography>
        <Box mb={3}>
          <Typography variant="h3" fontWeight={800} component="span">
            {details.price}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="span">
            /month
          </Typography>
        </Box>

        <Stack spacing={1.5} mb={3}>
          {details.features.map((feature, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon sx={{ fontSize: 18, color: details.color }} />
              <Typography variant="body2">{feature}</Typography>
            </Stack>
          ))}
        </Stack>

        {!isCurrentPlan && (
          <>
            {canUpgrade && onUpgrade && (
              <Button
                fullWidth
                variant="contained"
                onClick={onUpgrade}
                sx={{
                  bgcolor: details.color,
                  '&:hover': {
                    bgcolor: details.color,
                    filter: 'brightness(0.9)',
                  },
                }}
              >
                Upgrade to {details.name}
              </Button>
            )}
            {canDowngrade && onDowngrade && (
              <Button fullWidth variant="outlined" onClick={onDowngrade} color="inherit">
                Downgrade to {details.name}
              </Button>
            )}
          </>
        )}

        {isCurrentPlan && (
          <Button fullWidth variant="outlined" disabled>
            Active Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanCard;
