import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Box,
} from '@mui/material';

interface Category {
  _id: string;
  name: string;
  subcategories: Array<{ id: string; name: string }>;
}

interface AddCategoryDialogProps {
  open: boolean;
  categoryName: string;
  existingCategories: Category[];
  onClose: () => void;
  onAddMain: (name: string, type: string) => Promise<void>;
  onAddSub: (parentCategoryId: string, subName: string) => Promise<void>;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  open,
  categoryName,
  existingCategories,
  onClose,
  onAddMain,
  onAddSub,
}) => {
  const [mode, setMode] = useState<'main' | 'sub'>('sub');
  const [parentCategory, setParentCategory] = useState('');
  const [catType, setCatType] = useState<'expense' | 'income'>('expense');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (mode === 'main') {
        await onAddMain(categoryName, catType);
      } else {
        if (!parentCategory) return;
        await onAddSub(parentCategory, categoryName);
      }
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1, fontSize: '1rem' }}>
        Add "{categoryName}"
      </DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, v) => v && setMode(v)}
            fullWidth
            size="small"
          >
            <ToggleButton value="sub" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
              Subcategory
            </ToggleButton>
            <ToggleButton value="main" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
              Main Category
            </ToggleButton>
          </ToggleButtonGroup>

          {mode === 'sub' && (
            <FormControl fullWidth size="small">
              <InputLabel>Parent Category</InputLabel>
              <Select
                value={parentCategory}
                onChange={e => setParentCategory(e.target.value)}
                label="Parent Category"
              >
                {existingCategories.map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {mode === 'main' && (
            <ToggleButtonGroup
              value={catType}
              exclusive
              onChange={(_, v) => v && setCatType(v)}
              fullWidth
              size="small"
            >
              <ToggleButton value="expense" sx={{ fontSize: '0.8rem' }}>
                Expense
              </ToggleButton>
              <ToggleButton value="income" sx={{ fontSize: '0.8rem' }}>
                Income
              </ToggleButton>
            </ToggleButtonGroup>
          )}

          <Typography variant="caption" color="text.secondary">
            {mode === 'sub'
              ? `"${categoryName}" will be added as a subcategory`
              : `"${categoryName}" will be added as a new ${catType} category`}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small"
          disabled={saving || (mode === 'sub' && !parentCategory)}
        >
          {saving ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryDialog;
