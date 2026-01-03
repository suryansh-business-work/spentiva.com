import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, useTheme, Stack } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MessageIcon from '@mui/icons-material/Message';
import { PLAN_NAMES, PLAN_LIMITS, type PlanType } from '../../config/planConfig';

interface ActivePlanDisplayProps {
  plan: PlanType;
  trackerCount: number;
  messageCount: number;
}

const ActivePlanDisplay: React.FC<ActivePlanDisplayProps> = ({
  plan,
  trackerCount,
  messageCount,
}) => {
  const theme = useTheme();
  const limits = PLAN_LIMITS[plan];
  const isUnlimited = plan === 'businesspro';

  const trackerProgress = isUnlimited ? 100 : Math.min((trackerCount / limits.trackers) * 100, 100);
  const messageProgress = isUnlimited ? 100 : Math.min((messageCount / limits.messages) * 100, 100);

  const getProgressColor = (progress: number) => {
    if (progress > 80) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `2px solid ${theme.palette.success.main}`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(0,0,0,0.1)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={800} mb={3} color="success.main">
          Your Active Plan: {PLAN_NAMES[plan]}
        </Typography>

        <Stack spacing={3}>
          {/* Trackers Progress */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
              <FolderIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
              <Typography variant="body1" fontWeight={700}>
                Trackers
              </Typography>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {trackerCount} {isUnlimited ? '(Unlimited)' : `of ${limits.trackers}`}
              </Typography>
              {!isUnlimited && (
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={getProgressColor(trackerProgress)}
                >
                  {Math.round(trackerProgress)}%
                </Typography>
              )}
            </Box>
            {!isUnlimited && (
              <LinearProgress
                variant="determinate"
                value={trackerProgress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getProgressColor(trackerProgress),
                    borderRadius: 5,
                  },
                }}
              />
            )}
          </Box>

          {/* Messages Progress */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
              <MessageIcon sx={{ color: theme.palette.success.main, fontSize: 24 }} />
              <Typography variant="body1" fontWeight={700}>
                Messages This Month
              </Typography>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {messageCount} {isUnlimited ? '(Unlimited)' : `of ${limits.messages}`}
              </Typography>
              {!isUnlimited && (
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={getProgressColor(messageProgress)}
                >
                  {Math.round(messageProgress)}%
                </Typography>
              )}
            </Box>
            {!isUnlimited && (
              <LinearProgress
                variant="determinate"
                value={messageProgress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getProgressColor(messageProgress),
                    borderRadius: 5,
                  },
                }}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ActivePlanDisplay;
