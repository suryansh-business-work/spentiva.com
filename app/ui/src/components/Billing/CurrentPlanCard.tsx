import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip, useTheme } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MessageIcon from '@mui/icons-material/Message';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CurrentPlanCardProps {
  plan: string;
  trackerCount: number;
  messageCount: number;
}

/**
 * CurrentPlanCard Component
 * Displays current plan with usage statistics
 */
const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ plan, trackerCount, messageCount }) => {
  const theme = useTheme();
  const isFree = plan === 'Free';

  // Free plan limits
  const trackerLimit = isFree ? 3 : Infinity;
  const messageLimit = isFree ? 100 : Infinity;

  const trackerProgress = isFree ? (trackerCount / trackerLimit) * 100 : 100;
  const messageProgress = isFree ? (messageCount / messageLimit) * 100 : 100;

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `2px solid ${theme.palette.divider}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {plan} Plan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your current subscription
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircleIcon />}
            label="Active"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Usage Stats */}
        <Box>
          {/* Trackers */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FolderIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Trackers
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {trackerCount} {isFree ? `of ${trackerLimit}` : '(Unlimited)'}
              </Typography>
              {isFree && (
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      trackerProgress > 80
                        ? theme.palette.warning.main
                        : theme.palette.text.secondary,
                    fontWeight: 600,
                  }}
                >
                  {Math.round(trackerProgress)}%
                </Typography>
              )}
            </Box>
            {isFree && (
              <LinearProgress
                variant="determinate"
                value={Math.min(trackerProgress, 100)}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: theme.palette.action.hover,
                  '& .MuiLinearProgress-bar': {
                    bgcolor:
                      trackerProgress > 80
                        ? theme.palette.warning.main
                        : theme.palette.primary.main,
                    borderRadius: 1,
                  },
                }}
              />
            )}
          </Box>

          {/* Messages */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <MessageIcon sx={{ fontSize: 20, color: theme.palette.success.main }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Messages
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {messageCount} {isFree ? `of ${messageLimit}` : '(Unlimited)'}
              </Typography>
              {isFree && (
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      messageProgress > 80
                        ? theme.palette.warning.main
                        : theme.palette.text.secondary,
                    fontWeight: 600,
                  }}
                >
                  {Math.round(messageProgress)}%
                </Typography>
              )}
            </Box>
            {isFree && (
              <LinearProgress
                variant="determinate"
                value={Math.min(messageProgress, 100)}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: theme.palette.action.hover,
                  '& .MuiLinearProgress-bar': {
                    bgcolor:
                      messageProgress > 80
                        ? theme.palette.warning.main
                        : theme.palette.success.main,
                    borderRadius: 1,
                  },
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CurrentPlanCard;
