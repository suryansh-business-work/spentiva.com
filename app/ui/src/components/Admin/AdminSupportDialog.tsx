import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Select,
  MenuItem,
  TextField,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SupportTicket, TicketStatus, TicketUpdate, AttachmentMetadata } from '../../types/support';
import { updateTicketStatus, addUpdateToTicket } from '../../services/supportService';
import AttachmentPreviewCard from './AttachmentPreviewCard';
import AttachmentPreviewDialog from './AttachmentPreviewDialog';

interface AdminSupportDialogProps {
  open: boolean;
  ticket: SupportTicket | null;
  onClose: () => void;
  onUpdate: () => void;
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    PaymentRelated: 'Payment',
    BugInApp: 'Bug',
    DataLoss: 'Data Loss',
    FeatureRequest: 'Feature',
    Other: 'Other',
  };
  return labels[type] || type;
};

const AdminSupportDialog: React.FC<AdminSupportDialogProps> = ({
  open,
  ticket,
  onClose,
  onUpdate,
}) => {
  const [status, setStatus] = useState<TicketStatus>('Open');
  const [loading, setLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updates, setUpdates] = useState<TicketUpdate[]>([]);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<AttachmentMetadata | null>(null);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setUpdates(ticket.updates || []);
    }
  }, [ticket]);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    try {
      setLoading(true);
      await updateTicketStatus(ticket.ticketId, { status: newStatus });
      setStatus(newStatus);
      onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update ticket status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = async () => {
    if (!ticket || !updateMessage.trim()) return;
    try {
      setLoading(true);
      const updated = await addUpdateToTicket(ticket.ticketId, {
        message: updateMessage.trim(),
        addedBy: 'agent',
      });
      setUpdates(updated.updates || []);
      setUpdateMessage('');
      onUpdate();
    } catch (error) {
      console.error('Failed to add update:', error);
      alert('Failed to add update');
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {ticket.ticketId}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Created {new Date(ticket.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction="row" spacing={1} mb={2}>
          <Chip label={getTypeLabel(ticket.type)} size="small" color="primary" variant="outlined" />
        </Stack>

        {/* Status */}
        <Box mb={2}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5}>
            Status
          </Typography>
          <Select
            value={status}
            onChange={e => handleStatusChange(e.target.value as TicketStatus)}
            size="small"
            fullWidth
            disabled={loading}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Escalated">Escalated</MenuItem>
          </Select>
        </Box>

        {/* Subject & Description */}
        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>
            {ticket.subject}
          </Typography>
          <Typography variant="body2" color="text.secondary" whiteSpace="pre-wrap">
            {ticket.description}
          </Typography>
        </Box>

        {/* Attachments */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <Box mb={2}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" mb={1}>
              Attachments ({ticket.attachments.length})
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 1.5,
              }}
            >
              {ticket.attachments.map(att => (
                <AttachmentPreviewCard
                  key={att.fileUrl}
                  attachment={att}
                  onClick={() => {
                    setSelectedAttachment(att);
                    setPreviewDialogOpen(true);
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Updates */}
        <Typography variant="subtitle2" fontWeight={700} mb={1}>
          Conversation
        </Typography>
        <Stack spacing={1.5} mb={2}>
          {updates.map(update => (
            <Box
              key={`${update.addedAt}-${update.message.substring(0, 20)}`}
              sx={{
                p: 1.5,
                bgcolor: update.addedBy === 'agent' ? 'action.hover' : 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" mb={0.5}>
                {update.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {update.addedBy === 'agent' ? 'Support Agent' : 'User'} •{' '}
                {new Date(update.addedAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Add Update */}
        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder="Type your response..."
          value={updateMessage}
          onChange={e => setUpdateMessage(e.target.value)}
          disabled={loading}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleAddUpdate}
          disabled={loading || !updateMessage.trim()}
        >
          Add Response
        </Button>
      </DialogActions>

      {/* Attachment Preview Dialog */}
      <AttachmentPreviewDialog
        open={previewDialogOpen}
        onClose={() => {
          setPreviewDialogOpen(false);
          setSelectedAttachment(null);
        }}
        attachment={selectedAttachment}
      />
    </Dialog>
  );
};

export default AdminSupportDialog;
