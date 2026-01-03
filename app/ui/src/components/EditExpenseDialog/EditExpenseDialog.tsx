import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  InputAdornment,
} from '@mui/material';
import { Expense } from '../../types';

interface Category {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

interface EditExpenseDialogProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSave: (id: string, updatedExpense: Partial<Expense>) => void;
  categories: Category[];
  paymentMethods: string[];
}

const EditExpenseDialog: React.FC<EditExpenseDialogProps> = ({
  open,
  expense,
  onClose,
  onSave,
  categories = [], // ✅ Default to empty array
  paymentMethods,
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [availableSubcategories, setAvailableSubcategories] = useState<
    { id: string; name: string }[]
  >([]);

  // Ensure categories is always an array
  const safeCategories = useMemo(() => (Array.isArray(categories) ? categories : []), [categories]);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setSubcategory(expense.subcategory);
      setPaymentMethod(expense.paymentMethod || '');
      setDescription(expense.description || '');

      // Set subcategories for the selected category
      const selectedCat = safeCategories.find(cat => cat.name === expense.category);
      if (selectedCat) {
        setAvailableSubcategories(selectedCat.subcategories);
      }
    }
  }, [expense, safeCategories]);

  useEffect(() => {
    // Update subcategories when category changes
    const selectedCat = safeCategories.find(cat => cat.name === category);
    if (selectedCat) {
      setAvailableSubcategories(selectedCat.subcategories);
      // Reset subcategory if it's not in the new category's subcategories
      if (subcategory && !selectedCat.subcategories.find(sub => sub.name === subcategory)) {
        setSubcategory('');
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [category, safeCategories]);

  const handleSave = () => {
    if (!expense) return;

    const updatedExpense: Partial<Expense> = {
      amount: parseFloat(amount),
      category,
      subcategory,
      paymentMethod,
      description,
    };

    onSave(expense.id, updatedExpense);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Expense</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={e => setCategory(e.target.value)} label="Category">
              {safeCategories.map((cat, index) => (
                <MenuItem key={`${cat.id}-${index}`} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Subcategory</InputLabel>
            <Select
              value={subcategory}
              onChange={e => setSubcategory(e.target.value)}
              label="Subcategory"
              disabled={!category || availableSubcategories.length === 0}
            >
              {availableSubcategories.map((sub, index) => (
                <MenuItem key={`${sub.id}-${index}`} value={sub.name}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              label="Payment Method"
            >
              {paymentMethods.map((method, index) => (
                <MenuItem key={`payment-${method}-${index}`} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!amount || !category || !subcategory || !paymentMethod}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditExpenseDialog;
