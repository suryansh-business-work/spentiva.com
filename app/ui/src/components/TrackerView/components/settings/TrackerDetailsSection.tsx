import React from 'react';
import { Box, Typography, Button, Paper, TextField, Stack, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface TrackerDetailsProps {
  tracker: {
    name: string;
    description?: string;
    type: string;
    currency: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const TrackerDetailsSection: React.FC<TrackerDetailsProps> = ({ tracker, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Paper
        elevation={0}
        sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Tracker Details
          </Typography>
          <Button
            size="small"
            startIcon={<EditIcon sx={{ fontSize: 16 }} />}
            onClick={onEdit}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Edit
          </Button>
        </Box>
        <Stack spacing={1.5}>
          <TextField
            label="Name"
            value={tracker.name}
            size="small"
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Description"
            value={tracker.description || '—'}
            size="small"
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              label="Type"
              value={tracker.type}
              size="small"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
              sx={{ textTransform: 'capitalize' }}
            />
            <TextField
              label="Currency"
              value={tracker.currency}
              size="small"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Danger Zone */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: `1px solid ${theme.palette.error.main}30`,
          bgcolor: `${theme.palette.error.main}05`,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} color="error" sx={{ mb: 1 }}>
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Permanently delete this tracker and all associated data.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteOutlineIcon />}
          onClick={onDelete}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Delete Tracker
        </Button>
      </Paper>
    </Box>
  );
};

export default TrackerDetailsSection;
