import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, Breadcrumb, StatCard, EmptyState, ErrorView } from '@/components';
import { analyticsService } from '@/services';
import type { AnalyticsSummary, CategoryExpense, AnalyticsFilter } from '@/types';
import { useState, useCallback, useEffect } from 'react';

const FILTERS: { label: string; value: AnalyticsFilter }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'last7days' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'All Time', value: 'all' },
];

export const AnalyticsScreen: React.FC = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState<AnalyticsFilter>('thisMonth');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [categories, setCategories] = useState<CategoryExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [summaryRes, categoryRes] = await Promise.all([
      analyticsService.getSummary('all', { period: filter }),
      analyticsService.getByCategory('all', { period: filter }),
    ]);
    if (summaryRes.success && summaryRes.data) {
      setSummary(summaryRes.data);
    } else {
      setError(summaryRes.message);
    }
    if (categoryRes.success && categoryRes.data) {
      setCategories(categoryRes.data);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleFilterChange = useCallback((f: AnalyticsFilter) => setFilter(f), []);

  if (error) {
    return <ErrorView message={error} onRetry={fetchAnalytics} />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Analytics" />
      <Breadcrumb items={[{ label: 'Analytics' }]} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.filters}>
          {FILTERS.map((f) => (
            <Chip
              key={f.value}
              selected={filter === f.value}
              onPress={() => handleFilterChange(f.value)}
              style={styles.chip}
              compact
            >
              {f.label}
            </Chip>
          ))}
        </View>

        {summary ? (
          <>
            <View style={styles.statsRow}>
              <StatCard icon="cash-minus" label="Expenses" value={`$${summary.totalExpenses.toFixed(0)}`} color="#EF4444" />
              <StatCard icon="cash-plus" label="Income" value={`$${summary.totalIncome.toFixed(0)}`} color="#10B981" />
            </View>
            <View style={styles.statsRow}>
              <StatCard icon="scale-balance" label="Balance" value={`$${summary.netBalance.toFixed(0)}`} />
              <StatCard icon="counter" label="Transactions" value={`${summary.transactionCount}`} />
            </View>

            {categories.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  By Category
                </Text>
                {categories.map((cat) => (
                  <View key={cat.category} style={styles.categoryRow}>
                    <Text variant="bodyMedium" style={styles.categoryName}>{cat.category}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      ${cat.amount.toFixed(0)} ({cat.percentage.toFixed(0)}%)
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          !loading && <EmptyState icon="chart-bar" title="No Data" description="Start adding expenses to see analytics." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { borderRadius: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  section: { marginTop: 16 },
  sectionTitle: { fontFamily: 'Inter-SemiBold', marginBottom: 12 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#E2E8F0' },
  categoryName: { fontFamily: 'Inter-Medium' },
});
