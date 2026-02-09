import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
  type Theme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { endpoints } from '../../../../config/api';
import { postRequest } from '../../../../utils/http';
import { SharedUser } from '../../../../types/tracker';

interface ShareTrackerSectionProps {
  trackerId: string;
  sharedWith: SharedUser[];
  isOwner: boolean;
  onSharedUsersChange: (users: SharedUser[]) => void;
}

const shareSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  role: Yup.string().oneOf(['viewer', 'editor']).required('Role is required'),
});

const ShareTrackerSection: React.FC<ShareTrackerSectionProps> = ({
  trackerId,
  sharedWith,
  isOwner,
  onSharedUsersChange,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: '', role: 'viewer' as 'viewer' | 'editor' },
    validationSchema: shareSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const res = await postRequest(endpoints.trackers.share(trackerId), values);
        if (res?.data?.data?.sharedWith) {
          onSharedUsersChange(res.data.data.sharedWith);
        }
        resetForm();
      } catch {
        /* handled by interceptor */
      } finally {
        setLoading(false);
      }
    },
  });

  const handleRemove = async (email: string) => {
    setActionLoading(email);
    try {
      const res = await postRequest(endpoints.trackers.unshare(trackerId), { email });
      if (res?.data?.data?.sharedWith) {
        onSharedUsersChange(res.data.data.sharedWith);
      }
    } catch {
      /* handled by interceptor */
    } finally {
      setActionLoading(null);
    }
  };

  const handleResend = async (email: string) => {
    setActionLoading(`resend-${email}`);
    try {
      await postRequest(endpoints.trackers.resendInvite(trackerId), { email });
    } catch {
      /* handled by interceptor */
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOwner) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="body2" color="text.secondary">
          Only the tracker owner can manage sharing.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <ShareForm formik={formik} loading={loading} theme={theme} />
      <SharedUsersList
        sharedWith={sharedWith}
        actionLoading={actionLoading}
        onRemove={handleRemove}
        onResend={handleResend}
        theme={theme}
      />
    </Box>
  );
};

export default ShareTrackerSection;

/* ---------- Sub-components ---------- */

interface ShareFormProps {
  formik: ReturnType<typeof useFormik<{ email: string; role: 'viewer' | 'editor' }>>;
  loading: boolean;
  theme: Theme;
}

const ShareForm: React.FC<ShareFormProps> = ({ formik, loading, theme }) => (
  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
      Invite Collaborator
    </Typography>
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, sm: 5 }}>
          <TextField
            fullWidth
            size="small"
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              label="Role"
              value={formik.values.role}
              onChange={formik.handleChange}
            >
              <MenuItem value="viewer">Viewer</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}
            disabled={loading}
            sx={{ height: 40 }}
          >
            Share
          </Button>
        </Grid>
      </Grid>
    </form>
  </Paper>
);

interface SharedUsersListProps {
  sharedWith: SharedUser[];
  actionLoading: string | null;
  onRemove: (email: string) => void;
  onResend: (email: string) => void;
  theme: Theme;
}

const SharedUsersList: React.FC<SharedUsersListProps> = ({
  sharedWith,
  actionLoading,
  onRemove,
  onResend,
  theme,
}) => {
  if (!sharedWith.length) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No collaborators yet. Invite someone above.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
        Shared With
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {sharedWith.map((user) => (
          <SharedUserRow
            key={user.email}
            user={user}
            actionLoading={actionLoading}
            onRemove={onRemove}
            onResend={onResend}
          />
        ))}
      </Box>
    </Paper>
  );
};

interface SharedUserRowProps {
  user: SharedUser;
  actionLoading: string | null;
  onRemove: (email: string) => void;
  onResend: (email: string) => void;
}

const statusColor: Record<string, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
};

const SharedUserRow: React.FC<SharedUserRowProps> = ({ user, actionLoading, onRemove, onResend }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="body2" noWrap fontWeight={500}>
        {user.name || user.email}
      </Typography>
      {user.name && (
        <Typography variant="caption" color="text.secondary" noWrap>
          {user.email}
        </Typography>
      )}
    </Box>
    <Chip label={user.role} size="small" variant="outlined" />
    <Chip label={user.status} size="small" color={statusColor[user.status] || 'default'} />
    {user.status === 'pending' && (
      <Tooltip title="Resend invite">
        <IconButton
          size="small"
          onClick={() => onResend(user.email)}
          disabled={actionLoading === `resend-${user.email}`}
        >
          {actionLoading === `resend-${user.email}` ? <CircularProgress size={16} /> : <RefreshIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    )}
    <Tooltip title="Remove">
      <IconButton
        size="small"
        color="error"
        onClick={() => onRemove(user.email)}
        disabled={actionLoading === user.email}
      >
        {actionLoading === user.email ? <CircularProgress size={16} /> : <DeleteOutlineIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  </Box>
);
