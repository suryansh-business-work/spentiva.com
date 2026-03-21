import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader, Breadcrumb } from '@/components';

export const BillingScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Billing" onBack={() => navigation.goBack()} />
      <Breadcrumb items={[{ label: 'More', onPress: () => navigation.goBack() }, { label: 'Billing' }]} />
      <View style={styles.content}>
        <Text variant="bodyLarge">Billing and plan management will be implemented here.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
});
