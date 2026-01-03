import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { endpoints } from '../../config/api';
import { postRequest } from '../../utils/http';

interface AddCategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  trackerId: string;
  suggestedCategory?: string;
}

const AddCategoryDrawer: React.FC<AddCategoryDrawerProps> = ({
  open,
  onClose,
  trackerId,
  suggestedCategory,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (suggestedCategory) {
      setCategoryName(suggestedCategory);
    }
  }, [suggestedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const subcategories = subcategoryName.trim()
        ? [{ id: Date.now().toString(), name: subcategoryName.trim() }]
        : [];

      await postRequest(endpoints.categories.create, {
        trackerId,
        name: categoryName.trim(),
        subcategories,
      });

      // Notify other components
      window.dispatchEvent(new Event('categoriesUpdated'));

      // Reset and close
      setCategoryName('');
      setSubcategoryName('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCategoryName('');
    setSubcategoryName('');
    setError('');
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          p: 3,
        },
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#10b981' }}>
            Add New Category
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              placeholder="e.g., Health, Education"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Subcategory (Optional)"
              value={subcategoryName}
              onChange={e => setSubcategoryName(e.target.value)}
              placeholder="e.g., Medicine, Doctor Visit"
              helperText="You can add more subcategories later from settings"
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
              disabled={loading || !categoryName.trim()}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                py: 1.5,
              }}
            >
              {loading ? 'Adding...' : 'Add Category'}
            </Button>

            <Button variant="outlined" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddCategoryDrawer;
