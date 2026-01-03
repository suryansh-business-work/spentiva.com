import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  useTheme,
  IconButton,
  Grid,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  profilePhoto: string | null;
  role: string;
  accountType: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailDialog: React.FC<UserDetailDialogProps> = ({ open, onClose, user }) => {
  const theme = useTheme();

  if (!user) return null;

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
  }) => (
    <Box sx={{ py: 1.5 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
        {icon}
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}
      >
        <Typography variant="h6" fontWeight={700}>
          User Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3, pt: 1 }}>
          <Avatar
            src={user.profilePhoto || undefined}
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 1.5,
              bgcolor: theme.palette.primary.main,
              fontSize: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={6}>
            <InfoRow
              icon={<EmailIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />}
              label="Email Status"
              value={
                user.emailVerified ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Verified"
                    size="small"
                    color="success"
                    sx={{ height: 22 }}
                  />
                ) : (
                  <Chip icon={<CancelIcon />} label="Unverified" size="small" sx={{ height: 22 }} />
                )
              }
            />
          </Grid>
          <Grid size={6}>
            <InfoRow
              icon={<PhoneIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />}
              label="Phone Status"
              value={
                user.phoneVerified ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Verified"
                    size="small"
                    color="success"
                    sx={{ height: 22 }}
                  />
                ) : (
                  <Chip icon={<CancelIcon />} label="Unverified" size="small" sx={{ height: 22 }} />
                )
              }
            />
          </Grid>
          <Grid size={6}>
            <InfoRow
              label="Role"
              value={
                <Chip
                  label={user.role}
                  size="small"
                  color={user.role === 'admin' ? 'secondary' : 'default'}
                  sx={{ height: 22 }}
                />
              }
            />
          </Grid>
          <Grid size={6}>
            <InfoRow
              label="Account Type"
              value={
                <Chip
                  label={user.accountType}
                  size="small"
                  color={
                    user.accountType === 'pro'
                      ? 'success'
                      : user.accountType === 'businesspro'
                        ? 'warning'
                        : 'default'
                  }
                  sx={{ height: 22 }}
                />
              }
            />
          </Grid>
          <Grid size={6}>
            <InfoRow label="Phone" value={user.phone || 'Not provided'} />
          </Grid>
          <Grid size={6}>
            <InfoRow label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailDialog;
