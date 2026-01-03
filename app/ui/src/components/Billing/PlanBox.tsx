import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  PLAN_NAMES,
  PLAN_PRICES,
  PLAN_FEATURES,
  canUpgrade,
  canDowngrade,
  type PlanType,
} from '../../config/planConfig';

interface PlanBoxProps {
  plan: PlanType;
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => void;
  onDowngrade: (plan: PlanType) => void;
}

const PlanBox: React.FC<PlanBoxProps> = ({ plan, currentPlan, onUpgrade, onDowngrade }) => {
  const theme = useTheme();
  const isActive = plan === currentPlan;
  const showUpgrade = canUpgrade(currentPlan, plan);
  const showDowngrade = canDowngrade(currentPlan, plan);

  const planColors = {
    free: theme.palette.grey[600],
    pro: theme.palette.success.main,
    businesspro: theme.palette.warning.main,
  };

  const color = planColors[plan];

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: isActive ? `3px solid ${color}` : `1px solid ${theme.palette.divider}`,
        bgcolor: isActive
          ? theme.palette.mode === 'dark'
            ? `${color}15`
            : `${color}05`
          : 'transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={800} sx={{ color, mb: 1 }}>
            {PLAN_NAMES[plan]}
          </Typography>
          <Stack direction="row" alignItems="baseline" justifyContent="center" spacing={0.5}>
            <Typography variant="h3" fontWeight={800}>
              {PLAN_PRICES[plan]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              /month
            </Typography>
          </Stack>
          {isActive && (
            <Typography variant="caption" sx={{ color, fontWeight: 700, mt: 1, display: 'block' }}>
              ● ACTIVE
            </Typography>
          )}
        </Box>

        {/* Features */}
        <List sx={{ mb: 2, flex: 1 }}>
          {PLAN_FEATURES[plan].map((feature, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleIcon sx={{ fontSize: 18, color }} />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
              />
            </ListItem>
          ))}
        </List>

        {/* Action Buttons */}
        {isActive ? (
          <Button fullWidth variant="outlined" disabled sx={{ py: 1.5, fontWeight: 700 }}>
            Current Plan
          </Button>
        ) : showUpgrade ? (
          <Button
            fullWidth
            variant="contained"
            onClick={() => onUpgrade(plan)}
            sx={{
              py: 1.5,
              fontWeight: 700,
              bgcolor: color,
              '&:hover': { bgcolor: color, filter: 'brightness(0.9)' },
            }}
          >
            Upgrade to {PLAN_NAMES[plan]}
          </Button>
        ) : showDowngrade ? (
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onDowngrade(plan)}
            sx={{ py: 1.5, fontWeight: 700, borderColor: color, color }}
          >
            Downgrade to {PLAN_NAMES[plan]}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PlanBox;
