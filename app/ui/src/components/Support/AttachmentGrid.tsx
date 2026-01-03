import React from 'react';
import { Box, IconButton, Typography, CircularProgress, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VideocamIcon from '@mui/icons-material/Videocam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { FileUploadStatus, UploadedFileData } from '../../types/fileUpload.types';

export interface Attachment {
  id: string;
  file: File;
  type: 'image' | 'video' | 'screenshot';
  preview?: string;
  uploadStatus: FileUploadStatus;
  uploadProgress?: number;
  uploadedData?: UploadedFileData;
  uploadError?: string;
}

interface AttachmentGridProps {
  attachments: Attachment[];
  onPreview: (attachment: Attachment) => void;
  onDelete: (id: string) => void;
  onUpload: (id: string) => void;
}

const AttachmentGrid: React.FC<AttachmentGridProps> = ({
  attachments,
  onPreview,
  onDelete,
  onUpload,
}) => {
  if (attachments.length === 0) return null;

  const getUploadStatusIcon = (attachment: Attachment) => {
    switch (attachment.uploadStatus) {
      case 'pending':
        return (
          <Tooltip title="Click to upload">
            <IconButton
              onClick={e => {
                e.stopPropagation();
                onUpload(attachment.id);
              }}
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                bgcolor: 'primary.main',
                color: 'white',
                width: 28,
                height: 28,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
              size="small"
            >
              <CloudUploadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      case 'uploading':
        return (
          <>
            <Box
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                bgcolor: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={20} thickness={5} />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0,0,0,0.7)',
                px: 0.5,
                py: 0.3,
              }}
            >
              <Box
                sx={{
                  height: 3,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  borderRadius: 1,
                  overflow: 'hidden',
                  mb: 0.3,
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    bgcolor: 'primary.main',
                    width: `${attachment.uploadProgress || 0}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  fontSize: '0.65rem',
                  lineHeight: 1,
                  display: 'block',
                  textAlign: 'center',
                }}
              >
                {attachment.uploadProgress || 0}%
              </Typography>
            </Box>
          </>
        );
      case 'uploaded':
        return (
          <Box
            sx={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              bgcolor: 'success.main',
              color: 'white',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircleIcon fontSize="small" />
          </Box>
        );
      case 'error':
        return (
          <Tooltip title={attachment.uploadError || 'Upload failed'}>
            <IconButton
              onClick={e => {
                e.stopPropagation();
                onUpload(attachment.id);
              }}
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                bgcolor: 'error.main',
                color: 'white',
                width: 28,
                height: 28,
                '&:hover': { bgcolor: 'error.dark' },
              }}
              size="small"
            >
              <ErrorIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
    }
  };

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" mb={1} display="block">
        Attachments ({attachments.length}/15)
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 1,
        }}
      >
        {attachments.map(att => (
          <Box
            key={att.id}
            onClick={() => onPreview(att)}
            sx={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              border: '2px solid',
              borderColor: att.type === 'video' ? 'error.main' : 'divider',
              transition: 'all 0.2s',
              boxShadow: 2,
            }}
          >
            {att.type === 'video' ? (
              <Box sx={{ position: 'relative', width: '100%', height: '100%', bgcolor: 'black' }}>
                <video
                  src={att.preview}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <VideocamIcon
                  sx={{ position: 'absolute', top: 8, left: 8, color: 'error.main', fontSize: 24 }}
                />
              </Box>
            ) : (
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={att.preview}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {att.type === 'screenshot' && (
                  <CameraAltIcon
                    sx={{ position: 'absolute', top: 8, left: 8, color: 'info.main', fontSize: 24 }}
                  />
                )}
              </Box>
            )}
            <IconButton
              onClick={e => {
                e.stopPropagation();
                onDelete(att.id);
              }}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                width: 24,
                height: 24,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            {getUploadStatusIcon(att)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AttachmentGrid;
