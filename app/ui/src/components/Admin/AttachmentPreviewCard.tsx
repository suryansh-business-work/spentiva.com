import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { AttachmentMetadata } from '../../types/support';

interface AttachmentPreviewCardProps {
  attachment: AttachmentMetadata;
  onClick: () => void;
}

const AttachmentPreviewCard: React.FC<AttachmentPreviewCardProps> = ({ attachment, onClick }) => {
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(attachment.fileName);
  const isVideo = /\.(mp4|webm|mov)$/i.test(attachment.fileName);

  return (
    <Paper
      onClick={onClick}
      sx={{
        position: 'relative',
        aspectRatio: '1',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: 4,
        },
        transition: 'all 0.2s',
      }}
    >
      {isImage ? (
        <Box
          component="img"
          src={attachment.fileUrl}
          alt={attachment.fileName}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'action.hover',
            gap: 1,
          }}
        >
          {isVideo ? (
            <VideoFileIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          ) : (
            <InsertDriveFileIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          )}
          <Typography
            variant="caption"
            sx={{
              px: 1,
              textAlign: 'center',
              wordBreak: 'break-word',
              maxWidth: '100%',
            }}
          >
            {attachment.fileName}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AttachmentPreviewCard;
