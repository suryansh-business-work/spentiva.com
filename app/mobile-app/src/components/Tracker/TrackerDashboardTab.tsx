import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { trackerService } from '../../services/trackerService';
import { AnalyticsData } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  trackerId: string;
}

const screenWidth = Dimensions.get('window').width;

export default function TrackerDashboardTab({ trackerId }: Props) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [trackerId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await trackerService.getAnalytics(trackerId);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="bodyLarge">No data available</Text>
      </View>
    );
  }

  const pieData = analytics.categoryBreakdown.map((cat, index) => ({
    name: cat.categoryName,
    amount: cat.amount,
    color: cat.color || `hsl(${(index * 360) / analytics.categoryBreakdown.length}, 70%, 60%)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.summaryLabel}>
              Total Income
            </Text>
            <Text variant="headlineSmall" style={[styles.summaryValue, styles.incomeText]}>
              {formatCurrency(analytics.totalIncome)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.summaryLabel}>
              Total Expenses
            </Text>
            <Text variant="headlineSmall" style={[styles.summaryValue, styles.expenseText]}>
              {formatCurrency(analytics.totalExpense)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.summaryLabel}>
              Balance
            </Text>
            <Text
              variant="headlineSmall"
              style={[
                styles.summaryValue,
                analytics.balance >= 0 ? styles.positiveText : styles.negativeText,
              ]}
            >
              {formatCurrency(analytics.balance)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Category Breakdown */}
      {analytics.categoryBreakdown.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Spending by Category" />
          <Card.Content>
            <PieChart
              data={pieData}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            <View style={styles.categoryList}>
              {analytics.categoryBreakdown.map((cat, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                    <Text variant="bodyMedium" style={styles.categoryName}>
                      {cat.categoryName}
                    </Text>
                  </View>
                  <View style={styles.categoryDetails}>
                    <Text variant="bodyMedium" style={styles.categoryAmount}>
                      {formatCurrency(cat.amount)}
                    </Text>
                    <Chip style={styles.percentageChip}>{cat.percentage.toFixed(1)}%</Chip>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Daily Trend */}
      {analytics.dailyTrend.length > 0 && (
        <Card style={styles.card}>
          <Card.Title title="Spending Trend" />
          <Card.Content>
            <LineChart
              data={{
                labels: analytics.dailyTrend.slice(-7).map((d) => d.date.slice(-5)),
                datasets: [
                  {
                    data: analytics.dailyTrend.slice(-7).map((d) => d.amount),
                  },
                ],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: '#6200ee',
                backgroundGradientFrom: '#6200ee',
                backgroundGradientTo: '#9c27b0',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '30%',
  },
  summaryLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  summaryValue: {
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#f44336',
  },
  positiveText: {
    color: '#4CAF50',
  },
  negativeText: {
    color: '#f44336',
  },
  card: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryList: {
    marginTop: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
  },
  categoryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryAmount: {
    fontWeight: '600',
  },
  percentageChip: {
    height: 24,
  },
});
