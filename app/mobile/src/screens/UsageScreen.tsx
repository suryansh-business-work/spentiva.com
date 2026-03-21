import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Breadcrumb, StatCard, EmptyState, ErrorView } from '@/components';
import { usageService } from '@/services';
import type { UsageOverview } from '@/types';

export const UsageScreen: React.FC = () => {
  const theme = useTheme();
  const [usage, setUsage] = useState<UsageOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await usageService.getOverview();
    if (res.success && res.data) {
      setUsage(res.data);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  if (error) {
    return <ErrorView message={error} onRetry={fetchUsage} />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Usage" />
      <Breadcrumb items={[{ label: 'Usage' }]} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {usage ? (
          <>
            <View style={styles.statsRow}>
              <StatCard icon="message-text-outline" label="Total Messages" value={`${usage.totalMessages}`} />
              <StatCard icon="lightning-bolt-outline" label="Total Tokens" value={`${usage.totalTokens}`} />
            </View>
            <View style={styles.statsRow}>
              <StatCard icon="account-outline" label="Your Messages" value={`${usage.userMessages}`} color="#60A5FA" />
              <StatCard icon="robot-outline" label="AI Messages" value={`${usage.aiMessages}`} color="#A78BFA" />
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Message Distribution
              </Text>
              <View style={styles.progressItem}>
                <Text variant="bodyMedium">User Messages</Text>
                <ProgressBar
                  progress={usage.totalMessages > 0 ? usage.userMessages / usage.totalMessages : 0}
                  color="#60A5FA"
                  style={styles.progressBar}
                />
              </View>
              <View style={styles.progressItem}>
                <Text variant="bodyMedium">AI Messages</Text>
                <ProgressBar
                  progress={usage.totalMessages > 0 ? usage.aiMessages / usage.totalMessages : 0}
                  color="#A78BFA"
                  style={styles.progressBar}
                />
              </View>
            </View>
          </>
        ) : (
          !loading && <EmptyState icon="chart-donut" title="No Usage Data" description="Start using trackers to see usage statistics." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  section: { marginTop: 16 },
  sectionTitle: { fontFamily: 'Inter-SemiBold', marginBottom: 12 },
  progressItem: { marginBottom: 16, gap: 6 },
  progressBar: { height: 8, borderRadius: 4 },
});
