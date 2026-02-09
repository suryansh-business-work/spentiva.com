import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface TrackerHeaderProps {
  trackerName: string;
  trackerType: string;
  tabValue: number;
  onTabChange: (newValue: number) => void;
  onBack: () => void;
}

const TrackerHeader: React.FC<TrackerHeaderProps> = ({
  trackerName,
  trackerType,
  tabValue,
  onTabChange,
  onBack,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const accentColor =
    trackerType === 'business' ? theme.palette.primary.main : theme.palette.success.main;

  const handleMenuItemClick = (tabIndex: number) => {
    setMenuAnchor(null);
    onTabChange(tabIndex);
  };

  // Tab index: 0=chat, 1=dashboard, 2=transactions, 3=settings, 4=share (settings with share sub-tab)
  const handleShareClick = () => {
    setMenuAnchor(null);
    // 4 signals "open settings with Share sub-tab"
    onTabChange(4);
  };

  const tabSx = {
    flex: 1,
    minHeight: { xs: 42, sm: 46 },
    '& .MuiTab-root': {
      minHeight: { xs: 42, sm: 46 },
      py: 0,
      px: { xs: 1, sm: 1.5 },
      fontSize: { xs: '0.75rem', sm: '0.8rem' },
      fontWeight: 500,
      textTransform: 'none' as const,
      minWidth: 0,
      color: theme.palette.text.secondary,
      '&.Mui-selected': { color: accentColor, fontWeight: 600 },
    },
    '& .MuiTabs-indicator': {
      bgcolor: accentColor,
      height: 2.5,
      borderRadius: '2px 2px 0 0',
    },
    '& .MuiTab-iconWrapper': { fontSize: '1rem', mr: 0.5 },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: { xs: 42, sm: 46 },
        minHeight: { xs: 42, sm: 46 },
        maxHeight: 48,
        px: { xs: 0.5, sm: 1 },
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <IconButton
        onClick={onBack}
        size="small"
        sx={{ color: theme.palette.text.secondary, mr: 0.5 }}
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Typography
        variant="subtitle2"
        noWrap
        sx={{
          fontWeight: 700,
          fontSize: { xs: '0.85rem', sm: '0.9rem' },
          mr: 1,
          maxWidth: { xs: 100, sm: 160 },
        }}
      >
        {trackerName}
      </Typography>

      {isMobile ? (
        <>
          <Tabs
            value={tabValue <= 1 ? tabValue : false}
            onChange={(_e, v) => onTabChange(v)}
            variant="scrollable"
            scrollButtons={false}
            sx={tabSx}
          >
            <Tab icon={<ChatIcon />} label="Chat" iconPosition="start" />
            <Tab icon={<DashboardIcon />} label="Dashboard" iconPosition="start" />
          </Tabs>
          <IconButton
            size="small"
            onClick={e => setMenuAnchor(e.currentTarget)}
            sx={{
              color: tabValue >= 2 ? accentColor : theme.palette.text.secondary,
              ml: 0.5,
            }}
          >
            <MoreVertIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            slotProps={{ paper: { sx: { minWidth: 180 } } }}
          >
            <MenuItem selected={tabValue === 2} onClick={() => handleMenuItemClick(2)}>
              <ListItemIcon>
                <ReceiptLongIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Transactions</ListItemText>
            </MenuItem>
            <MenuItem selected={tabValue === 3} onClick={() => handleMenuItemClick(3)}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleShareClick}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share</ListItemText>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Tabs
          value={tabValue}
          onChange={(_e, v) => onTabChange(v)}
          variant="scrollable"
          scrollButtons={false}
          sx={tabSx}
        >
          <Tab icon={<ChatIcon />} label="Chat" iconPosition="start" />
          <Tab icon={<DashboardIcon />} label="Dashboard" iconPosition="start" />
          <Tab icon={<ReceiptLongIcon />} label="Transactions" iconPosition="start" />
          <Tab icon={<SettingsIcon />} label="Settings" iconPosition="start" />
        </Tabs>
      )}
    </Box>
  );
};

export default TrackerHeader;
