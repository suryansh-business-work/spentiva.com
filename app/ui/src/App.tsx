import { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import Header from './components/Header/Header';
import Trackers from './components/Trackers/Trackers';
import Usage from './components/Usage/Usage';
import Billing from './pages/Billing';
import UpcomingFeatures from './pages/UpcomingFeatures';
import Policy from './pages/Policy';
import NotFound from './pages/NotFound';
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { requestNotificationPermission } from './services/notificationService';
import { themeConfig, getDarkModeConfig } from './theme/palette';
import { AUTH_CONFIG } from './config/auth-config';

const RedirectToAuth = () => {
  useEffect(() => {
    window.location.href = AUTH_CONFIG.authUrl;
  }, []);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

// Redirect to external profile page
const RedirectToProfile = () => {
  useEffect(() => {
    window.location.href = AUTH_CONFIG.profileUrl;
  }, []);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

const RedirectToAdmin = () => {
  useEffect(() => {
    window.location.href = AUTH_CONFIG.authUrl + '/admin';
  }, []);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

const AppContent = () => {
  const { isDarkMode } = useThemeMode();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const theme = useMemo(
    () =>
      createTheme({
        ...themeConfig,
        ...(isDarkMode && getDarkModeConfig()),
      }),
    [isDarkMode]
  );

  useEffect(() => {
    // Request notification permission
    requestNotificationPermission();
  }, []);

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
          {isAuthenticated && <Header onCreateTracker={() => {
              window.dispatchEvent(new CustomEvent('createTracker'));
            }} />}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/trackers" replace /> : <RedirectToAuth />} />
              <Route path="/login" element={<RedirectToAuth />} />
              <Route path="/signup" element={<RedirectToAuth />} />
              <Route path="/forgot-password" element={<RedirectToAuth />} />
              <Route path="/reset-password" element={<RedirectToAuth />} />

              {/* Tracker routes with clean tab paths */}
              <Route path="/trackers" element={isAuthenticated ? <Trackers /> : <RedirectToAuth />} />
              <Route path="/tracker/:trackerId" element={isAuthenticated ? <Trackers /> : <RedirectToAuth />} />
              <Route path="/tracker/:trackerId/:tab" element={isAuthenticated ? <Trackers /> : <RedirectToAuth />} />

              <Route path="/profile" element={<RedirectToProfile />} />
              <Route path="/usage" element={isAuthenticated ? <Usage /> : <RedirectToAuth />} />
              <Route path="/billing" element={isAuthenticated ? <Billing /> : <RedirectToAuth />} />
              <Route path="/upcoming-features" element={isAuthenticated ? <UpcomingFeatures /> : <RedirectToAuth />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/admin/*" element={isAuthenticated ? <RedirectToAdmin /> : <RedirectToAuth />} />
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
        <AppContent />
      </ThemeModeProvider>
    </AuthProvider>
  );
}

export default App;
