import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { AttachmentMetadata } from '../../types/support';

interface AttachmentPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  attachment: AttachmentMetadata | null;
}

const AttachmentPreviewDialog: React.FC<AttachmentPreviewDialogProps> = ({
  open,
  onClose,
  attachment,
}) => {
  if (!attachment) return null;

  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(attachment.fileName);
  const isVideo = /\.(mp4|webm|mov)$/i.test(attachment.fileName);

  const handleDownload = () => {
    window.open(attachment.fileUrl, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6">{attachment.fileName}</Typography>
        <Box>
          <IconButton onClick={handleDownload} title="Download">
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: 'black', minHeight: 400 }}>
        {isImage ? (
          <Box
            component="img"
            src={attachment.fileUrl}
            alt={attachment.fileName}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        ) : isVideo ? (
          <Box
            component="video"
            controls
            src={attachment.fileUrl}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
            }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              color: 'white',
            }}
          >
            <Typography>Preview not available for this file type</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDownload} variant="contained">
          Download
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttachmentPreviewDialog;
