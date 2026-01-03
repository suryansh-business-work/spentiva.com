import React from 'react';
import { Box, Card, CardContent, Typography, Chip, useTheme } from '@mui/material';

interface StatCardsProps {
  summary: {
    total: number;
    average: number;
    count: number;
  };
}

const StatCards: React.FC<StatCardsProps> = ({ summary }) => {
  const theme = useTheme();

  const cards = [
    {
      title: 'Total Expenses',
      value: `₹${summary.total.toLocaleString('en-IN')}`,
      chip: '8/10',
      chipLabel: 'Overall Score',
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    },
    {
      title: 'Average Expense',
      value: `₹${Math.round(summary.average).toLocaleString('en-IN')}`,
      chip: '25',
      chipLabel: 'Ranking',
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    },
    {
      title: 'Total Transactions',
      value: summary.count,
      chip: '$15',
      chipLabel: 'Incentives worth',
      gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 3,
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          sx={{
            background: card.gradient,
            color: theme.palette.primary.contrastText,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 1,
            border: 'none',
          }}
        >
          <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 2, md: 2.5 } }}>
            <Typography
              variant="subtitle2"
              sx={{
                opacity: 0.9,
                mb: 1,
                fontSize: { xs: '0.75rem', md: '0.85rem' },
                fontWeight: 500,
              }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              }}
            >
              {card.value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.9 }}>
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                {card.chipLabel}
              </Typography>
              <Chip
                label={card.chip}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default StatCards;
