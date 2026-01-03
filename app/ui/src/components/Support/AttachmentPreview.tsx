import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Attachment } from './AttachmentGrid';

interface AttachmentPreviewProps {
  open: boolean;
  attachment: Attachment | null;
  onClose: () => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ open, attachment, onClose }) => {
  if (!attachment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { boxShadow: 24 } }}
    >
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}
      >
        <Typography variant="h6">
          {attachment.type === 'video' ? 'Video Preview' : 'Image Preview'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
          {attachment.type === 'video' ? (
            <video src={attachment.preview} controls style={{ width: '100%', borderRadius: 8 }} />
          ) : (
            <img
              src={attachment.preview}
              alt="Preview"
              style={{ width: '100%', borderRadius: 8 }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttachmentPreview;
