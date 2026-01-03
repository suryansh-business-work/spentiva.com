import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  Alert,
  Stack,
  IconButton,
  Drawer,
  useMediaQuery,
  Typography,
} from '@mui/material';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminGreeting from '../../components/Admin/AdminGreeting';
import StatsCards from '../../components/Admin/StatsCards';
import DateFilterBar from '../../components/Admin/DateFilterBar';
import UserFilters from '../../components/Admin/UserFilters';
import UsersTable from '../../components/Admin/UsersTable';
import UserDetailDialog from '../../components/Admin/UserDetailDialog';
import UserEditDialog from '../../components/Admin/UserEditDialog';
import DeleteConfirmDialog from '../../components/Admin/DeleteConfirmDialog';
import AdminSupport from '../../components/Admin/AdminSupport';
import AdminSupportCreate from './AdminSupportCreate';
import AdminSupportEdit from './AdminSupportEdit';
import AdminPayments from '../../components/Admin/AdminPayments';
import { endpoints } from '../../config/api';
import { getRequest, putRequest, deleteRequest } from '../../utils/http';
import { parseResponseData } from '../../utils/response-parser';

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [dateFilter, setDateFilter] = useState('today');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    accountType: '',
    emailVerified: '',
  });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect /admin to /admin/dashboard
  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    fetchStats();
  }, [dateFilter, customDates]);

  useEffect(() => {
    if (location.pathname === '/admin/users') fetchUsers();
  }, [page, rowsPerPage, filters, location.pathname]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      let url = endpoints.admin.stats;
      const params = new URLSearchParams();
      if (dateFilter) params.append('filter', dateFilter);
      if (dateFilter === 'custom' && customDates.start && customDates.end) {
        params.append('startDate', customDates.start);
        params.append('endDate', customDates.end);
      }
      if (params.toString()) url += `?${params.toString()}`;
      const response = await getRequest(url);
      const data = parseResponseData<any>(response, {});
      setStatsData({ ...data, filter: dateFilter });
      setError(null);
    } catch (err: any) {
      setError('Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(page + 1));
      params.append('limit', String(rowsPerPage));
      if (filters.role) params.append('role', filters.role);
      if (filters.accountType) params.append('accountType', filters.accountType);
      if (filters.emailVerified) params.append('emailVerified', filters.emailVerified);
      const response = await getRequest(`${endpoints.admin.users}?${params.toString()}`);
      const data = parseResponseData<any>(response, {});
      setUsers(data.users || []);
      setTotalCount(data.pagination?.total || 0);
      setError(null);
    } catch (err: any) {
      setError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDateFilter = (filter: string, start?: string, end?: string) => {
    setDateFilter(filter);
    if (filter === 'custom' && start && end) {
      setCustomDates({ start, end });
    }
  };

  const handleSaveEdit = async (data: any) => {
    try {
      setEditLoading(true);
      await putRequest(endpoints.admin.updateUser(selectedUser.id), data);
      setEditDialogOpen(false);
      fetchUsers();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteRequest(endpoints.admin.deleteUser(selectedUser.id));
      setDeleteDialogOpen(false);
      fetchUsers();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getSectionTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Dashboard';
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/admin/support')) return 'Support Tickets';
    if (path.includes('/admin/payments')) return 'Payment Logs';
    return 'Dashboard';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f8f9fa',
      }}
    >
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <Box
          sx={{
            flexShrink: 0,
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: sidebarExpanded ? 'flex-start' : 'center',
              transition: 'all 0.3s ease',
            }}
          >
            {sidebarExpanded ? (
              <>
                <Typography variant="h6" fontWeight={800} color="primary">
                  Admin Panel
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Spentiva
                </Typography>
              </>
            ) : (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                A
              </Box>
            )}
          </Box>
          <AdminSidebar onExpandedChange={setSidebarExpanded} />
        </Box>
      )}

      {/* Sidebar - Mobile Drawer */}
      <Drawer anchor="left" open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
        <Box sx={{ width: 240 }}>
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" fontWeight={800} color="primary">
              Admin Panel
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Spentiva
            </Typography>
          </Box>
          <AdminSidebar isMobile onMobileClose={() => setMobileDrawerOpen(false)} />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {isMobile && (
              <IconButton onClick={() => setMobileDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h5" fontWeight={800}>
              {getSectionTitle()}
            </Typography>
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Routes>
            {/* Dashboard Section */}
            <Route
              path="dashboard"
              element={
                <Stack spacing={3}>
                  {!statsLoading && statsData && <AdminGreeting stats={statsData} />}
                  <DateFilterBar onFilterChange={handleDateFilter} currentFilter={dateFilter} />
                  <StatsCards data={statsData} loading={statsLoading} />
                </Stack>
              }
            />

            {/* User Management Section */}
            <Route
              path="users"
              element={
                <Stack spacing={2}>
                  <UserFilters filters={filters} onFilterChange={setFilters} />
                  <UsersTable
                    users={users}
                    loading={usersLoading}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={totalCount}
                    onPageChange={setPage}
                    onRowsPerPageChange={setRowsPerPage}
                    onView={user => {
                      setSelectedUser(user);
                      setViewDialogOpen(true);
                    }}
                    onEdit={user => {
                      setSelectedUser(user);
                      setEditDialogOpen(true);
                    }}
                    onDelete={user => {
                      setSelectedUser(user);
                      setDeleteDialogOpen(true);
                    }}
                  />
                </Stack>
              }
            />

            {/* Support Section */}
            <Route path="support" element={<AdminSupport />} />
            <Route path="support/create" element={<AdminSupportCreate />} />
            <Route path="support/edit/:ticketId" element={<AdminSupportEdit />} />

            {/* Payment Logs Section */}
            <Route path="payments" element={<AdminPayments />} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Box>

        <UserDetailDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          user={selectedUser}
        />
        <UserEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSaveEdit}
          user={selectedUser}
          loading={editLoading}
        />
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          userName={selectedUser?.name || ''}
          userEmail={selectedUser?.email || ''}
          loading={deleteLoading}
        />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
