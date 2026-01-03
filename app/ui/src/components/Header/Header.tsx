import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Avatar, useTheme, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FolderIcon from '@mui/icons-material/Folder';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';
import NavigationDrawer from './NavigationDrawer';
import SupportDialog from '../Support/SupportDialog';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeMode();
  const { user } = useAuth();

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
        <Toolbar sx={{ minHeight: '64px !important', height: 64, px: 2, gap: 1.5 }}>
          <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/trackers')}>
            <Logo width={100} height={28} />
          </Box>

          {/* Dark/Light Mode Toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 2,
              px: 1.5,
              py: 0.75,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
              },
            }}
          >
            {isDarkMode ? (
              <LightModeIcon sx={{ fontSize: 20, color: theme.palette.warning.main }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
            )}
          </IconButton>

          {/* Support Icon */}
          <Tooltip title="Contact Support" arrow>
            <IconButton
              onClick={() => setSupportDialogOpen(true)}
              sx={{
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                },
              }}
            >
              <SupportAgentIcon />
            </IconButton>
          </Tooltip>

          {/* Trackers Button */}
          <Button
            startIcon={<FolderIcon />}
            size="small"
            onClick={() => navigate('/trackers')}
            sx={{
              color:
                location.pathname === '/trackers'
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.primary,
              textTransform: 'none',
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              minHeight: 32,
              borderRadius: 1,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              background:
                location.pathname === '/trackers' ? theme.palette.primary.main : 'transparent',
              '&:hover': {
                background:
                  location.pathname === '/trackers'
                    ? theme.palette.primary.dark
                    : theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            Trackers
          </Button>

          {/* User Avatar - Opens Drawer */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            size="small"
            sx={{
              p: 0.25,
              border: `1.5px solid ${theme.palette.divider}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                background: theme.palette.primary.main,
                fontSize: '0.8rem',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <NavigationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Support Dialog */}
      <SupportDialog open={supportDialogOpen} onClose={() => setSupportDialogOpen(false)} />
    </>
  );
};

export default Header;
