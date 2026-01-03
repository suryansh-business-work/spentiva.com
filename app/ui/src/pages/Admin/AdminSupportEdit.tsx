import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getTicketById, updateTicketStatus } from '../../services/supportService';
import { SupportTicket, TicketType, TicketStatus } from '../../types/support';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdminSupportEdit: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState<SupportTicket | null>(null);

  const [formData, setFormData] = useState({
    type: 'BugInApp' as TicketType,
    subject: '',
    description: '',
    status: 'Open' as TicketStatus,
  });

  useEffect(() => {
    const loadTicket = async () => {
      if (!ticketId) {
        navigate('/admin/support');
        return;
      }

      try {
        setLoading(true);
        const data = await getTicketById(ticketId);
        setTicket(data);
        setFormData({
          type: data.type,
          subject: data.subject,
          description: data.description,
          status: data.status,
        });
      } catch (err: any) {
        setError('Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [ticketId, navigate]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketId) return;

    try {
      setSaving(true);
      setError('');

      // For now, we can only update the status
      // Type, subject, description updates would need additional API endpoints
      await updateTicketStatus(ticketId, { status: formData.status });

      alert('Ticket updated successfully!');
      navigate('/admin/support');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box>
        <Alert severity="error">Ticket not found</Alert>
        <Button onClick={() => navigate('/admin/support')} sx={{ mt: 2 }}>
          Back to Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/support')}>
          Back to Tickets
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Edit Ticket: {ticket.ticketId}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            {/* User Info - Read Only */}
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                User
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {ticket.user?.name || 'Unknown'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {ticket.user?.email}
              </Typography>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={e => handleChange('status', e.target.value)}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="InProgress">In Progress</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Escalated">Escalated</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth disabled>
              <InputLabel>Ticket Type</InputLabel>
              <Select value={formData.type} label="Ticket Type">
                <MenuItem value="PaymentRelated">Payment Related</MenuItem>
                <MenuItem value="BugInApp">Bug In App</MenuItem>
                <MenuItem value="DataLoss">Data Loss</MenuItem>
                <MenuItem value="FeatureRequest">Feature Request</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField label="Subject" fullWidth value={formData.subject} disabled />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={6}
              value={formData.description}
              disabled
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/support')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving || formData.status === ticket.status}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminSupportEdit;
