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
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

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
    setSnackbar,
  } = useTransactionsData({ trackerId });

  // Filtering and sorting hook
  const {
    filteredExpenses,
    searchTerm,
    categoryFilter,
    paymentFilter,
    sortBy,
    filterCategories,
    filterPaymentMethods,
    setSearchTerm,
    setCategoryFilter,
    setPaymentFilter,
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

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981', mb: 2 }}>
          Transaction Logs
        </Typography>

        <TransactionsFilters
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          paymentFilter={paymentFilter}
          sortBy={sortBy}
          filteredExpensesCount={filteredExpenses.length}
          filterCategories={filterCategories}
          filterPaymentMethods={filterPaymentMethods}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategoryFilter}
          onPaymentChange={setPaymentFilter}
          onSortChange={setSortBy}
        />
      </Paper>

      <TransactionsList
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onLoadMore={loadMoreExpenses}
      />

      <Paper elevation={3} sx={{ p: 2, mt: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Total Amount: ₹
          {filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-IN')}
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
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expense of ₹
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
