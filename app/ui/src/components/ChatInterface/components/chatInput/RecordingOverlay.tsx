import React from 'react';
import { Box, IconButton, Typography, useTheme, keyframes } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Visualizer } from 'react-sound-visualizer';

/** Slow pulsing animation for active recording */
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

interface RecordingOverlayProps {
  stream: MediaStream | null;
  onAccept: () => void;
  onCancel: () => void;
}

/**
 * RecordingOverlay - Shows the waveform visualizer and accept/cancel buttons
 * during active speech-to-text recording
 */
const RecordingOverlay: React.FC<RecordingOverlayProps> = ({ stream, onAccept, onCancel }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Visualizer + listening label — full width */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          borderRadius: 3,
          py: 0.75,
          px: 1.5,
          bgcolor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        {stream && (
          <Visualizer
            audio={stream}
            mode="continuous"
            strokeColor={theme.palette.error.main}
            autoStart
          >
            {({ canvasRef }) => (
              <canvas
                ref={canvasRef}
                height={28}
                style={{ display: 'block', width: '100%', minWidth: 0 }}
              />
            )}
          </Visualizer>
        )}
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'error.main',
            flexShrink: 0,
            animation: `${pulse} 2.5s ease-in-out infinite`,
          }}
        />
        <Typography
          variant="caption"
          color="error"
          sx={{ fontWeight: 600, fontSize: '0.7rem', flexShrink: 0 }}
        >
          Listening…
        </Typography>
      </Box>

      {/* Cancel */}
      <IconButton
        onClick={onCancel}
        size="small"
        sx={{
          width: 38,
          height: 38,
          bgcolor: 'error.main',
          color: '#fff',
          '&:hover': { bgcolor: 'error.dark' },
        }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>

      {/* Accept */}
      <IconButton
        onClick={onAccept}
        size="small"
        sx={{
          width: 38,
          height: 38,
          bgcolor: 'success.main',
          color: '#fff',
          '&:hover': { bgcolor: 'success.dark' },
        }}
      >
        <CheckIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};

export default RecordingOverlay;
