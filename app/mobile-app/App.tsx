import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeModeProvider, useThemeMode } from './src/contexts/ThemeContext';
import VerificationBanner from './src/components/VerificationBanner';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';

// Main Screens
import TrackersScreen from './src/screens/TrackersScreen';
import TrackerViewScreen from './src/screens/TrackerViewScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UsageScreen from './src/screens/UsageScreen';
import BillingScreen from './src/screens/BillingScreen';
import PolicyScreen from './src/screens/PolicyScreen';
import UpcomingFeaturesScreen from './src/screens/UpcomingFeaturesScreen';
import NotFoundScreen from './src/screens/NotFoundScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Auth Stack for non-authenticated users
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

// Main Drawer Navigator for authenticated users
function MainDrawer() {
  const { user } = useAuth();

  return (
    <>
      {user && !user.emailVerified && <VerificationBanner />}
      <Drawer.Navigator
        initialRouteName="Trackers"
        screenOptions={{
          headerShown: true,
          drawerType: 'slide',
        }}
      >
        <Drawer.Screen
          name="Trackers"
          component={TrackersScreen}
          options={{ title: 'My Trackers' }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
        <Drawer.Screen
          name="Usage"
          component={UsageScreen}
          options={{ title: 'Usage' }}
        />
        <Drawer.Screen
          name="Billing"
          component={BillingScreen}
          options={{ title: 'Billing' }}
        />
        <Drawer.Screen
          name="UpcomingFeatures"
          component={UpcomingFeaturesScreen}
          options={{ title: 'Upcoming Features' }}
        />
        <Drawer.Screen
          name="Policy"
          component={PolicyScreen}
          options={{ title: 'Privacy Policy' }}
        />
      </Drawer.Navigator>
    </>
  );
}

// Main App Navigator
function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainDrawer} />
          <Stack.Screen
            name="TrackerView"
            component={TrackerViewScreen}
            options={{ headerShown: true, title: 'Tracker Details' }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}

// App Content with Providers
function AppContent() {
  const { theme } = useThemeMode();

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

// Root App Component
export default function App() {
  return (
    <AuthProvider>
      <ThemeModeProvider>
        <AppContent />
      </ThemeModeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
