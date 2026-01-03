import React from 'react';
import { Box, IconButton, Stack, Typography, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Maximize';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import Lottie from 'lottie-react';

interface SupportDialogHeaderProps {
  recording: boolean;
  recordingTime: number;
  minimized: boolean;
  onMinimize: () => void;
  onStopRecording: () => void;
  onClose: () => void;
}

const formatRecordingTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const SupportDialogHeader: React.FC<SupportDialogHeaderProps> = ({
  recording,
  recordingTime,
  minimized,
  onMinimize,
  onStopRecording,
  onClose,
}) => {
  const [recordingAnimation, setRecordingAnimation] = React.useState<any>(null);

  React.useEffect(() => {
    // Load animation data from public directory
    fetch('/animations/recording.json')
      .then(response => response.json())
      .then(data => setRecordingAnimation(data))
      .catch(error => console.error('Error loading recording animation:', error));
  }, []);

  return (
    <Box
      id={minimized ? undefined : 'draggable-dialog-title'}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        px: 2,
        bgcolor: recording ? '#000' : 'primary.main',
        color: 'primary.contrastText',
        cursor: minimized ? 'default' : 'move',
      }}
    >
      {recording ? (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {recordingAnimation && (
              <Lottie
                animationData={recordingAnimation}
                loop={true}
                style={{ width: 32, height: 32 }}
              />
            )}
          </Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Recording... {formatRecordingTime(recordingTime)}
          </Typography>
        </Stack>
      ) : minimized ? (
        <Typography variant="subtitle2" fontWeight={600}>
          Support Dialog
        </Typography>
      ) : (
        <Typography variant="subtitle1" fontWeight={700}>
          Contact Support
        </Typography>
      )}
      <Stack direction="row" spacing={0.5}>
        {recording ? (
          <>
            <Tooltip title={minimized ? 'Expand dialog' : 'Minimize dialog'} arrow>
              <IconButton size="small" onClick={onMinimize} sx={{ color: 'inherit' }}>
                {minimized ? <MaximizeIcon fontSize="small" /> : <MinimizeIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop recording" arrow>
              <IconButton
                size="small"
                onClick={onStopRecording}
                sx={{
                  color: 'inherit',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <StopCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title={minimized ? 'Expand dialog' : 'Minimize dialog'} arrow>
            <IconButton size="small" onClick={onMinimize} sx={{ color: 'inherit' }}>
              {minimized ? <MaximizeIcon fontSize="small" /> : <MinimizeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Close" arrow>
          <IconButton size="small" onClick={onClose} sx={{ color: 'inherit' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default SupportDialogHeader;
