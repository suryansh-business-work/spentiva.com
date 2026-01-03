import React from 'react';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  MessageOutlined as MessageIcon,
  TokenOutlined as TokenIcon,
  PersonOutline as PersonIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material';
import { UsageOverview } from '../../../types/usage';

interface UsageOverviewCardsProps {
  data: UsageOverview;
}

/**
 * UsageOverviewCards Component
 * Displays overall usage statistics in gradient cards
 */
const UsageOverviewCards: React.FC<UsageOverviewCardsProps> = ({ data }) => {
  const cards = [
    {
      title: 'Total Messages',
      value: data.overall.totalMessages,
      Icon: MessageIcon,
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      shadow: 'rgba(20, 184, 166, 0.3)',
    },
    {
      title: 'Total Tokens',
      value: data.overall.totalTokens,
      Icon: TokenIcon,
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      shadow: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'User Messages',
      value: data.overall.userMessages,
      Icon: PersonIcon,
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      shadow: 'rgba(59, 130, 246, 0.3)',
    },
    {
      title: 'AI Messages',
      value: data.overall.aiMessages,
      Icon: AIIcon,
      gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
      shadow: 'rgba(251, 146, 60, 0.3)',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map(({ title, value, Icon, gradient }) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={title}>
          <Card
            sx={{
              borderRadius: 2,
              background: gradient,
              boxShadow: `none`,
              border: `none`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'white' }}>
                <Icon sx={{ mr: 1, fontSize: '1.5em' }} />
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.95, fontSize: '0.95em', fontWeight: 500 }}
                >
                  {title}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                {value.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * UsageOverviewCardsSkeleton Component
 * Shows skeleton loaders while overview data is loading
 */
export const UsageOverviewCardsSkeleton: React.FC = () => {
  const skeletonCards = [
    { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
    { gradient: ' linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  ];

  return (
    <Grid container spacing={3}>
      {skeletonCards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card
            sx={{
              borderRadius: 3,
              background: card.gradient,
              boxShadow: `none`,
              border: `none`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ mr: 1, bgcolor: 'rgba(255, 255, 255, 0.3)' }}
                />
                <Skeleton
                  variant="text"
                  width={120}
                  height={20}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }}
                />
              </Box>
              <Skeleton
                variant="text"
                width="60%"
                height={48}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default UsageOverviewCards;
