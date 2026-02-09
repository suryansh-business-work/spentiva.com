import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { endpoints } from '../../../../config/api';
import { postRequest, putRequest } from '../../../../utils/http';
import { parseResponseData } from '../../../../utils/response-parser';

interface BotAvatarSectionProps {
  trackerId: string;
  botImage?: string;
  trackerName: string;
  onBotImageChange?: (url: string) => void;
}

const BotAvatarSection: React.FC<BotAvatarSectionProps> = ({
  trackerId,
  botImage,
  trackerName,
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
      const data = parseResponseData<any[]>(res, []);
      const fileUrl = data?.[0]?.filePath?.fileUrl;
      if (fileUrl) {
        await putRequest(endpoints.trackers.update(trackerId), { botImage: fileUrl });
        onBotImageChange(fileUrl);
      }
    } catch {
      /* silent fail */
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
    >
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
        Bot Avatar
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={botImage}
            sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main, fontSize: '2rem' }}
          >
            {trackerName.charAt(0).toUpperCase()}
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
              width: 30,
              height: 30,
              '&:hover': { bgcolor: theme.palette.action.hover },
            }}
          >
            {uploading ? (
              <CircularProgress size={14} />
            ) : (
              <PhotoCameraIcon sx={{ fontSize: 16 }} />
            )}
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </IconButton>
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            Upload a custom avatar
          </Typography>
          <Typography variant="caption" color="text.secondary">
            This image will appear as the bot avatar in the chat view.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default BotAvatarSection;
