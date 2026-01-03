import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { TrackerFormData } from '../types/tracker.types';
import { palette, darkPalette } from '../../../theme/palette';

interface CreateEditDialogProps {
  open: boolean;
  editMode: boolean;
  formData: TrackerFormData;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof TrackerFormData, value: any) => void;
  disabled?: boolean;
}

const CreateEditDialog: React.FC<CreateEditDialogProps> = ({
  open,
  editMode,
  formData,
  onClose,
  onSave,
  onChange,
  disabled = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Use colors from palette based on theme mode
  const paletteSource = theme.palette.mode === 'dark' ? darkPalette : palette;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          borderRadius: fullScreen ? 0 : 3,
        },
      }}
    >
      <DialogTitle sx={{ color: theme.palette.text.primary }}>
        {editMode ? 'Edit Tracker' : 'Create New Tracker'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Tracker Name"
            value={formData.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="e.g., Home Expenses, Business Travel"
            required
            disabled={disabled}
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: theme.palette.background.paper,
              },
            }}
          />

          {/* Icon-based Tracker Type Selection */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                color: theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              Tracker Type *
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Business Option */}
              <Box
                onClick={() => !disabled && onChange('type', 'business')}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: 2,
                  border: `2px solid ${formData.type === 'business' ? paletteSource.trackerTypes.business.primary : theme.palette.divider}`,
                  bgcolor:
                    formData.type === 'business'
                      ? paletteSource.trackerTypes.business.bg
                      : theme.palette.background.paper,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  opacity: disabled ? 0.6 : 1,
                  '&:hover': disabled
                    ? {}
                    : {
                        borderColor: paletteSource.trackerTypes.business.primary,
                        bgcolor: paletteSource.trackerTypes.business.bg,
                        transform: 'translateY(-2px)',
                      },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      formData.type === 'business'
                        ? paletteSource.trackerTypes.business.gradient
                        : theme.palette.action.hover,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <BusinessIcon
                    sx={{
                      fontSize: 28,
                      color: formData.type === 'business' ? '#fff' : theme.palette.text.secondary,
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={formData.type === 'business' ? 700 : 500}
                  sx={{
                    color:
                      formData.type === 'business'
                        ? paletteSource.trackerTypes.business.primary
                        : theme.palette.text.primary,
                  }}
                >
                  Business
                </Typography>
              </Box>

              {/* Personal Option */}
              <Box
                onClick={() => !disabled && onChange('type', 'personal')}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: 2,
                  border: `2px solid ${formData.type === 'personal' ? paletteSource.trackerTypes.personal.primary : theme.palette.divider}`,
                  bgcolor:
                    formData.type === 'personal'
                      ? paletteSource.trackerTypes.personal.bg
                      : theme.palette.background.paper,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  opacity: disabled ? 0.6 : 1,
                  '&:hover': disabled
                    ? {}
                    : {
                        borderColor: paletteSource.trackerTypes.personal.primary,
                        bgcolor: paletteSource.trackerTypes.personal.bg,
                        transform: 'translateY(-2px)',
                      },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      formData.type === 'personal'
                        ? paletteSource.trackerTypes.personal.gradient
                        : theme.palette.action.hover,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <PersonIcon
                    sx={{
                      fontSize: 28,
                      color: formData.type === 'personal' ? '#fff' : theme.palette.text.secondary,
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={formData.type === 'personal' ? 700 : 500}
                  sx={{
                    color:
                      formData.type === 'personal'
                        ? paletteSource.trackerTypes.personal.primary
                        : theme.palette.text.primary,
                  }}
                >
                  Personal
                </Typography>
              </Box>
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={3}
            value={formData.description}
            onChange={e => onChange('description', e.target.value)}
            placeholder="Brief description of this tracker"
            disabled={disabled}
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: theme.palette.background.paper,
              },
            }}
          />

          <FormControl fullWidth disabled={disabled}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={formData.currency}
              onChange={e => onChange('currency', e.target.value)}
              label="Currency"
              sx={{
                bgcolor: theme.palette.background.paper,
              }}
            >
              <MenuItem value="INR">INR (₹)</MenuItem>
              <MenuItem value="USD">USD ($)</MenuItem>
              <MenuItem value="EUR">EUR (€)</MenuItem>
              <MenuItem value="GBP">GBP (£)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={disabled} sx={{ color: theme.palette.text.secondary }}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!formData.name || !formData.type || !formData.currency || disabled}
          startIcon={disabled ? <CircularProgress size={20} color="inherit" /> : undefined}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          {disabled ? 'Saving...' : editMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEditDialog;
