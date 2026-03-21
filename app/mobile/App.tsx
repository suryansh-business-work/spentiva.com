import React, { useEffect, useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { useAuthStore, useThemeStore, SnackbarProvider } from '@/contexts';
import { RootNavigator } from '@/navigation';
import { lightTheme, darkTheme } from '@/theme';
import { LoadingOverlay } from '@/components';
import { fontAssets } from '@/fonts';

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  const initializeTheme = useThemeStore((s) => s.initialize);
  const initializeAuth = useAuthStore((s) => s.initialize);
  const isLoading = useAuthStore((s) => s.isLoading);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const loadResources = useCallback(async () => {
    await Font.loadAsync(fontAssets);
    setFontsLoaded(true);
    await Promise.all([initializeTheme(), initializeAuth()]);
  }, [initializeTheme, initializeAuth]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  if (!fontsLoaded || isLoading) {
    return <LoadingOverlay visible message="Loading Spentiva..." />;
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SnackbarProvider>
          <NavigationContainer>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <RootNavigator />
          </NavigationContainer>
        </SnackbarProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
