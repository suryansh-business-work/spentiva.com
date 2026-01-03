import React, { useRef } from 'react';
import { Button, Tooltip, Box, useTheme, useMediaQuery } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VideocamIcon from '@mui/icons-material/Videocam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface RecordingControlsProps {
  onAddAttachment: (file: File, type: 'image' | 'video' | 'screenshot', preview?: string) => void;
  counts: { images: number; screenshots: number; videos: number };
  maxPerType: number;
  onMinimize: () => void;
  onStartRecording: () => void;
  recording: boolean;
  recordingTime: number;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  onAddAttachment,
  counts,
  maxPerType,
  onMinimize,
  onStartRecording,
  recording,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const canAddAttachment = (type: 'image' | 'video' | 'screenshot') => {
    const typeMap = { image: counts.images, video: counts.videos, screenshot: counts.screenshots };
    return typeMap[type] < maxPerType;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = maxPerType - counts.images;
    files.slice(0, remaining).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          onAddAttachment(file, 'image', reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const captureScreenshot = async () => {
    if (!canAddAttachment('screenshot')) return;
    onMinimize();
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'window' } as any,
        preferCurrentTab: true,
      } as any);

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      stream.getTracks().forEach(track => track.stop());

      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
          onAddAttachment(file, 'screenshot', canvas.toDataURL());
        }
      });
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          ref={fileInputRef}
          hidden
          accept="image/*"
          type="file"
          multiple
          onChange={handleImageUpload}
        />

        <Tooltip title="Upload images from your device (Max 5)" arrow>
          <span>
            <Button
              startIcon={<AttachFileIcon />}
              endIcon={<HelpOutlineIcon fontSize="small" />}
              onClick={() => fileInputRef.current?.click()}
              size="small"
              disabled={!canAddAttachment('image')}
            >
              Images ({counts.images}/{maxPerType})
            </Button>
          </span>
        </Tooltip>

        {isDesktop && (
          <Tooltip title="Capture a screenshot - Dialog will minimize automatically" arrow>
            <span>
              <Button
                startIcon={<CameraAltIcon />}
                endIcon={<HelpOutlineIcon fontSize="small" />}
                onClick={captureScreenshot}
                size="small"
                disabled={!canAddAttachment('screenshot')}
                color="info"
              >
                Screenshot ({counts.screenshots}/{maxPerType})
              </Button>
            </span>
          </Tooltip>
        )}

        {isDesktop && !recording ? (
          <Tooltip
            title="Record your screen - Dialog will minimize. Click Stop when done (Max 5)"
            arrow
          >
            <span>
              <Button
                startIcon={<VideocamIcon />}
                endIcon={<HelpOutlineIcon fontSize="small" />}
                onClick={onStartRecording}
                size="small"
                color="error"
                disabled={!canAddAttachment('video')}
              >
                Record ({counts.videos}/{maxPerType})
              </Button>
            </span>
          </Tooltip>
        ) : null}
      </Box>
    </>
  );
};

export default RecordingControls;
