import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  TablePagination,
  Typography,
  useTheme,
  Tooltip,
  Stack,
  Skeleton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  accountType: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profilePhoto: string | null;
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Box sx={{ p: 3 }}>
          {[1, 2, 3, 4].map(i => (
            <Stack key={i} direction="row" spacing={2} mb={2} alignItems="center">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
            </Stack>
          ))}
        </Box>
      </Paper>
    );
  }

  if (users.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Typography color="text.secondary">No users found</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  py: 2,
                  color: theme.palette.text.secondary,
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                User
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: theme.palette.text.secondary,
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                Role
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: theme.palette.text.secondary,
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                Plan
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: theme.palette.text.secondary,
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: theme.palette.text.secondary,
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                Joined
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: theme.palette.text.secondary,
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user.id}
                hover
                sx={{
                  '&:hover': {
                    bgcolor:
                      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  },
                  borderBottom:
                    index === users.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`,
                }}
              >
                <TableCell sx={{ py: 2, border: 'none' }}>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <Avatar
                      src={user.profilePhoto || undefined}
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.875rem',
                        boxShadow:
                          theme.palette.mode === 'dark'
                            ? '0 2px 8px rgba(0,0,0,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
                        {user.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ border: 'none' }}>
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor:
                        user.role === 'admin'
                          ? theme.palette.secondary.main
                          : theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.06)',
                      color:
                        user.role === 'admin'
                          ? theme.palette.secondary.contrastText
                          : theme.palette.text.primary,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ border: 'none' }}>
                  <Chip
                    label={user.accountType}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor:
                        user.accountType === 'pro'
                          ? theme.palette.success.main
                          : user.accountType === 'businesspro'
                            ? theme.palette.warning.main
                            : theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.1)'
                              : 'rgba(0,0,0,0.06)',
                      color: user.accountType === 'free' ? theme.palette.text.primary : '#fff',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ border: 'none' }}>
                  <Stack direction="row" gap={0.5}>
                    <Tooltip title={user.emailVerified ? 'Email verified' : 'Email not verified'}>
                      {user.emailVerified ? (
                        <CheckCircleIcon sx={{ fontSize: 18, color: theme.palette.success.main }} />
                      ) : (
                        <CancelIcon sx={{ fontSize: 18, color: theme.palette.text.disabled }} />
                      )}
                    </Tooltip>
                    <Tooltip title={user.phoneVerified ? 'Phone verified' : 'Phone not verified'}>
                      {user.phoneVerified ? (
                        <CheckCircleIcon sx={{ fontSize: 18, color: theme.palette.success.main }} />
                      ) : (
                        <CancelIcon sx={{ fontSize: 18, color: theme.palette.text.disabled }} />
                      )}
                    </Tooltip>
                  </Stack>
                </TableCell>
                <TableCell sx={{ border: 'none' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ border: 'none' }}>
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => onView(user)}
                        sx={{ padding: '6px', '&:hover': { bgcolor: theme.palette.action.hover } }}
                      >
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(user)}
                        sx={{ padding: '6px', '&:hover': { bgcolor: theme.palette.action.hover } }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(user)}
                        sx={{
                          padding: '6px',
                          '&:hover': { bgcolor: `${theme.palette.error.main}15` },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[20, 50, 100]}
        sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
      />
    </Paper>
  );
};

export default UsersTable;
