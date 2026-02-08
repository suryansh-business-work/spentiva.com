import React from 'react';
import {
  SwipeableDrawer,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { Tracker } from '../types/tracker.types';

interface TrackerActionsDrawerProps {
  anchorEl: HTMLElement | null;
  tracker: Tracker | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSettings: () => void;
  onAddToHome: () => void;
  getCurrencySymbol: (currency: string) => string;
}

const TrackerActionsDrawer: React.FC<TrackerActionsDrawerProps> = ({
  anchorEl,
  tracker,
  onClose,
  onEdit,
  onDelete,
  onSettings,
  getCurrencySymbol,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const open = Boolean(anchorEl) || Boolean(tracker);

  // Mobile: Bottom Drawer
  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open && Boolean(tracker)}
        onClose={onClose}
        onOpen={() => {}}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80vh',
            bgcolor: theme.palette.background.paper,
            backgroundImage: 'none',
          },
        }}
      >
        {tracker && (
          <Box sx={{ p: 3 }}>
            {/* Header with Close Button */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
                Tracker Options
              </Typography>
              <IconButton
                onClick={onClose}
                size="small"
                sx={{ color: theme.palette.text.secondary }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Tracker Info Section */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                bgcolor: theme.palette.action.hover,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {tracker.type === 'business' ? (
                    <BusinessIcon sx={{ color: theme.palette.primary.contrastText }} />
                  ) : (
                    <PersonIcon sx={{ color: theme.palette.primary.contrastText }} />
                  )}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 0.5 }}
                  >
                    {tracker.name}
                  </Typography>
                  {tracker.description && (
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                      {tracker.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={tracker.type}
                      size="small"
                      sx={{
                        textTransform: 'capitalize',
                        bgcolor: theme.palette.success.light,
                        color: theme.palette.success.dark,
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={getCurrencySymbol(tracker.currency)}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.action.selected,
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={new Date(tracker.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.action.selected,
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box>
              <MenuItem
                onClick={() => {
                  onSettings();
                  onClose();
                }}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon>
                  <SettingsIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Settings"
                  primaryTypographyProps={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                  }}
                />
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onEdit();
                  onClose();
                }}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon>
                  <EditIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Edit Tracker"
                  primaryTypographyProps={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                  }}
                />
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: theme.palette.error.light,
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteIcon sx={{ color: theme.palette.error.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Delete Tracker"
                  primaryTypographyProps={{
                    color: theme.palette.error.main,
                    fontWeight: 500,
                  }}
                />
              </MenuItem>
            </Box>
          </Box>
        )}
      </SwipeableDrawer>
    );
  }

  // Desktop: Menu
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      TransitionComponent={undefined}
      PaperProps={{
        elevation: 0,
        sx: {
          minWidth: 200,
          borderRadius: 3,
          mt: 1,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[3],
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <MenuItem
        onClick={() => {
          onSettings();
          onClose();
        }}
        sx={{
          py: 1.5,
          borderRadius: 2,
          mx: 1,
          my: 0.5,
          '&:hover': {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <ListItemIcon>
          <SettingsIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
        </ListItemIcon>
        <ListItemText sx={{ color: theme.palette.text.primary }}>Settings</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onEdit();
          onClose();
        }}
        sx={{
          py: 1.5,
          borderRadius: 2,
          mx: 1,
          my: 0.5,
          '&:hover': {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
        </ListItemIcon>
        <ListItemText sx={{ color: theme.palette.text.primary }}>Edit Tracker</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
        sx={{
          py: 1.5,
          borderRadius: 2,
          mx: 1,
          my: 0.5,
          '&:hover': {
            bgcolor: theme.palette.error.light,
          },
        }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
        </ListItemIcon>
        <ListItemText sx={{ color: theme.palette.error.main }}>Delete Tracker</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default TrackerActionsDrawer;
