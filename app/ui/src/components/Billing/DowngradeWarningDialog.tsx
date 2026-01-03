import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  useTheme,
  Stack,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EmailIcon from '@mui/icons-material/Email';
import { PLAN_NAMES, type PlanType } from '../../config/planConfig';

interface DowngradeWarningDialogProps {
  open: boolean;
  targetPlan: PlanType | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DowngradeWarningDialog: React.FC<DowngradeWarningDialogProps> = ({
  open,
  targetPlan,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <WarningAmberIcon sx={{ color: theme.palette.warning.main, fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700}>
            Confirm Plan Downgrade
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Important: Downgrading your plan will result in:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <li>
              <Typography variant="body2">Limited trackers and messages</Typography>
            </li>
            <li>
              <Typography variant="body2">Reduced feature access</Typography>
            </li>
            <li>
              <Typography variant="body2">Loss of premium analytics</Typography>
            </li>
            {targetPlan === 'free' && (
              <li>
                <Typography variant="body2">Loss of all paid features</Typography>
              </li>
            )}
          </Box>
        </Alert>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Are you sure you want to downgrade to{' '}
          {targetPlan && <strong>{PLAN_NAMES[targetPlan]}</strong>}? This change will take effect
          immediately.
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <EmailIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            <Typography variant="body2" fontWeight={600}>
              Need Help?
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Contact our support team at{' '}
            <Typography
              component="a"
              href="mailto:paymentsupport@spentiva.com"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              paymentsupport@spentiva.com
            </Typography>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="warning">
          Confirm Downgrade
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DowngradeWarningDialog;
