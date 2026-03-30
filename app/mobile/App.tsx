import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore, useThemeStore, SnackbarProvider } from '@/contexts';
import { RootNavigator } from '@/navigation';
import { lightTheme, darkTheme } from '@/theme';
import { LoadingOverlay, ErrorView } from '@/components';
import { fontAssets } from '@/fonts';
import { logger } from '@/utils/logger';

// Keep the splash screen visible until we're ready
SplashScreen.preventAutoHideAsync().catch(() => {
  // Already hidden or not available
});

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initError, setInitError] = useState(false);
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Stabilize store action refs to prevent infinite re-render loop
  const initializeTheme = useRef(useThemeStore.getState().initialize).current;
  const initializeAuth = useRef(useAuthStore.getState().initialize).current;

  // Use system-default theme before fonts load, custom theme after
  const theme = fontsLoaded
    ? (isDarkMode ? darkTheme : lightTheme)
    : (isDarkMode ? MD3DarkTheme : MD3LightTheme);

  useEffect(() => {
    let cancelled = false;

    const loadResources = async () => {
      try {
        await Font.loadAsync(fontAssets);
      } catch (err) {
        logger.error('Failed to load fonts', err);
        if (!cancelled) setInitError(true);
        return;
      }
      if (!cancelled) setFontsLoaded(true);

      try {
        await Promise.all([initializeTheme(), initializeAuth()]);
      } catch (err) {
        logger.error('Failed to initialize app', err);
        if (!cancelled) setInitError(true);
      }
    };

    loadResources();
    return () => { cancelled = true; };
  }, [initializeTheme, initializeAuth]);

  const isReady = fontsLoaded && !isLoading && !initError;

  // Hide splash screen once the app is ready or errored
  useEffect(() => {
    if (isReady || initError) {
      SplashScreen.hideAsync().catch(() => {
        // Already hidden
      });
    }
  }, [isReady, initError]);

  const handleRetry = () => {
    setInitError(false);
    setFontsLoaded(false);
    const retry = async () => {
      try {
        await Font.loadAsync(fontAssets);
        setFontsLoaded(true);
        await Promise.all([initializeTheme(), initializeAuth()]);
      } catch (err) {
        logger.error('Retry failed', err);
        setInitError(true);
      }
    };
    retry();
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SnackbarProvider>
          {initError ? (
            <ErrorView
              message="Failed to load app. Please try again."
              onRetry={handleRetry}
            />
          ) : !isReady ? (
            <LoadingOverlay visible message="Loading Spentiva..." />
          ) : (
            <NavigationContainer>
              <StatusBar style={isDarkMode ? 'light' : 'dark'} />
              <RootNavigator />
            </NavigationContainer>
          )}
        </SnackbarProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
