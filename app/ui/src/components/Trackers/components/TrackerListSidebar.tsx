import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Skeleton,
  Avatar,
  AvatarGroup,
  Tooltip,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Tracker } from '../types/tracker.types';

interface MonthlyStats {
  income: number;
  expense: number;
}

interface TrackerListSidebarProps {
  trackers: Tracker[];
  loading: boolean;
  searchTerm: string;
  activeTrackerId?: string;
  monthlyStats: Record<string, MonthlyStats>;
  onSearchChange: (value: string) => void;
  onTrackerClick: (tracker: Tracker) => void;
}

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return symbols[currency] || currency;
};

const formatAmount = (amount: number) => {
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toFixed(0);
};

const TrackerListSidebar: React.FC<TrackerListSidebarProps> = ({
  trackers,
  loading,
  searchTerm,
  activeTrackerId,
  monthlyStats,
  onSearchChange,
  onTrackerClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Search */}
      <Box sx={{ p: 1.5, pb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search trackers..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              fontSize: '0.85rem',
              height: 36,
            },
          }}
        />
      </Box>

      {/* Tracker List */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ p: 1 }}>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} variant="rectangular" height={56} sx={{ borderRadius: 1, mb: 0.5 }} />
            ))}
          </Box>
        ) : trackers.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'No trackers found' : 'No trackers yet'}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {trackers.map(tracker => {
              const stats = monthlyStats[tracker.id];
              const sym = getCurrencySymbol(tracker.currency);
              const isActive = activeTrackerId === tracker.id;

              return (
                <ListItem key={tracker.id} disablePadding sx={{
                  bgcolor: isActive
                    ? theme.palette.mode === 'dark' ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)'
                    : 'transparent',
                  borderLeft: isActive
                    ? `3px solid ${theme.palette.success.main}`
                    : '3px solid transparent',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  '&:hover': { bgcolor: theme.palette.action.hover },
                }}>
                  <ListItemButton onClick={() => onTrackerClick(tracker)} sx={{ py: 1, px: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: tracker.type === 'business'
                          ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                          : `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      }}>
                        {tracker.type === 'business'
                          ? <BusinessIcon sx={{ fontSize: 16 }} />
                          : <PersonIcon sx={{ fontSize: 16 }} />}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight={isActive ? 700 : 600}
                          noWrap
                          sx={{ fontSize: '0.85rem' }}
                        >
                          {tracker.name}
                        </Typography>
                      }
                      secondary={
                        stats ? (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.25 }}>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                              <TrendingDownIcon sx={{ fontSize: 12, color: 'error.main' }} />
                              <Typography variant="caption" sx={{ fontSize: '0.68rem', color: 'error.main', fontWeight: 600 }}>
                                {sym}{formatAmount(stats.expense)}
                              </Typography>
                            </Box>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                              <TrendingUpIcon sx={{ fontSize: 12, color: 'success.main' }} />
                              <Typography variant="caption" sx={{ fontSize: '0.68rem', color: 'success.main', fontWeight: 600 }}>
                                {sym}{formatAmount(stats.income)}
                              </Typography>
                            </Box>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem' }}>
                                {tracker.type} &middot;{' '}
                                {new Date(tracker.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem' }}>
                              Loading...
                            </Typography>
                        )
                      }
                    />
                    {/* Shared user avatars */}
                    {tracker.sharedWith && tracker.sharedWith.length > 0 && (
                      <AvatarGroup max={3} sx={{
                        ml: 1, flexShrink: 0,
                        '& .MuiAvatar-root': { width: 22, height: 22, fontSize: '0.6rem', border: `1.5px solid ${theme.palette.background.paper}` },
                      }}>
                        {tracker.sharedWith.map((u) => (
                          <Tooltip key={u.email} title={u.name || u.email} arrow>
                            <Avatar sx={{ bgcolor: u.status === 'accepted' ? 'success.main' : 'warning.main' }}>
                              {(u.name || u.email).charAt(0).toUpperCase()}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default TrackerListSidebar;
