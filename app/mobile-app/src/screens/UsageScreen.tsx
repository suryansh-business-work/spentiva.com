import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, ProgressBar, ActivityIndicator, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { formatDate, formatNumber } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import { PLAN_LIMITS } from '../utils/constants';

interface UsageData {
  apiCalls: {
    used: number;
    limit: number;
  };
  trackers: {
    used: number;
    limit: number;
  };
  transactions: {
    used: number;
    limit: number;
  };
  resetDate: string;
}

export default function UsageScreen() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usage');
      setUsage(response.data);
    } catch (error) {
      console.error('Error loading usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return used / limit;
  };

  const getUsageColor = (used: number, limit: number) => {
    if (limit === -1) return '#4CAF50';
    const progress = used / limit;
    if (progress >= 0.9) return '#f44336';
    if (progress >= 0.7) return '#ff9800';
    return '#4CAF50';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const accountType = user?.accountType || 'free';
  const limits = PLAN_LIMITS[accountType];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Usage Statistics
          </Text>
          <Chip icon="account" style={styles.accountChip}>
            {accountType.toUpperCase()} Plan
          </Chip>
        </View>

        <Card style={styles.card}>
          <Card.Title title="API Calls" />
          <Card.Content>
            <View style={styles.usageRow}>
              <Text variant="titleMedium">
                {formatNumber(usage?.apiCalls.used || 0)} /{' '}
                {limits.apiCalls === -1 ? 'Unlimited' : formatNumber(limits.apiCalls)}
              </Text>
            </View>
            <ProgressBar
              progress={getProgress(usage?.apiCalls.used || 0, limits.apiCalls)}
              color={getUsageColor(usage?.apiCalls.used || 0, limits.apiCalls)}
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.helperText}>
              Resets on {usage?.resetDate ? formatDate(usage.resetDate) : 'N/A'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Trackers" />
          <Card.Content>
            <View style={styles.usageRow}>
              <Text variant="titleMedium">
                {usage?.trackers.used || 0} /{' '}
                {limits.trackers === -1 ? 'Unlimited' : limits.trackers}
              </Text>
            </View>
            <ProgressBar
              progress={getProgress(usage?.trackers.used || 0, limits.trackers)}
              color={getUsageColor(usage?.trackers.used || 0, limits.trackers)}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Transactions" />
          <Card.Content>
            <View style={styles.usageRow}>
              <Text variant="titleMedium">
                {formatNumber(usage?.transactions.used || 0)} /{' '}
                {limits.transactions === -1 ? 'Unlimited' : formatNumber(limits.transactions)}
              </Text>
            </View>
            <ProgressBar
              progress={getProgress(usage?.transactions.used || 0, limits.transactions)}
              color={getUsageColor(usage?.transactions.used || 0, limits.transactions)}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        {accountType === 'free' && (
          <Card style={styles.upgradeCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.upgradeTitle}>
                Need More?
              </Text>
              <Text variant="bodyMedium" style={styles.upgradeText}>
                Upgrade to Pro or Business Pro for increased limits and unlimited features!
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
  },
  accountChip: {
    marginLeft: 8,
  },
  card: {
    marginBottom: 16,
  },
  usageRow: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  helperText: {
    marginTop: 8,
    opacity: 0.6,
  },
  upgradeCard: {
    backgroundColor: '#e3f2fd',
    marginTop: 8,
  },
  upgradeTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  upgradeText: {
    opacity: 0.8,
  },
});
