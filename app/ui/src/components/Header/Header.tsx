import React, { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton, Avatar, useTheme, Tooltip, Button } from '@mui/material';
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

  const isTrackersPage = location.pathname === '/trackers' || location.pathname === '/';

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
        <Toolbar sx={{ minHeight: '52px !important', height: 52, px: 2, gap: 1 }}>
          <Box sx={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/trackers')}>
            <Logo width={90} height={24} />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Create Tracker Button — only visible on /trackers */}
          {onCreateTracker && isTrackersPage && (
            <Button
              onClick={onCreateTracker}
              size="small"
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 32,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                borderRadius: 1.5,
                px: 1.5,
              }}
            >
              Create Tracker
            </Button>
          )}

          {/* Dark/Light Mode Toggle */}
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 1.5,
              width: 32,
              height: 32,
            }}
          >
            {isDarkMode ? (
              <LightModeIcon sx={{ fontSize: 18, color: theme.palette.warning.main }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
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
                width: 32,
                height: 32,
              }}
            >
              <SupportAgentIcon sx={{ fontSize: 18 }} />
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
                width: 26,
                height: 26,
                background: theme.palette.primary.main,
                fontSize: '0.75rem',
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
