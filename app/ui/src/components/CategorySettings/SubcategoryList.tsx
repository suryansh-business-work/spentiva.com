import React from 'react';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  useTheme,
  Stack,
  useMediaQuery,
} from '@mui/material';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface SubCategory {
  id: string;
  name: string;
}

interface SubcategoryListProps {
  subcategories: SubCategory[];
  onEdit: (sub: SubCategory) => void;
  onDelete: (sub: SubCategory) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({ subcategories, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <List component="div" disablePadding sx={{ ml: { xs: 2, sm: 4 }, mr: { xs: 1, sm: 0 } }}>
      {subcategories.map(subcategory => (
        <ListItem
          key={subcategory.id}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            pr: isMobile ? 14 : 12,
            pl: 1,
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(16, 185, 129, 0.05)'
                : 'rgba(16, 185, 129, 0.02)',
            '&:hover': {
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(16, 185, 129, 0.05)',
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
            <SubdirectoryArrowRightIcon
              sx={{ fontSize: 20, color: 'text.secondary', flexShrink: 0 }}
            />
            <Typography variant="body2" fontWeight={500} noWrap sx={{ pr: 1 }}>
              {subcategory.name}
            </Typography>
          </Stack>

          <ListItemSecondaryAction sx={{ right: isMobile ? 8 : 16 }}>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(subcategory)} sx={{ p: 0.5 }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(subcategory)}
                sx={{ p: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default SubcategoryList;
