import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface DangerZoneSectionProps {
  trackerId: string;
  onDelete: () => void;
}

const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({ onDelete }) => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <WarningAmberIcon color="error" sx={{ fontSize: 20 }} />
        <Typography variant="subtitle1" fontWeight={600} color="error.main">
          Danger Zone
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
          <Box sx={{ color: 'error.main', mt: 0.25 }}>
            <DeleteOutlineIcon />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Delete Tracker
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Permanently delete this tracker and all its data including expenses, categories, and
              shared access.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onDelete}
          sx={{ textTransform: 'none', whiteSpace: 'nowrap', minWidth: 'fit-content' }}
        >
          Delete Tracker
        </Button>
      </Box>
    </Box>
  );
};

export default DangerZoneSection;
