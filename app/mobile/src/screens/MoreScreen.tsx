import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { List, Divider, useTheme, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenHeader, Breadcrumb } from '@/components';
import { useAuthStore, useThemeStore } from '@/contexts';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const MoreScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const initials = user
    ? `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`
    : '?';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="More" />
      <Breadcrumb items={[{ label: 'More' }]} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
          <Avatar.Text size={56} label={initials} />
          <View style={styles.profileInfo}>
            <List.Item
              title={user ? `${user.firstName} ${user.lastName}` : 'User'}
              description={user?.email}
              titleStyle={styles.profileName}
            />
          </View>
        </View>

        <List.Section>
          <List.Item
            title="Profile"
            left={(props) => <List.Icon {...props} icon="account-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Profile')}
          />
          <Divider />
          <List.Item
            title="Billing"
            left={(props) => <List.Icon {...props} icon="credit-card-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Billing')}
          />
          <Divider />
          <List.Item
            title="Support"
            left={(props) => <List.Icon {...props} icon="lifebuoy" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Support')}
          />
          <Divider />
          <List.Item
            title="Settings"
            left={(props) => <List.Icon {...props} icon="cog-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Settings')}
          />
          <Divider />
          <List.Item
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            left={(props) => (
              <List.Icon {...props} icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'} />
            )}
            onPress={toggleTheme}
          />
          <Divider />
          <List.Item
            title="Logout"
            titleStyle={{ color: theme.colors.error }}
            left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
            onPress={handleLogout}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 2,
  },
  profileInfo: { flex: 1, marginLeft: 4 },
  profileName: { fontFamily: 'Inter-SemiBold' },
});
