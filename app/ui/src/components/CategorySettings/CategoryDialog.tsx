import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';

interface CategoryDialogProps {
  open: boolean;
  type: 'category' | 'subcategory';
  mode: 'add' | 'edit';
  value: string;
  parentCategoryName?: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  type,
  mode,
  value,
  parentCategoryName,
  onChange,
  onSave,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add' : 'Edit'} {type === 'category' ? 'Category' : 'Subcategory'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={type === 'category' ? 'Category Name' : 'Subcategory Name'}
          type="text"
          fullWidth
          variant="outlined"
          value={value}
          onChange={e => onChange(e.target.value)}
          sx={{ mt: 2 }}
        />
        {type === 'subcategory' && parentCategoryName && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Adding subcategory to: <strong>{parentCategoryName}</strong>
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {mode === 'add' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
