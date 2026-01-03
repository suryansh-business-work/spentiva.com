import React from 'react';
import {
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  useTheme,
  Stack,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Category {
  _id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

interface CategoryItemProps {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isExpanded,
  onToggle,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ListItem
      sx={{
        borderRadius: 2,
        mb: 1,
        bgcolor:
          theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
        pr: isMobile ? 16 : 18,
        pl: 1,
        '&:hover': {
          bgcolor:
            theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        flex={1}
        minWidth={0}
        overflow="hidden"
      >
        <IconButton size="small" onClick={onToggle} sx={{ flexShrink: 0 }}>
          {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </IconButton>
        <FolderIcon sx={{ color: theme.palette.success.main, flexShrink: 0 }} />
        <Box flex={1} minWidth={0} overflow="hidden">
          <Typography variant="body1" fontWeight={600} noWrap sx={{ pr: 1 }}>
            {category.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {category.subcategories.length} subcategories
          </Typography>
        </Box>
      </Stack>

      <ListItemSecondaryAction sx={{ right: isMobile ? 8 : 16 }}>
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={onAdd}
            sx={{ color: theme.palette.success.main, p: 0.5 }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onEdit} sx={{ p: 0.5 }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={onDelete} sx={{ p: 0.5 }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default CategoryItem;
