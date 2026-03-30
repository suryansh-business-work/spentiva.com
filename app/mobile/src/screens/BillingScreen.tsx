import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card, useTheme, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader, Breadcrumb, AppButton } from '@/components';
import { useAuthStore, useSnackbar } from '@/contexts';
import { paymentService } from '@/services';
import config from '@/config';

const { PLANS } = config;

export const BillingScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const { showSnackbar } = useSnackbar();

  const currentPlan = user?.roleSlug === 'businesspro' ? 'BUSINESS_PRO' : user?.roleSlug === 'pro' ? 'PRO' : 'FREE';

  const handleUpgrade = useCallback(async (plan: string) => {
    try {
      const res = await paymentService.create({
        plan,
        planDuration: 'monthly',
        paymentMethod: 'card',
      });
      if (res.success) {
        showSnackbar('Plan upgrade initiated', 'success');
      } else {
        showSnackbar(res.message || 'Upgrade failed', 'error');
      }
    } catch {
      showSnackbar('Failed to initiate upgrade', 'error');
    }
  }, [showSnackbar]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Billing" onBack={() => navigation.goBack()} />
      <Breadcrumb items={[{ label: 'More', onPress: () => navigation.goBack() }, { label: 'Billing' }]} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={[styles.currentPlan, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.planContent}>
            <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer }}>
              Current Plan
            </Text>
            <Text variant="headlineSmall" style={[styles.bold, { color: theme.colors.onPrimaryContainer }]}>
              {currentPlan.replace('_', ' ')}
            </Text>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Available Plans</Text>

        <Card style={[styles.planCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.bold}>Free</Text>
            <Text variant="headlineMedium" style={styles.bold}>$0</Text>
            <Divider style={styles.planDivider} />
            <List.Item title={`${PLANS.FREE.trackers} Trackers`} left={(p) => <List.Icon {...p} icon="check" />} />
            <List.Item title={`${PLANS.FREE.messages} Messages`} left={(p) => <List.Icon {...p} icon="check" />} />
          </Card.Content>
        </Card>

        <Card style={[styles.planCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.bold}>Pro</Text>
            <Text variant="headlineMedium" style={styles.bold}>${PLANS.PRO.monthlyPrice}/mo</Text>
            <Divider style={styles.planDivider} />
            <List.Item title={`${PLANS.PRO.trackers} Trackers`} left={(p) => <List.Icon {...p} icon="check" />} />
            <List.Item title={`${PLANS.PRO.messages} Messages`} left={(p) => <List.Icon {...p} icon="check" />} />
            {currentPlan !== 'PRO' && (
              <AppButton title="Upgrade to Pro" mode="contained" onPress={() => handleUpgrade('pro')} fullWidth />
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.planCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.bold}>Business Pro</Text>
            <Text variant="headlineMedium" style={styles.bold}>${PLANS.BUSINESS_PRO.monthlyPrice}/mo</Text>
            <Divider style={styles.planDivider} />
            <List.Item title="Unlimited Trackers" left={(p) => <List.Icon {...p} icon="check" />} />
            <List.Item title="Unlimited Messages" left={(p) => <List.Icon {...p} icon="check" />} />
            {currentPlan !== 'BUSINESS_PRO' && (
              <AppButton title="Upgrade to Business Pro" mode="contained" onPress={() => handleUpgrade('businesspro')} fullWidth />
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  currentPlan: { marginBottom: 24, borderRadius: 16 },
  planContent: { alignItems: 'center', gap: 8, paddingVertical: 24 },
  sectionTitle: { fontFamily: 'Inter-SemiBold', marginBottom: 12 },
  planCard: { marginBottom: 16, borderRadius: 12, elevation: 1 },
  planDivider: { marginVertical: 12 },
  bold: { fontFamily: 'Inter-Bold' },
});
