import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createSupportTicket } from '../../services/supportService';
import { TicketType } from '../../types/support';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdminSupportCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    type: 'BugInApp' as TicketType,
    subject: '',
    description: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      setError('Subject and Description are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await createSupportTicket({
        type: formData.type,
        subject: formData.subject,
        description: formData.description,
      });

      alert('Ticket created successfully!');
      navigate('/admin/support');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/support')}>
          Back to Tickets
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Create Support Ticket
        </Typography>
      </Box>

      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <FormControl fullWidth>
              <InputLabel>Ticket Type</InputLabel>
              <Select
                value={formData.type}
                label="Ticket Type"
                onChange={e => handleChange('type', e.target.value)}
              >
                <MenuItem value="PaymentRelated">Payment Related</MenuItem>
                <MenuItem value="BugInApp">Bug In App</MenuItem>
                <MenuItem value="DataLoss">Data Loss</MenuItem>
                <MenuItem value="FeatureRequest">Feature Request</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Subject"
              fullWidth
              required
              value={formData.subject}
              onChange={e => handleChange('subject', e.target.value)}
              placeholder="Brief description of the issue"
            />

            <TextField
              label="Description"
              fullWidth
              required
              multiline
              rows={6}
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Detailed explanation of the issue..."
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/support')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Creating...' : 'Create Ticket'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminSupportCreate;
