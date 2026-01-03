import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Stack,
  Paper,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { TicketUpdate } from '../../types/support';
import { addUpdateToTicket } from '../../services/supportService';

interface TicketTimelineProps {
  ticketId: string;
  updates: TicketUpdate[];
  onUpdateAdded: (updates: TicketUpdate[]) => void;
}

const TicketTimeline: React.FC<TicketTimelineProps> = ({ ticketId, updates, onUpdateAdded }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUpdate = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsSubmitting(true);
      const ticket = await addUpdateToTicket(ticketId, {
        message: newMessage.trim(),
        addedBy: 'user',
      });

      // Update parent component with new updates
      if (ticket.updates) {
        onUpdateAdded(ticket.updates);
      }

      setNewMessage('');
    } catch (error: any) {
      console.error('Failed to add update:', error);
      alert('Failed to add update. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Conversation Timeline
      </Typography>

      {/* Timeline List */}
      <Stack spacing={2} sx={{ mb: 3, maxHeight: 400, overflowY: 'auto' }}>
        {updates && updates.length > 0 ? (
          updates.map((update, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                bgcolor: update.addedBy === 'agent' ? 'primary.lighter' : 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: update.addedBy === 'agent' ? 'primary.main' : 'grey.400',
                  }}
                >
                  {update.addedBy === 'agent' ? (
                    <SupportAgentIcon fontSize="small" />
                  ) : (
                    <PersonIcon fontSize="small" />
                  )}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip
                      label={update.addedBy === 'agent' ? 'Support Agent' : 'You'}
                      size="small"
                      color={update.addedBy === 'agent' ? 'primary' : 'default'}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(update.addedAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {update.message}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
            No updates yet. Add a message below to start the conversation.
          </Typography>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Add New Update */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Add Update
      </Typography>
      <Stack spacing={1.5}>
        <TextField
          multiline
          rows={3}
          fullWidth
          size="small"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          disabled={isSubmitting}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleAddUpdate}
            disabled={!newMessage.trim() || isSubmitting}
            size="small"
          >
            {isSubmitting ? 'Sending...' : 'Send Update'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default TicketTimeline;
