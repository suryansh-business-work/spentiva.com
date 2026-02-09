import React, { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton, Avatar, useTheme, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddIcon from '@mui/icons-material/Add';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';
import NavigationDrawer from './NavigationDrawer';
import SupportDialog from '../Support/SupportDialog';

interface HeaderProps {
  onCreateTracker?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateTracker }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeMode();
  const { user } = useAuth();

  const isTrackersPage = location.pathname.startsWith('/tracker') || location.pathname === '/';

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: '46px !important', height: 46, px: 1.5, gap: 0.5 }}>
          <Box sx={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/trackers')}>
            <Logo width={80} height={22} showSubtitle={false} />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Create Tracker Button — always visible */}
          {onCreateTracker && isTrackersPage && (
            <Tooltip title="Create Tracker" arrow>
              <IconButton
                onClick={onCreateTracker}
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: 1.5,
                  width: 30,
                  height: 30,
                  '&:hover': { bgcolor: theme.palette.primary.dark },
                }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}

          {/* Dark/Light Mode Toggle */}
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 1.5,
              width: 30,
              height: 30,
            }}
          >
            {isDarkMode ? (
              <LightModeIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
            )}
          </IconButton>

          {/* Support Icon */}
          <Tooltip title="Contact Support" arrow>
            <IconButton
              onClick={() => setSupportDialogOpen(true)}
              size="small"
              sx={{
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                borderRadius: 1.5,
                width: 30,
                height: 30,
              }}
            >
              <SupportAgentIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          {/* User Avatar - Opens Drawer */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            size="small"
            sx={{
              p: 0.25,
              border: `1.5px solid ${theme.palette.divider}`,
              '&:hover': { borderColor: theme.palette.primary.main },
            }}
          >
            <Avatar
              src={user?.profilePicture}
              sx={{
                width: 24,
                height: 24,
                background: theme.palette.primary.main,
                fontSize: '0.7rem',
              }}
            >
              {user?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <NavigationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SupportDialog open={supportDialogOpen} onClose={() => setSupportDialogOpen(false)} />
    </>
  );
};

export default Header;
