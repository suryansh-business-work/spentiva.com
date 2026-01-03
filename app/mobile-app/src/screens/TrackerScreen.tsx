import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, Chip, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '../theme/palette';

interface TrackerScreenProps {
  navigation: any;
}

export default function TrackerScreen({ navigation }: TrackerScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Expense Tracker
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Track your expenses effortlessly
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="labelMedium" style={styles.cardLabel}>
                This Month
              </Text>
              <Text variant="headlineLarge" style={styles.amountText}>
                ₹0.00
              </Text>
              <View style={styles.chipContainer}>
                <Chip
                  icon="trending-down"
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  0% from last month
                </Chip>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.smallCardsRow}>
            <Card style={[styles.smallCard, { marginRight: 8 }]}>
              <Card.Content>
                <Text variant="labelSmall" style={styles.smallCardLabel}>
                  Today
                </Text>
                <Text variant="titleLarge" style={styles.smallCardAmount}>
                  ₹0.00
                </Text>
              </Card.Content>
            </Card>

            <Card style={[styles.smallCard, { marginLeft: 8 }]}>
              <Card.Content>
                <Text variant="labelSmall" style={styles.smallCardLabel}>
                  This Week
                </Text>
                <Text variant="titleLarge" style={styles.smallCardAmount}>
                  ₹0.00
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Recent Expenses */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Expenses
          </Text>

          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text variant="bodyLarge" style={styles.emptyTitle}>
                No expenses yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Start tracking by adding your first expense
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Top Categories
          </Text>

          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Your spending categories will appear here
              </Text>
            </Card.Content>
          </Card>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Expense FAB */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        label="Add Expense"
        onPress={() => console.log('Add expense')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    color: palette.text.primary,
    fontWeight: '600',
  },
  subtitle: {
    color: palette.text.secondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: palette.primary,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  amountText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 36,
  },
  chipContainer: {
    marginTop: 12,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
  },
  chipText: {
    color: '#FFFFFF',
  },
  smallCardsRow: {
    flexDirection: 'row',
  },
  smallCard: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  smallCardLabel: {
    color: palette.text.secondary,
    marginBottom: 4,
  },
  smallCardAmount: {
    color: palette.text.primary,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: palette.text.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: palette.surface,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    color: palette.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: palette.text.secondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },
});
