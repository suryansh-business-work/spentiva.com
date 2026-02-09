import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, FormControl, InputLabel, Select,
  MenuItem, Typography, Chip, Alert, useTheme, useMediaQuery, CircularProgress, Theme,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TrackerFormData } from '../types/tracker.types';
import { palette, darkPalette } from '../../../theme/palette';

interface CreateEditDialogProps {
  open: boolean;
  editMode: boolean;
  initialValues: TrackerFormData;
  onClose: () => void;
  onSave: (values: TrackerFormData) => void;
  disabled?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().trim().required('Tracker name is required').max(60, 'Max 60 characters'),
  type: Yup.string().oneOf(['personal', 'business']).required('Type is required'),
  description: Yup.string().max(200, 'Max 200 characters'),
  currency: Yup.string().oneOf(['INR', 'USD', 'EUR', 'GBP']).required('Currency is required'),
  shareEmails: Yup.array().of(Yup.string().email('Invalid email')),
});

const CreateEditDialog: React.FC<CreateEditDialogProps> = ({
  open, editMode, initialValues, onClose, onSave, disabled = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const pal = theme.palette.mode === 'dark' ? darkPalette : palette;

  const formik = useFormik<TrackerFormData>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => onSave(values),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}
      PaperProps={{ sx: { bgcolor: theme.palette.background.paper, borderRadius: fullScreen ? 0 : 3 } }}>
      <DialogTitle>{editMode ? 'Edit Tracker' : 'Create New Tracker'}</DialogTitle>
      <DialogContent>
        <form id="tracker-form" onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField fullWidth label="Tracker Name" name="name"
              value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              placeholder="e.g., Home Expenses" required disabled={disabled} />

            <TrackerTypeSelector type={formik.values.type} disabled={disabled}
              onChange={(v) => formik.setFieldValue('type', v)} pal={pal} theme={theme} />

            <TextField fullWidth label="Description (Optional)" name="description" multiline rows={2}
              value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              disabled={disabled} />

            <FormControl fullWidth disabled={disabled}>
              <InputLabel>Currency</InputLabel>
              <Select name="currency" value={formik.values.currency} label="Currency"
                onChange={formik.handleChange}>
                <MenuItem value="INR">INR (₹)</MenuItem>
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (€)</MenuItem>
                <MenuItem value="GBP">GBP (£)</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info" variant="outlined" sx={{ py: 0.5, '& .MuiAlert-message': { fontSize: '0.8rem' } }}>
              All transactions will be recorded in the selected currency. Currency conversion is not supported.
            </Alert>

            {!editMode && (
              <ShareEmailsField emails={formik.values.shareEmails || []}
                onChange={(emails) => formik.setFieldValue('shareEmails', emails)}
                error={formik.errors.shareEmails as string | undefined}
                disabled={disabled} />
            )}
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={disabled} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
        <Button type="submit" form="tracker-form" variant="contained"
          disabled={!formik.isValid || !formik.dirty || disabled}
          startIcon={disabled ? <CircularProgress size={18} color="inherit" /> : undefined}>
          {disabled ? 'Saving...' : editMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEditDialog;

/* ---------- Sub-components ---------- */

interface TrackerTypeSelectorProps {
  type: string;
  disabled: boolean;
  onChange: (v: 'personal' | 'business') => void;
  pal: typeof palette;
  theme: Theme;
}

const TrackerTypeSelector: React.FC<TrackerTypeSelectorProps> = ({ type, disabled, onChange, pal, theme }) => (
  <Box>
    <Typography variant="subtitle2" sx={{ mb: 1.5, color: theme.palette.text.secondary, fontWeight: 600, fontSize: '0.875rem' }}>
      Tracker Type *
    </Typography>
    <Box sx={{ display: 'flex', gap: 2 }}>
      {(['business', 'personal'] as const).map((t) => {
        const active = type === t;
        const cfg = pal.trackerTypes[t];
        const Icon = t === 'business' ? BusinessIcon : PersonIcon;
        return (
          <Box key={t} onClick={() => !disabled && onChange(t)}
            sx={{
              flex: 1, p: 2.5, borderRadius: 2, cursor: disabled ? 'not-allowed' : 'pointer',
              border: `2px solid ${active ? cfg.primary : theme.palette.divider}`,
              bgcolor: active ? cfg.bg : theme.palette.background.paper,
              transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 1, opacity: disabled ? 0.6 : 1,
              '&:hover': disabled ? {} : { borderColor: cfg.primary, bgcolor: cfg.bg, transform: 'translateY(-2px)' },
            }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: active ? cfg.gradient : theme.palette.action.hover,
            }}>
              <Icon sx={{ fontSize: 28, color: active ? '#fff' : theme.palette.text.secondary }} />
            </Box>
            <Typography variant="body2" fontWeight={active ? 700 : 500}
              sx={{ color: active ? cfg.primary : theme.palette.text.primary, textTransform: 'capitalize' }}>
              {t}
            </Typography>
          </Box>
        );
      })}
    </Box>
  </Box>
);

interface ShareEmailsFieldProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  error?: string;
  disabled: boolean;
}

const ShareEmailsField: React.FC<ShareEmailsFieldProps> = ({ emails, onChange, error, disabled }) => {
  const [input, setInput] = React.useState('');

  const addEmail = () => {
    const trimmed = input.trim();
    if (!trimmed || emails.includes(trimmed)) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
    onChange([...emails, trimmed]);
    setInput('');
  };

  return (
    <Box>
      <TextField fullWidth size="small" label="Share with (optional)" placeholder="Enter email and press Enter"
        value={input} disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEmail(); } }}
        helperText={error || 'Invite collaborators by email'}
        error={Boolean(error)} />
      {emails.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {emails.map((email) => (
            <Chip key={email} label={email} size="small" variant="outlined"
              onDelete={() => onChange(emails.filter(e => e !== email))} />
          ))}
        </Box>
      )}
    </Box>
  );
};