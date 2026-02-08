import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { Expense } from '../../types';
import EditExpenseDialog from '../EditExpenseDialog/EditExpenseDialog';
import TransactionsFilters from './components/TransactionsFilters';
import TransactionsList from './components/TransactionsList';
import { useTransactionsData } from './hooks/useTransactionsData';
import { useTransactionsFilters } from './hooks/useTransactionsFilters';
import './Transactions.scss';

interface TransactionsProps {
  trackerId?: string;
}

/**
 * Transactions Component
 * Main component for displaying and managing expense transactions
 */
const Transactions: React.FC<TransactionsProps> = ({ trackerId }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'UPI',
    'Net Banking',
    'User not provided payment method',
  ];

  // Data management hook
  const {
    expenses,
    loading,
    loadingMore,
    hasMore,
    categories,
    snackbar,
    loadMoreExpenses,
    handleSaveEdit,
    handleConfirmDelete,
    handleBulkDelete,
    setSnackbar,
  } = useTransactionsData({ trackerId });

  // Filtering and sorting hook
  const {
    filteredExpenses,
    searchTerm,
    categoryFilter,
    paymentFilter,
    typeFilter,
    sortBy,
    filterCategories,
    filterPaymentMethods,
    setSearchTerm,
    setCategoryFilter,
    setPaymentFilter,
    setTypeFilter,
    setSortBy,
  } = useTransactionsFilters({ expenses });

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditDialogOpen(true);
  };

  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (id: string, updatedExpense: Partial<Expense>) => {
    await handleSaveEdit(id, updatedExpense);
    setEditDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExpense) return;
    await handleConfirmDelete(selectedExpense.id);
    setDeleteDialogOpen(false);
  };

  const handleBulkDeleteConfirm = async () => {
    await handleBulkDelete(selected);
    setSelected([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleToggleSelect = (id: string) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = () => {
    if (selected.length === filteredExpenses.length) {
      setSelected([]);
    } else {
      setSelected(filteredExpenses.map(e => e.id));
    }
  };

  // Compute totals
  const totals = filteredExpenses.reduce(
    (acc, exp) => {
      if (exp.type === 'income') acc.income += exp.amount;
      else if (exp.type !== 'transfer') acc.expense += exp.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 1.5, sm: 3 }, px: { xs: 1, sm: 3 } }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981', mb: 2 }}>
          Transaction Logs
        </Typography>

        <TransactionsFilters
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          paymentFilter={paymentFilter}
          typeFilter={typeFilter}
          sortBy={sortBy}
          filteredExpensesCount={filteredExpenses.length}
          filterCategories={filterCategories}
          filterPaymentMethods={filterPaymentMethods}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategoryFilter}
          onPaymentChange={setPaymentFilter}
          onTypeChange={setTypeFilter}
          onSortChange={setSortBy}
        />
      </Paper>

      <TransactionsList
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        expenses={filteredExpenses}
        selected={selected}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={() => setBulkDeleteDialogOpen(true)}
        onLoadMore={loadMoreExpenses}
      />

      <Paper
        elevation={3}
        sx={{
          p: 2,
          mt: 3,
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="body1" fontWeight="bold" color="error.main">
          Total Debit: ₹{totals.expense.toLocaleString('en-IN')}
        </Typography>
        <Typography variant="body1" fontWeight="bold" color="success.main">
          Total Credit: ₹{totals.income.toLocaleString('en-IN')}
        </Typography>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Net: ₹{(totals.income - totals.expense).toLocaleString('en-IN')}
        </Typography>
      </Paper>

      <EditExpenseDialog
        open={editDialogOpen}
        expense={selectedExpense}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
        categories={categories}
        paymentMethods={paymentMethods}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {selectedExpense?.type || 'expense'} of ₹
            {selectedExpense?.amount.toLocaleString('en-IN')}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bulkDeleteDialogOpen} onClose={() => setBulkDeleteDialogOpen(false)}>
        <DialogTitle>Delete {selected.length} Transactions</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selected.length} selected transaction(s)? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkDeleteConfirm} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Transactions;
