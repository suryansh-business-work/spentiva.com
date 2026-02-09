import React, { useMemo } from 'react';
import {
  Drawer,
  Box,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShieldIcon from '@mui/icons-material/Shield';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../../contexts/AuthContext';
import { AUTH_CONFIG, isAdmin } from '../../config/auth-config';

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { logout, user } = useAuth();

  const drawerItems = useMemo(() => {
    const items = [
      { text: 'Usage', icon: <ShowChartIcon />, path: '/usage' },
      { text: 'Billing & Subscription', icon: <CreditCardIcon />, path: '/billing' },
      { text: 'Upcoming Features', icon: <RocketLaunchIcon />, path: '/upcoming-features' },
      { text: 'Privacy & Policy', icon: <ShieldIcon />, path: '/policy' },
    ];
    // Show Admin Panel if user has admin role
    if (isAdmin() || user?.roleSlug === 'admin') {
      items.unshift({
        text: 'Admin Panel',
        icon: <AdminPanelSettingsIcon />,
        path: '/admin',
      });
    }
    return items;
  }, [user?.roleSlug]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    // Logout function now handles both clearing state and redirecting to auth.spentiva.com/logout
    logout();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: 280, sm: 320 },
          background: theme.palette.background.paper,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Profile Section */}
        <Box
          onClick={() => {
            // Redirect to external profile
            window.location.href = AUTH_CONFIG.profileUrl;
          }}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            borderBottom: `1px solid ${theme.palette.divider}`,
            transition: 'background 0.2s ease',
            '&:hover': {
              background:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: theme.palette.primary.main,
              fontSize: '1.5rem',
              border: `2px solid ${theme.palette.divider}`,
            }}
          >
            {user?.firstName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.email}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.primary.main, fontWeight: 500, fontSize: '0.75rem' }}
            >
              View Profile
            </Typography>
          </Box>
        </Box>

        {/* Menu Items */}
        <List sx={{ flexGrow: 1, py: 1 }}>
          {drawerItems.map(item => (
            <ListItemButton
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  },
                  '&:hover': {
                    background: theme.palette.primary.dark,
                  },
                },
                '&:hover': {
                  background:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.secondary, minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        {/* Logout Button */}
        <Box sx={{ p: 2, pt: 1.5 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              border: `1px solid ${theme.palette.error.main}`,
              color: theme.palette.error.main,
              py: 1.25,
              transition: 'all 0.2s ease',
              '&:hover': {
                background:
                  theme.palette.mode === 'dark'
                    ? `${theme.palette.error.main}20`
                    : `${theme.palette.error.main}10`,
                borderColor: theme.palette.error.dark,
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NavigationDrawer;
