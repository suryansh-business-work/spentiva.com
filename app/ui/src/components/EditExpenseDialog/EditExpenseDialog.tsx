import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Expense, TransactionType } from '../../types';

/** Currency symbol lookup */
const CURRENCY_OPTIONS: { value: string; symbol: string; label: string }[] = [
  { value: 'INR', symbol: '₹', label: '₹ INR' },
  { value: 'USD', symbol: '$', label: '$ USD' },
  { value: 'EUR', symbol: '€', label: '€ EUR' },
  { value: 'GBP', symbol: '£', label: '£ GBP' },
];

const CURRENCY_SYM: Record<string, string> = Object.fromEntries(
  CURRENCY_OPTIONS.map(c => [c.value, c.symbol]),
);

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
  /** Income categories list */
  incomeCategories?: Category[];
  /** Credit-from sources list */
  creditSources?: string[];
}

const EditExpenseDialog: React.FC<EditExpenseDialogProps> = ({
  open,
  expense,
  onClose,
  onSave,
  categories = [],
  paymentMethods,
  incomeCategories = [],
  creditSources = [],
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [creditFrom, setCreditFrom] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [description, setDescription] = useState('');
  const [availableSubcategories, setAvailableSubcategories] = useState<
    { id: string; name: string }[]
  >([]);

  const safeCategories = useMemo(() => (Array.isArray(categories) ? categories : []), [categories]);
  const safeIncomeCategories = useMemo(
    () => (Array.isArray(incomeCategories) ? incomeCategories : []),
    [incomeCategories],
  );

  /** Resolve which category list applies based on type */
  const activeCatList = useMemo(
    () => (type === 'income' ? safeIncomeCategories : safeCategories),
    [type, safeCategories, safeIncomeCategories],
  );

  useEffect(() => {
    if (expense) {
      setType(expense.type || 'expense');
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setSubcategory(expense.subcategory);
      setPaymentMethod(expense.paymentMethod || '');
      setCreditFrom(expense.creditFrom || '');
      setCurrency(expense.currency || 'INR');
      setDescription(expense.description || '');

      const list = (expense.type || 'expense') === 'income' ? safeIncomeCategories : safeCategories;
      const selectedCat = list.find(cat => cat.name === expense.category);
      if (selectedCat) {
        setAvailableSubcategories(selectedCat.subcategories);
      }
    }
  }, [expense, safeCategories, safeIncomeCategories]);

  useEffect(() => {
    const selectedCat = activeCatList.find(cat => cat.name === category);
    if (selectedCat) {
      setAvailableSubcategories(selectedCat.subcategories);
      if (subcategory && !selectedCat.subcategories.find(sub => sub.name === subcategory)) {
        setSubcategory('');
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [category, activeCatList]);

  const handleTypeChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newType: TransactionType | null) => {
      if (!newType) return;
      setType(newType);
      // Reset category/subcategory when switching type
      setCategory('');
      setSubcategory('');
      setAvailableSubcategories([]);
    },
    [],
  );

  const handleSave = () => {
    if (!expense) return;

    const updatedExpense: Partial<Expense> = {
      type,
      amount: parseFloat(amount),
      category,
      subcategory,
      description,
      currency,
    };

    if (type === 'income') {
      updatedExpense.creditFrom = creditFrom;
    } else {
      updatedExpense.paymentMethod = paymentMethod;
    }

    onSave(expense.id, updatedExpense);
    onClose();
  };

  const isSaveDisabled =
    !amount ||
    !category ||
    !subcategory ||
    (type === 'expense' && !paymentMethod) ||
    (type === 'income' && !creditFrom);

  const currSym = CURRENCY_SYM[currency] || '₹';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>Edit Transaction</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* Type toggle */}
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            size="small"
            color="primary"
          >
            <ToggleButton value="expense" sx={{ fontWeight: 700 }}>
              Expense
            </ToggleButton>
            <ToggleButton value="income" sx={{ fontWeight: 700 }}>
              Income
            </ToggleButton>
            <ToggleButton value="transfer" sx={{ fontWeight: 700 }}>
              Transfer
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Amount + Currency */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">{currSym}</InputAdornment>,
              }}
            />
            <FormControl sx={{ minWidth: 110 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                label="Currency"
              >
                {CURRENCY_OPTIONS.map(c => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Category */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={e => setCategory(e.target.value)} label="Category">
              {activeCatList.map((cat, index) => (
                <MenuItem key={`${cat.id}-${index}`} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Subcategory */}
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

          {/* Payment Method OR Credit From based on type */}
          {type !== 'income' && (
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
          )}

          {type === 'income' && (
            <FormControl fullWidth>
              <InputLabel>Credit From</InputLabel>
              <Select
                value={creditFrom}
                onChange={e => setCreditFrom(e.target.value)}
                label="Credit From"
              >
                {creditSources.map((src, index) => (
                  <MenuItem key={`credit-${src}-${index}`} value={src}>
                    {src}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Description */}
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
        <Button onClick={handleSave} variant="contained" disabled={isSaveDisabled}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditExpenseDialog;
