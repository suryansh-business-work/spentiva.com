import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/contexts';
import type { RootStackParamList } from '@/types/navigation';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { TrackerDetailScreen } from '@/screens/TrackerDetailScreen';
import { AddExpenseScreen } from '@/screens/AddExpenseScreen';
import { EditExpenseScreen } from '@/screens/EditExpenseScreen';
import { CategorySettingsScreen } from '@/screens/CategorySettingsScreen';
import { SupportScreen } from '@/screens/SupportScreen';
import { BillingScreen } from '@/screens/BillingScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: 'slide_from_right' as const,
    }),
    []
  );

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="TrackerDetail"
            component={TrackerDetailScreen}
            options={{ headerShown: true, title: 'Tracker' }}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{ headerShown: true, title: 'Add Expense' }}
          />
          <Stack.Screen
            name="EditExpense"
            component={EditExpenseScreen}
            options={{ headerShown: true, title: 'Edit Expense' }}
          />
          <Stack.Screen
            name="CategorySettings"
            component={CategorySettingsScreen}
            options={{ headerShown: true, title: 'Categories' }}
          />
          <Stack.Screen
            name="Support"
            component={SupportScreen}
            options={{ headerShown: true, title: 'Support' }}
          />
          <Stack.Screen
            name="Billing"
            component={BillingScreen}
            options={{ headerShown: true, title: 'Billing' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: true, title: 'Profile' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: true, title: 'Settings' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
