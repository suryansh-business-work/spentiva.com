import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Grow,
  useTheme,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Tracker } from '../types/tracker.types';
import { palette, darkPalette } from '../../../theme/palette';

interface TrackerCardProps {
  tracker: Tracker;
  index: number;
  onOpen: (tracker: Tracker) => void;
  onMoreActions: (event: React.MouseEvent<HTMLElement>, tracker: Tracker) => void;
  getCurrencySymbol: (currency: string) => string;
}

const TrackerCard: React.FC<TrackerCardProps> = ({
  tracker,
  index,
  onOpen,
  onMoreActions,
  getCurrencySymbol,
}) => {
  const theme = useTheme();

  // Use colors from palette based on theme mode
  const paletteSource = theme.palette.mode === 'dark' ? darkPalette : palette;
  const colorScheme =
    tracker.type === 'business'
      ? paletteSource.trackerTypes.business
      : paletteSource.trackerTypes.personal;

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Grow in={true} timeout={300 + index * 100}>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          background: theme.palette.background.paper,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colorScheme.primary,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: colorScheme.gradient,
          },
        }}
        onClick={() => onOpen(tracker)}
      >
        <CardContent sx={{ flexGrow: 1, p: { xs: 1.75, sm: 2 } }}>
          {/* Header Row */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                className="tracker-icon-box"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colorScheme.gradient,
                  transition: 'transform 0.3s ease',
                }}
              >
                {tracker.type === 'business' ? (
                  <BusinessIcon sx={{ color: theme.palette.primary.contrastText, fontSize: 20 }} />
                ) : (
                  <PersonIcon sx={{ color: theme.palette.primary.contrastText, fontSize: 20 }} />
                )}
              </Box>
              <Chip
                label={tracker.type}
                size="small"
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 22,
                  background: colorScheme.bg,
                  color: colorScheme.primary,
                  border: `1px solid ${colorScheme.border}`,
                  borderRadius: 1,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Chip
                label={getCurrencySymbol(tracker.currency)}
                size="small"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  height: 22,
                  background: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                }}
              />
              <IconButton
                size="small"
                onClick={e => onMoreActions(e, tracker)}
                aria-label={`More actions for ${tracker.name}`}
                aria-haspopup="menu"
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    background: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Tracker Name */}
          <Typography
            variant="h6"
            fontWeight="700"
            gutterBottom
            sx={{
              mb: 0.75,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: theme.palette.text.primary,
              lineHeight: 1.2,
            }}
          >
            {tracker.name}
          </Typography>

          {/* Description */}
          {tracker.description && (
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4,
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.8rem', sm: '0.85rem' },
              }}
            >
              {tracker.description}
            </Typography>
          )}

          {/* Created Date */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.25,
              py: 0.5,
              borderRadius: 1,
              background: theme.palette.action.hover,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CalendarTodayIcon
              sx={{
                fontSize: 14,
                color: colorScheme.primary,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Created {formatDate(tracker.createdAt)}
            </Typography>
          </Box>
        </CardContent>

        {/* Footer Button */}
        <CardActions sx={{ px: 1.75, pb: 1.75, pt: 0 }}>
          <Button
            size="small"
            variant="contained"
            onClick={e => {
              e.stopPropagation();
              onOpen(tracker);
            }}
            aria-label={`Open ${tracker.name} tracker`}
            sx={{
              flexGrow: 1,
              background: colorScheme.gradient,
              color: theme.palette.primary.contrastText,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1,
              py: 0.875,
              fontSize: '0.875rem',
              border: 'none',
              '&:hover': {
                background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.light} 100%)`,
                boxShadow: `0 4px 12px ${colorScheme.bg}`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Open Tracker
          </Button>
        </CardActions>
      </Card>
    </Grow>
  );
};

export default TrackerCard;
