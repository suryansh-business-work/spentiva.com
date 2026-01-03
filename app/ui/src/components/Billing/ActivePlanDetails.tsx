import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
  useTheme,
  Grid,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MessageIcon from '@mui/icons-material/Message';

interface ActivePlanDetailsProps {
  trackerCount: number;
  messageCount: number;
}

const ActivePlanDetails: React.FC<ActivePlanDetailsProps> = ({ trackerCount, messageCount }) => {
  const theme = useTheme();

  const UsageItem = ({
    icon,
    label,
    current,
    limit,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    current: number;
    limit: string;
    color: string;
  }) => {
    const isUnlimited = limit === 'Unlimited';
    const percentage = isUnlimited ? 0 : Math.min((current / parseInt(limit)) * 100, 100);

    return (
      <Box>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}20` }}>{icon}</Box>
          <Box flex={1}>
            <Typography variant="body2" fontWeight={700} mb={0.5}>
              {label}
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography variant="h5" fontWeight={800} color={color}>
                {current}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                / {limit}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        {!isUnlimited && (
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
              '& .MuiLinearProgress-bar': {
                bgcolor: color,
                borderRadius: 4,
              },
            }}
          />
        )}
        {isUnlimited && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No limits - use as much as you need!
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        bgcolor:
          theme.palette.mode === 'dark' ? 'rgba(251, 191, 36, 0.05)' : 'rgba(251, 191, 36, 0.03)',
        border: `2px solid ${theme.palette.warning.main}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={800} mb={3} color="warning.main">
          Your Business Pro Usage
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <UsageItem
              icon={<FolderIcon sx={{ color: theme.palette.warning.main }} />}
              label="Trackers"
              current={trackerCount}
              limit="Unlimited"
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <UsageItem
              icon={<MessageIcon sx={{ color: theme.palette.warning.main }} />}
              label="Messages"
              current={messageCount}
              limit="Unlimited"
              color={theme.palette.warning.main}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ActivePlanDetails;
