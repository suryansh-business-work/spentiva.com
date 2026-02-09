import React from 'react';
import { Box, Typography, Button, Paper, Chip, Stack, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

interface TrackerDetailsProps {
  tracker: {
    name: string;
    description?: string;
    type: string;
    currency: string;
  };
  onEdit: () => void;
}

const CURRENCY_MAP: Record<string, string> = {
  INR: '₹ INR — Indian Rupee',
  USD: '$ USD — US Dollar',
  EUR: '€ EUR — Euro',
  GBP: '£ GBP — British Pound',
};

const TrackerDetailsSection: React.FC<TrackerDetailsProps> = ({ tracker, onEdit }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Paper
        elevation={0}
        sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            Tracker Details
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon sx={{ fontSize: 16 }} />}
            onClick={onEdit}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
          >
            Edit
          </Button>
        </Box>

        <Stack spacing={2.5}>
          {/* Name */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              Tracker Name
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {tracker.name}
            </Typography>
          </Box>

          {/* Description */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              Description
            </Typography>
            <Typography variant="body2" color={tracker.description ? 'text.primary' : 'text.disabled'}>
              {tracker.description || 'No description provided'}
            </Typography>
          </Box>

          {/* Type & Currency chips */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip
              icon={
                tracker.type === 'business' ? (
                  <BusinessIcon sx={{ fontSize: 16 }} />
                ) : (
                  <PersonIcon sx={{ fontSize: 16 }} />
                )
              }
              label={tracker.type.charAt(0).toUpperCase() + tracker.type.slice(1)}
              variant="outlined"
              color={tracker.type === 'business' ? 'primary' : 'success'}
              sx={{ fontWeight: 600, borderRadius: 1.5 }}
            />
            <Chip
              icon={<CurrencyExchangeIcon sx={{ fontSize: 16 }} />}
              label={CURRENCY_MAP[tracker.currency] || tracker.currency}
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: 1.5 }}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default TrackerDetailsSection;
