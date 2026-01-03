import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentIcon from '@mui/icons-material/Payment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type AdminSection = 'dashboard' | 'users' | 'support' | 'payments';

interface AdminSidebarProps {
  isMobile?: boolean;
  onMobileClose?: () => void;
  onExpandedChange?: (expanded: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobile = false,
  onMobileClose,
  onExpandedChange,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Get expanded state from localStorage (only for desktop)
  const [expanded, setExpanded] = useState<boolean>(() => {
    if (isMobile) return true;
    const saved = localStorage.getItem('adminSidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save expanded state to localStorage (desktop only)
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('adminSidebarExpanded', JSON.stringify(expanded));
      if (onExpandedChange) {
        onExpandedChange(expanded);
      }
    }
  }, [expanded, isMobile, onExpandedChange]);

  // Determine active section from URL path
  const getActiveSection = (): AdminSection | null => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'dashboard';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/support')) return 'support';
    if (path.includes('/admin/payments')) return 'payments';
    return null;
  };

  const activeSection = getActiveSection();

  const menuItems: Array<{
    id: AdminSection;
    label: string;
    icon: React.ReactElement;
    path: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { id: 'users', label: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
    { id: 'support', label: 'Support Tickets', icon: <SupportAgentIcon />, path: '/admin/support' },
    { id: 'payments', label: 'Payment Logs', icon: <PaymentIcon />, path: '/admin/payments' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Mobile always shows full labels
  const showLabels = isMobile ? true : expanded;
  const sidebarWidth = showLabels ? (isMobile ? '100%' : 240) : 72;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        py: 2,
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Collapse/Expand Toggle (Desktop only) */}
      {!isMobile && (
        <>
          <Box
            sx={{ px: 1, mb: 1, display: 'flex', justifyContent: expanded ? 'flex-end' : 'center' }}
          >
            <Tooltip title={expanded ? 'Collapse sidebar' : 'Expand sidebar'} placement="right">
              <IconButton onClick={toggleExpanded} size="small">
                {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ mb: 1 }} />
        </>
      )}

      {/* Menu Items */}
      <List sx={{ flex: 1 }}>
        {menuItems.map(item => {
          const isActive = activeSection === item.id;

          return (
            <Tooltip key={item.id} title={showLabels ? '' : item.label} placement="right" arrow>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActive}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  justifyContent: showLabels ? 'flex-start' : 'center',
                  px: showLabels ? 2 : 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor:
                      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  },
                  '&.Mui-selected': {
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: showLabels ? 40 : 'auto',
                    color: isActive ? '#fff' : theme.palette.text.secondary,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {showLabels && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
};

export default AdminSidebar;
