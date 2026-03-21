import React, { useCallback, useState, useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import {
  ScreenHeader,
  Breadcrumb,
  ExpenseItemCard,
  EmptyState,
  ErrorView,
} from '@/components';
import { expenseService } from '@/services';
import type { Expense } from '@/types';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'TrackerDetail'>;

export const TrackerDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { trackerId } = route.params;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await expenseService.getAll(trackerId, { page: 1, limit: 50 });
    if (res.success && res.data) {
      setExpenses(res.data.items ?? []);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }, [trackerId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleExpensePress = useCallback(
    (expense: Expense) => {
      navigation.navigate('EditExpense', {
        trackerId,
        expenseId: expense._id,
      });
    },
    [navigation, trackerId]
  );

  const renderItem = useCallback(
    ({ item }: { item: Expense }) => (
      <ExpenseItemCard expense={item} onPress={handleExpensePress} />
    ),
    [handleExpensePress]
  );

  const keyExtractor = useCallback((item: Expense) => item._id, []);

  if (error) {
    return <ErrorView message={error} onRetry={fetchExpenses} />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Tracker" onBack={() => navigation.goBack()} />
      <Breadcrumb
        items={[
          { label: 'Trackers', onPress: () => navigation.goBack() },
          { label: 'Expenses' },
        ]}
      />
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={expenses.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchExpenses} colors={[theme.colors.primary]} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="receipt"
              title="No Expenses"
              description="Add your first expense to this tracker."
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { paddingBottom: 24 },
  emptyList: { flex: 1 },
});
