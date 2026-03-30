import React from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { List, Divider, Switch, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader, Breadcrumb } from '@/components';
import { useThemeStore } from '@/contexts';
import Constants from 'expo-constants';

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <Breadcrumb items={[{ label: 'More', onPress: () => navigation.goBack() }, { label: 'Settings' }]} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <List.Section title="Appearance">
          <List.Item
            title="Dark Mode"
            left={(props) => <List.Icon {...props} icon={isDarkMode ? 'weather-night' : 'white-balance-sunny'} />}
            right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} />}
          />
        </List.Section>
        <Divider />
        <List.Section title="About">
          <List.Item
            title="Version"
            description={appVersion}
            left={(props) => <List.Icon {...props} icon="information-outline" />}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-lock-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Linking.openURL('https://spentiva.com/privacy-policy')}
          />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Linking.openURL('https://spentiva.com/terms-and-conditions')}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },
});
