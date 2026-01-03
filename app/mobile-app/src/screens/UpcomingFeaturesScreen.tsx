import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UPCOMING_FEATURES = [
  {
    id: 1,
    title: 'Multi-Currency Support',
    description: 'Track expenses in multiple currencies with automatic conversion',
    status: 'In Progress',
    eta: 'Q1 2026',
    icon: 'currency-usd',
  },
  {
    id: 2,
    title: 'Receipt Scanning',
    description: 'Scan receipts with your camera and auto-extract expense details',
    status: 'Planned',
    eta: 'Q2 2026',
    icon: 'camera',
  },
  {
    id: 3,
    title: 'Budget Alerts',
    description: 'Get notifications when you are approaching your budget limits',
    status: 'In Progress',
    eta: 'Q1 2026',
    icon: 'bell-alert',
  },
  {
    id: 4,
    title: 'Shared Trackers',
    description: 'Collaborate with family or team members on expense tracking',
    status: 'Planned',
    eta: 'Q2 2026',
    icon: 'account-group',
  },
  {
    id: 5,
    title: 'Bank Integration',
    description: 'Connect your bank accounts for automatic transaction imports',
    status: 'Future',
    eta: 'Q3 2026',
    icon: 'bank',
  },
  {
    id: 6,
    title: 'Custom Categories',
    description: 'Create unlimited custom categories with icons and colors',
    status: 'In Progress',
    eta: 'Q1 2026',
    icon: 'tag-multiple',
  },
  {
    id: 7,
    title: 'Advanced Reports',
    description: 'Generate detailed PDF reports with charts and insights',
    status: 'Planned',
    eta: 'Q2 2026',
    icon: 'file-chart',
  },
  {
    id: 8,
    title: 'Recurring Expenses',
    description: 'Set up automatic recurring expense entries',
    status: 'Planned',
    eta: 'Q2 2026',
    icon: 'repeat',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Progress':
      return '#2196F3';
    case 'Planned':
      return '#FF9800';
    case 'Future':
      return '#9E9E9E';
    default:
      return '#4CAF50';
  }
};

export default function UpcomingFeaturesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Upcoming Features
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Exciting new features we're working on to make Spentiva even better
          </Text>
        </View>

        {UPCOMING_FEATURES.map((feature) => (
          <Card key={feature.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Icon name={feature.icon} size={32} color="#6200ee" />
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(feature.status) }]}
                  textStyle={{ color: 'white' }}
                >
                  {feature.status}
                </Chip>
              </View>
              <Text variant="titleLarge" style={styles.featureTitle}>
                {feature.title}
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {feature.description}
              </Text>
              <Text variant="bodySmall" style={styles.eta}>
                Expected: {feature.eta}
              </Text>
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              Have a feature request?
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              We'd love to hear your ideas! Contact us at feedback@spentiva.com with your
              suggestions.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusChip: {
    height: 28,
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
    opacity: 0.8,
    lineHeight: 20,
  },
  eta: {
    opacity: 0.6,
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    marginTop: 8,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    opacity: 0.8,
  },
});
