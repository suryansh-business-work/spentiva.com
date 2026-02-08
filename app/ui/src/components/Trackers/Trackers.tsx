import React, { useState } from 'react';
import {
  Container,
  Box,
  Button,
  Fab,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Tracker, TrackerFormData } from './types/tracker.types';
import { useTrackers } from './hooks/useTrackers';
import GreetingHeader from './components/GreetingHeader';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import TrackerCard from './components/TrackerCard';
import TrackerActionsDrawer from './components/TrackerActionsDrawer';
import CreateEditDialog from './components/CreateEditDialog';
import DeleteDialog from './components/DeleteDialog';

const Trackers: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    trackers,
    loading,
    saving,
    deleting,
    snackbar,
    createTracker,
    updateTracker,
    deleteTracker,
    closeSnackbar,
  } = useTrackers();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState<Tracker | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTracker, setMenuTracker] = useState<Tracker | null>(null);
  const [formData, setFormData] = useState<TrackerFormData>({
    name: '',
    type: 'personal',
    description: '',
    currency: 'INR',
  });

  const handleOpenDialog = (tracker?: Tracker) => {
    if (tracker) {
      setEditMode(true);
      setSelectedTracker(tracker);
      setFormData({
        name: tracker.name,
        type: tracker.type,
        description: tracker.description || '',
        currency: tracker.currency,
      });
    } else {
      setEditMode(false);
      setSelectedTracker(null);
      setFormData({ name: '', type: 'personal', description: '', currency: 'INR' });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const success =
      editMode && selectedTracker
        ? await updateTracker(selectedTracker.id, formData)
        : await createTracker(formData);
    if (success) {
      setDialogOpen(false);
      setEditMode(false);
      setSelectedTracker(null);
    }
  };

  const handleDelete = (tracker: Tracker) => {
    setSelectedTracker(tracker);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTracker) {
      const success = await deleteTracker(selectedTracker.id);
      if (success) setDeleteDialogOpen(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, tracker: Tracker) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuTracker(tracker);
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    return symbols[currency] || currency;
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 2.5 } }}>
      <GreetingHeader />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Box>
          <Box sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'text.primary', mb: 0.25 }}>
            Expense Trackers
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
            Create separate trackers for different purposes
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ display: { xs: 'none', md: 'inline-flex' }, py: 1, px: 2 }}
        >
          Create Tracker
        </Button>
      </Box>

      {loading ? (
        <LoadingState />
      ) : trackers.length === 0 ? (
        <EmptyState onCreateClick={() => handleOpenDialog()} />
      ) : isMobile ? (
        /* Compact list view for mobile */
        <List disablePadding sx={{ mx: -1 }}>
          {trackers.map(tracker => (
            <ListItem
              key={tracker.id}
              disablePadding
              secondaryAction={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Chip
                    label={getCurrencySymbol(tracker.currency)}
                    size="small"
                    sx={{ height: 22, fontSize: '0.75rem', fontWeight: 700 }}
                  />
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={e => handleMenuOpen(e, tracker)}
                    aria-label={`Actions for ${tracker.name}`}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <ListItemButton
                onClick={() => navigate(`/tracker/${tracker.id}`)}
                sx={{ py: 1.25, px: 1.5, pr: 10 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {tracker.type === 'business' ? (
                    <BusinessIcon color="primary" fontSize="small" />
                  ) : (
                    <PersonIcon color="success" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={600} noWrap sx={{ fontSize: '0.9rem' }}>
                      {tracker.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {tracker.type} &middot;{' '}
                      {new Date(tracker.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Typography>
                  }
                />
                <ChevronRightIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary', ml: 0.5, flexShrink: 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {trackers.map((tracker, index) => (
            <TrackerCard
              key={tracker.id}
              tracker={tracker}
              index={index}
              onOpen={t => navigate(`/tracker/${t.id}`)}
              onMoreActions={handleMenuOpen}
              getCurrencySymbol={getCurrencySymbol}
            />
          ))}
        </Box>
      )}

      <TrackerActionsDrawer
        anchorEl={anchorEl}
        tracker={menuTracker}
        onClose={() => {
          setAnchorEl(null);
          setMenuTracker(null);
        }}
        onEdit={() => menuTracker && handleOpenDialog(menuTracker)}
        onDelete={() => menuTracker && handleDelete(menuTracker)}
        onSettings={() => menuTracker && navigate(`/tracker/${menuTracker.id}/settings`)}
        onAddToHome={() => {
          if (menuTracker) window.open(`/tracker/${menuTracker.id}`, '_blank');
        }}
        getCurrencySymbol={getCurrencySymbol}
      />

      <CreateEditDialog
        open={dialogOpen}
        editMode={editMode}
        formData={formData}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onChange={(field, value) => setFormData({ ...formData, [field]: value })}
        disabled={saving}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        tracker={selectedTracker}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Fab
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Trackers;
