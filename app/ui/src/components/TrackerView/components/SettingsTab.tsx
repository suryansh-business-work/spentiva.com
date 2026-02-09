import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, useTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import FaceIcon from '@mui/icons-material/Face';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import ShareIcon from '@mui/icons-material/Share';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import CategorySettings from '../../CategorySettings/CategorySettings';
import BotAvatarSection from './settings/BotAvatarSection';
import TrackerDetailsSection from './settings/TrackerDetailsSection';
import ShareTrackerSection from './settings/ShareTrackerSection';
import ReportScheduleSection from './settings/ReportScheduleSection';
import { SharedUser } from '../../../types/tracker';

// Sub-tab route names
const SUBTAB_KEYS = ['bot-avatar', 'details', 'categories', 'share', 'reports'] as const;
type SubTabKey = (typeof SUBTAB_KEYS)[number];

interface SettingsTabProps {
  trackerId: string;
  tracker: {
    name: string;
    description?: string;
    type: string;
    currency: string;
    botImage?: string;
    isOwner?: boolean;
    sharedWith?: SharedUser[];
  };
  onEdit: () => void;
  onDelete: () => void;
  onBotImageChange?: (url: string) => void;
  onSharedUsersChange?: (users: SharedUser[]) => void;
  defaultSubTab?: number;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  trackerId,
  tracker,
  onEdit,
  onDelete,
  onBotImageChange,
  onSharedUsersChange,
  defaultSubTab = 0,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { subtab } = useParams<{ subtab?: string }>();

  // Determine initial sub-tab from URL or defaultSubTab
  const getInitialSubTab = () => {
    if (subtab) {
      const index = SUBTAB_KEYS.indexOf(subtab as SubTabKey);
      if (index !== -1) return index;
    }
    return defaultSubTab;
  };

  const [subTab, setSubTab] = useState(getInitialSubTab);

  // Update sub-tab when URL changes
  useEffect(() => {
    const newSubTab = getInitialSubTab();
    if (newSubTab !== subTab) {
      setSubTab(newSubTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtab]);

  const handleSubTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setSubTab(newValue);
    navigate(`/tracker/${trackerId}/settings/${SUBTAB_KEYS[newValue]}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub-tabs navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Tabs
          value={subTab}
          onChange={handleSubTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.8rem',
              px: 2,
            },
            '& .MuiTab-root.Mui-selected': { fontWeight: 600 },
            '& .MuiTabs-indicator': { height: 2.5, borderRadius: '2px 2px 0 0' },
          }}
        >
          <Tab icon={<FaceIcon sx={{ fontSize: 16 }} />} label="Bot Avatar" iconPosition="start" />
          <Tab
            icon={<InfoOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Tracker Details"
            iconPosition="start"
          />
          <Tab
            icon={<CategoryIcon sx={{ fontSize: 16 }} />}
            label="Categories & Payment Modes"
            iconPosition="start"
          />
          <Tab icon={<ShareIcon sx={{ fontSize: 16 }} />} label="Share" iconPosition="start" />
          <Tab
            icon={<ScheduleSendIcon sx={{ fontSize: 16 }} />}
            label="Reports"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Sub-tab content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
        {subTab === 0 && (
          <BotAvatarSection
            trackerId={trackerId}
            botImage={tracker.botImage}
            trackerName={tracker.name}
            onBotImageChange={onBotImageChange}
          />
        )}
        {subTab === 1 && (
          <TrackerDetailsSection tracker={tracker} onEdit={onEdit} onDelete={onDelete} />
        )}
        {subTab === 2 && (
          <Box
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
            }}
          >
            <CategorySettings trackerId={trackerId} />
          </Box>
        )}
        {subTab === 3 && (
          <ShareTrackerSection
            trackerId={trackerId}
            sharedWith={tracker.sharedWith || []}
            isOwner={tracker.isOwner !== false}
            onSharedUsersChange={onSharedUsersChange || (() => {})}
          />
        )}
        {subTab === 4 && <ReportScheduleSection trackerId={trackerId} trackerName={tracker.name} />}
      </Box>
    </Box>
  );
};

export default SettingsTab;
