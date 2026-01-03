import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { SupportTicket, TicketStatus, TicketType } from '../../types/support';
import { getUserTickets, deleteTicket } from '../../services/supportService';
import AdminSupportDialog from './AdminSupportDialog';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const getStatusColor = (status: TicketStatus): 'default' | 'warning' | 'success' | 'error' => {
  switch (status) {
    case 'Open':
      return 'warning';
    case 'InProgress':
      return 'default';
    case 'Closed':
      return 'success';
    case 'Escalated':
      return 'error';
    default:
      return 'default';
  }
};

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    PaymentRelated: 'Payment',
    BugInApp: 'Bug',
    DataLoss: 'Data Loss',
    FeatureRequest: 'Feature',
    Other: 'Other',
  };
  return labels[type] || type;
};

const AdminSupport: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<TicketType | 'All'>('All');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== 'All') filters.status = statusFilter;
      if (typeFilter !== 'All') filters.type = typeFilter;

      const response = await getUserTickets(filters);
      setTickets(response.tickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, typeFilter]);

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTicket(null);
  };

  const handleUpdate = () => {
    fetchTickets();
  };

  const handleDeleteClick = (ticket: SupportTicket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;

    try {
      await deleteTicket(ticketToDelete.ticketId);
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
      fetchTickets();
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      alert('Failed to delete ticket');
    }
  };

  const handleEditClick = (ticket: SupportTicket) => {
    navigate(`/admin/support/edit/${ticket.ticketId}`);
  };

  const handleCreateClick = () => {
    navigate('/admin/support/create');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Support Tickets
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
          Create Ticket
        </Button>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={e => setStatusFilter(e.target.value as TicketStatus | 'All')}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Escalated">Escalated</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={e => setTypeFilter(e.target.value as TicketType | 'All')}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="PaymentRelated">Payment</MenuItem>
            <MenuItem value="BugInApp">Bug</MenuItem>
            <MenuItem value="DataLoss">Data Loss</MenuItem>
            <MenuItem value="FeatureRequest">Feature</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Tickets Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow key="loading">
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No tickets found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {ticket.ticketId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ticket.user?.name || 'Unknown'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.user?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getTypeLabel(ticket.type)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                      {ticket.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.status}
                      size="small"
                      color={getStatusColor(ticket.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewTicket(ticket)}
                        title="View"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEditClick(ticket)} title="Edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(ticket)}
                        color="error"
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <AdminSupportDialog
        open={dialogOpen}
        ticket={selectedTicket}
        onClose={handleCloseDialog}
        onUpdate={handleUpdate}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTicketToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={ticketToDelete?.ticketId || ''}
        userEmail={`Subject: ${ticketToDelete?.subject || ''}`}
      />
    </Box>
  );
};

export default AdminSupport;
