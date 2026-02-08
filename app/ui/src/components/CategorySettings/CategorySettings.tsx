import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  Collapse,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CategoryItem from './CategoryItem';
import SubcategoryList from './SubcategoryList';
import CategoryDialog from './CategoryDialog';
import { endpoints } from '../../config/api';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../utils/http';
import { parseResponseData } from '../../utils/response-parser';

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  _id: string;
  trackerId: string;
  name: string;
  type: string;
  subcategories: SubCategory[];
}

type CategoryTabType = 'expense' | 'income' | 'debit_mode' | 'credit_mode';

const TAB_CONFIG: { value: CategoryTabType; label: string; description: string }[] = [
  {
    value: 'expense',
    label: 'Expense',
    description: 'Manage expense categories. These help organize your spending.',
  },
  {
    value: 'income',
    label: 'Income',
    description: 'Manage income categories. These help organize your earnings.',
  },
  {
    value: 'debit_mode',
    label: 'Debit From',
    description: 'Manage payment modes (how you pay). E.g. Credit Card, UPI, Cash.',
  },
  {
    value: 'credit_mode',
    label: 'Credit From',
    description: 'Manage income sources (how you receive). E.g. Bank Transfer, Cash.',
  },
];

interface CategorySettingsProps {
  trackerId: string;
}

const CategorySettings: React.FC<CategorySettingsProps> = ({ trackerId }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<CategoryTabType>('expense');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'category' | 'subcategory'>('category');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRequest(endpoints.categories.getAll(trackerId, activeTab));
      const data = parseResponseData<{ categories: Category[] }>(response, { categories: [] });
      setCategories(data?.categories || []);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load categories', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [trackerId, activeTab]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    newExpanded.has(categoryId) ? newExpanded.delete(categoryId) : newExpanded.add(categoryId);
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    setDialogType('category');
    setDialogMode('add');
    setCategoryName('');
    setSelectedCategory(null);
    setOpenDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setDialogType('category');
    setDialogMode('edit');
    setCategoryName(category.name);
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`Delete "${category.name}" and all its subcategories?`)) {
      try {
        await deleteRequest(endpoints.categories.delete(category._id));
        setSnackbar({ open: true, message: 'Category deleted', severity: 'success' });
        loadCategories();
      } catch {
        setSnackbar({ open: true, message: 'Failed to delete', severity: 'error' });
      }
    }
  };

  const handleAddSubcategory = (category: Category) => {
    setDialogType('subcategory');
    setDialogMode('add');
    setSubcategoryName('');
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setOpenDialog(true);
  };

  const handleEditSubcategory = (category: Category, subcategory: SubCategory) => {
    setDialogType('subcategory');
    setDialogMode('edit');
    setSubcategoryName(subcategory.name);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setOpenDialog(true);
  };

  const handleDeleteSubcategory = async (category: Category, subcategory: SubCategory) => {
    if (window.confirm(`Delete "${subcategory.name}"?`)) {
      try {
        const updatedSubcategories = category.subcategories.filter(
          sub => sub.id !== subcategory.id
        );
        await putRequest(endpoints.categories.update(category._id), {
          name: category.name,
          subcategories: updatedSubcategories,
        });
        setSnackbar({ open: true, message: 'Subcategory deleted', severity: 'success' });
        loadCategories();
      } catch {
        setSnackbar({ open: true, message: 'Failed to delete', severity: 'error' });
      }
    }
  };

  const handleSaveDialog = async () => {
    const name = dialogType === 'category' ? categoryName : subcategoryName;
    if (!name.trim()) {
      setSnackbar({ open: true, message: 'Name is required', severity: 'error' });
      return;
    }

    try {
      if (dialogType === 'category') {
        if (dialogMode === 'add') {
          await postRequest(endpoints.categories.create, {
            trackerId,
            name,
            type: activeTab,
            subcategories: [],
          });
        } else if (selectedCategory) {
          await putRequest(endpoints.categories.update(selectedCategory._id), {
            name,
            subcategories: selectedCategory.subcategories,
          });
        }
      } else if (selectedCategory) {
        let updatedSubcategories = [...selectedCategory.subcategories];
        if (dialogMode === 'add') {
          updatedSubcategories.push({ id: `${Date.now()}`, name });
        } else if (selectedSubcategory) {
          updatedSubcategories = updatedSubcategories.map(sub =>
            sub.id === selectedSubcategory.id ? { ...sub, name } : sub
          );
        }
        await putRequest(endpoints.categories.update(selectedCategory._id), {
          name: selectedCategory.name,
          subcategories: updatedSubcategories,
        });
      }
      setSnackbar({ open: true, message: 'Saved successfully', severity: 'success' });
      loadCategories();
    } catch {
      setSnackbar({ open: true, message: 'Failed to save', severity: 'error' });
    }

    setOpenDialog(false);
    setCategoryName('');
    setSubcategoryName('');
  };

  const activeConfig = TAB_CONFIG.find(t => t.value === activeTab)!;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          mb={1}
        >
          <Typography variant="h5" fontWeight={700} color="success.main">
            Manage Categories
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCategory}
            color="success"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add {activeConfig.label}
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {activeConfig.description}
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, v) => {
            setActiveTab(v);
            setExpandedCategories(new Set());
          }}
          variant="scrollable"
          scrollButtons="auto"
          textColor="inherit"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 'auto',
              px: 2,
            },
            '& .Mui-selected': {
              color: 'success.main',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.success.main,
            },
          }}
        >
          {TAB_CONFIG.map(tab => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="success" />
          </Box>
        ) : categories.length === 0 ? (
          <Alert severity="info">
            No {activeConfig.label.toLowerCase()} categories found. Add your first one to get
            started.
          </Alert>
        ) : (
          <List>
            {categories.map((category, index) => (
              <React.Fragment key={category._id}>
                <CategoryItem
                  category={category}
                  isExpanded={expandedCategories.has(category._id)}
                  onToggle={() => toggleCategory(category._id)}
                  onAdd={() => handleAddSubcategory(category)}
                  onEdit={() => handleEditCategory(category)}
                  onDelete={() => handleDeleteCategory(category)}
                />
                <Collapse in={expandedCategories.has(category._id)} timeout="auto" unmountOnExit>
                  <SubcategoryList
                    subcategories={category.subcategories}
                    onEdit={sub => handleEditSubcategory(category, sub)}
                    onDelete={sub => handleDeleteSubcategory(category, sub)}
                  />
                </Collapse>
                {index < categories.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <CategoryDialog
        open={openDialog}
        type={dialogType}
        mode={dialogMode}
        value={dialogType === 'category' ? categoryName : subcategoryName}
        parentCategoryName={dialogType === 'subcategory' ? selectedCategory?.name : undefined}
        onChange={dialogType === 'category' ? setCategoryName : setSubcategoryName}
        onSave={handleSaveDialog}
        onClose={() => setOpenDialog(false)}
      />

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
    </Box>
  );
};

export default CategorySettings;
