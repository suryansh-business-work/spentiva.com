import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Card,
  Text,
  FAB,
  Chip,
  ActivityIndicator,
  IconButton,
  Searchbar,
  Menu,
  Button,
} from 'react-native-paper';
import { trackerService } from '../../services/trackerService';
import { Transaction } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface Props {
  trackerId: string;
}

export default function TrackerTransactionsTab({ trackerId }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [trackerId, filterType]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await trackerService.getTransactions(trackerId);
      let filtered = response.data;

      if (filterType !== 'all') {
        filtered = filtered.filter((t) => t.type === filterType);
      }

      setTransactions(filtered);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const handleDelete = async (transactionId: string) => {
    try {
      await trackerService.deleteTransaction(trackerId, transactionId);
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'income';

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.transactionHeader}>
            <View style={styles.transactionInfo}>
              <Text variant="titleMedium" style={styles.description}>
                {item.description}
              </Text>
              <View style={styles.metadata}>
                {item.category && (
                  <Chip icon="tag" style={styles.categoryChip}>
                    {item.category.name}
                  </Chip>
                )}
                <Text variant="bodySmall" style={styles.date}>
                  {formatDate(item.date)}
                </Text>
              </View>
            </View>
            <View style={styles.amountContainer}>
              <Text
                variant="titleLarge"
                style={[styles.amount, isIncome ? styles.incomeAmount : styles.expenseAmount]}
              >
                {isIncome ? '+' : '-'}
                {formatCurrency(item.amount)}
              </Text>
              <IconButton
                icon="delete"
                size={20}
                onPress={() => handleDelete(item.id)}
                iconColor="#f44336"
              />
            </View>
          </View>
          {item.paymentMethod && (
            <Text variant="bodySmall" style={styles.paymentMethod}>
              Payment: {item.paymentMethod}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search transactions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <View style={styles.filterContainer}>
          <Button
            mode={filterType === 'all' ? 'contained' : 'outlined'}
            onPress={() => setFilterType('all')}
            style={styles.filterButton}
          >
            All
          </Button>
          <Button
            mode={filterType === 'income' ? 'contained' : 'outlined'}
            onPress={() => setFilterType('income')}
            style={styles.filterButton}
          >
            Income
          </Button>
          <Button
            mode={filterType === 'expense' ? 'contained' : 'outlined'}
            onPress={() => setFilterType('expense')}
            style={styles.filterButton}
          >
            Expense
          </Button>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No transactions found</Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Start adding transactions to track your expenses
            </Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Transaction"
        onPress={() => {
          // Navigate to add transaction screen
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchbar: {
    marginBottom: 12,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontWeight: '600',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    height: 28,
  },
  date: {
    opacity: 0.6,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  expenseAmount: {
    color: '#f44336',
  },
  paymentMethod: {
    marginTop: 4,
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptySubtext: {
    marginTop: 8,
    opacity: 0.6,
    textAlign: 'center',
  },
});
