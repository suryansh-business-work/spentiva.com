import { useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import Header from './components/Header/Header';
import Trackers from './components/Trackers/Trackers';
import Usage from './components/Usage/Usage';
import Billing from './pages/Billing';
import UpcomingFeatures from './pages/UpcomingFeatures';
import Integrations from './pages/Integrations';
import Policy from './pages/Policy';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TokenExpiredProvider, useTokenExpired } from './contexts/TokenExpiredContext';
import { requestNotificationPermission } from './services/notificationService';
import { themeConfig, getDarkModeConfig } from './theme/palette';
import { setTokenExpiredCallback } from './utils/axiosSetup';
// Import axios setup to initialize interceptors
import './utils/axiosSetup';

const AppContent = () => {
  const { isDarkMode } = useThemeMode();
  const { isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const { showTokenExpiredModal } = useTokenExpired();

  const theme = useMemo(
    () =>
      createTheme({
        ...themeConfig,
        ...(isDarkMode && getDarkModeConfig()),
      }),
    [isDarkMode]
  );

  const handleAuthSuccess = useCallback(() => {
    refreshUser().then(() => {
      window.location.href = '/trackers';
    });
  }, [refreshUser]);

  useEffect(() => {
    requestNotificationPermission();
    setTokenExpiredCallback(showTokenExpiredModal);
  }, [showTokenExpiredModal]);

  if (authLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}
        >
          {isAuthenticated && (
            <Header
              onCreateTracker={() => {
                window.dispatchEvent(new CustomEvent('createTracker'));
              }}
            />
          )}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/trackers" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/trackers" replace />
                  ) : (
                    <Login onLoginSuccess={handleAuthSuccess} />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  isAuthenticated ? (
                    <Navigate to="/trackers" replace />
                  ) : (
                    <Register onRegisterSuccess={handleAuthSuccess} />
                  )
                }
              />
              <Route
                path="/forgot-password"
                element={
                  isAuthenticated ? (
                    <Navigate to="/trackers" replace />
                  ) : (
                    <ForgotPassword />
                  )
                }
              />
              <Route
                path="/reset-password"
                element={
                  isAuthenticated ? (
                    <Navigate to="/trackers" replace />
                  ) : (
                    <ResetPassword />
                  )
                }
              />

              {/* Tracker routes with clean tab paths */}
              <Route
                path="/trackers"
                element={isAuthenticated ? <Trackers /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/tracker/:trackerId"
                element={isAuthenticated ? <Trackers /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/tracker/:trackerId/:tab"
                element={isAuthenticated ? <Trackers /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/tracker/:trackerId/:tab/:subtab"
                element={isAuthenticated ? <Trackers /> : <Navigate to="/login" replace />}
              />

              <Route
                path="/usage"
                element={isAuthenticated ? <Usage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/billing"
                element={isAuthenticated ? <Billing /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/upcoming-features"
                element={
                  isAuthenticated ? <UpcomingFeatures /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/integrations"
                element={isAuthenticated ? <Integrations /> : <Navigate to="/login" replace />}
              />
              <Route path="/policy" element={<Policy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeModeProvider>
        <TokenExpiredProvider>
          <AppContent />
        </TokenExpiredProvider>
      </ThemeModeProvider>
    </AuthProvider>
  );
}

export default App;
