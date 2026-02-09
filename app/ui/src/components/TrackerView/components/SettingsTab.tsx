import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Stack,
  useTheme,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CategorySettings from '../../CategorySettings/CategorySettings';
import { endpoints } from '../../../config/api';
import { postRequest } from '../../../utils/http';

interface SettingsTabProps {
  trackerId: string;
  tracker: {
    name: string;
    description?: string;
    type: string;
    currency: string;
    botImage?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onBotImageChange?: (url: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  trackerId,
  tracker,
  onEdit,
  onDelete,
  onBotImageChange,
}) => {
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onBotImageChange) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `trackers/${trackerId}`);
      const res = await postRequest(endpoints.imagekit.upload, formData);
      const data = res?.data;
      if (data?.url) onBotImageChange(data.url);
    } catch {
      /* silent fail */
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, overflowY: 'auto', height: '100%' }}>
      {/* Bot Image Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2.5,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
          Bot Avatar
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={tracker.botImage}
              sx={{
                width: 64,
                height: 64,
                bgcolor: theme.palette.primary.main,
                fontSize: '1.5rem',
              }}
            >
              {tracker.name.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton
              component="label"
              size="small"
              disabled={uploading}
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                width: 28,
                height: 28,
                '&:hover': { bgcolor: theme.palette.action.hover },
              }}
            >
              {uploading ? (
                <CircularProgress size={14} />
              ) : (
                <PhotoCameraIcon sx={{ fontSize: 14 }} />
              )}
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Upload a custom avatar for your tracker bot
          </Typography>
        </Box>
      </Paper>

      {/* Tracker Info Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2.5,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Tracker Details
          </Typography>
          <Button
            size="small"
            startIcon={<EditIcon sx={{ fontSize: 16 }} />}
            onClick={onEdit}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Edit
          </Button>
        </Box>
        <Stack spacing={1.5}>
          <TextField
            label="Name"
            value={tracker.name}
            size="small"
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Description"
            value={tracker.description || '—'}
            size="small"
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              label="Type"
              value={tracker.type}
              size="small"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
              sx={{ textTransform: 'capitalize' }}
            />
            <TextField
              label="Currency"
              value={tracker.currency}
              size="small"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Category Settings */}
      <Paper
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <CategorySettings trackerId={trackerId} />
      </Paper>

      {/* Danger Zone */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: `1px solid ${theme.palette.error.main}30`,
          bgcolor: `${theme.palette.error.main}05`,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} color="error" sx={{ mb: 1 }}>
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Permanently delete this tracker and all associated data.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteOutlineIcon />}
          onClick={onDelete}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Delete Tracker
        </Button>
      </Paper>
    </Box>
  );
};

export default SettingsTab;
