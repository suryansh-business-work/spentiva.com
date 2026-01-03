import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  accountType: string;
}

interface UserEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => Promise<void>;
  user: User | null;
  loading?: boolean;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({
  open,
  onClose,
  onSave,
  user,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    accountType: 'free',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Only send fields that have changed
    const changedFields: Partial<User> = {};

    if (formData.name !== user.name) changedFields.name = formData.name;
    if (formData.email !== user.email) changedFields.email = formData.email;
    if (formData.role !== user.role) changedFields.role = formData.role;
    if (formData.accountType !== user.accountType) changedFields.accountType = formData.accountType;

    // Only call onSave if there are changes
    if (Object.keys(changedFields).length > 0) {
      await onSave(changedFields);
    } else {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={!loading ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Edit User
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Email"
          value={formData.email}
          onChange={e => handleChange('email', e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
          helperText="Changing email will reset email verification"
        />

        <TextField
          select
          fullWidth
          label="Role"
          value={formData.role}
          onChange={e => handleChange('role', e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Account Type"
          value={formData.accountType}
          onChange={e => handleChange('accountType', e.target.value)}
          disabled={loading}
        >
          <MenuItem value="free">Free</MenuItem>
          <MenuItem value="pro">Pro</MenuItem>
          <MenuItem value="businesspro">Business Pro</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.name || !formData.email}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;
