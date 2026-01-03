import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Chip, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '3 Trackers',
      '100 Transactions',
      '1,000 API Calls/month',
      'Basic Support',
      'AI Chat Assistant',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    features: [
      '10 Trackers',
      '1,000 Transactions',
      '10,000 API Calls/month',
      'Priority Support',
      'Advanced Analytics',
      'Export Data',
      'AI Chat Assistant',
    ],
  },
  {
    id: 'businesspro',
    name: 'Business Pro',
    price: 29.99,
    features: [
      'Unlimited Trackers',
      'Unlimited Transactions',
      '100,000 API Calls/month',
      'Premium Support',
      'Advanced Analytics',
      'Export Data',
      'Team Features',
      'Custom Integrations',
      'AI Chat Assistant',
    ],
  },
];

export default function BillingScreen() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('plans');

  const renderPlans = () => (
    <View>
      {PLANS.map((plan) => {
        const isCurrentPlan = user?.accountType === plan.id;
        return (
          <Card key={plan.id} style={[styles.card, isCurrentPlan && styles.currentPlanCard]}>
            {isCurrentPlan && (
              <Chip icon="check-circle" style={styles.currentChip}>
                Current Plan
              </Chip>
            )}
            <Card.Content>
              <Text variant="headlineSmall" style={styles.planName}>
                {plan.name}
              </Text>
              <View style={styles.priceContainer}>
                <Text variant="displaySmall" style={styles.price}>
                  ${plan.price}
                </Text>
                <Text variant="bodyMedium" style={styles.pricePeriod}>
                  /month
                </Text>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Icon name="check" size={20} color="#4CAF50" />
                    <Text variant="bodyMedium" style={styles.featureText}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              {!isCurrentPlan && (
                <Button mode="contained" style={styles.upgradeButton}>
                  {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </Button>
              )}
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );

  const renderPayments = () => (
    <View style={styles.emptyContainer}>
      <Icon name="receipt" size={64} color="#ccc" />
      <Text variant="bodyLarge" style={styles.emptyText}>
        No payment history
      </Text>
    </View>
  );

  const renderRefunds = () => (
    <View style={styles.emptyContainer}>
      <Icon name="cash-refund" size={64} color="#ccc" />
      <Text variant="bodyLarge" style={styles.emptyText}>
        No refunds
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Billing & Plans
        </Text>
      </View>

      <SegmentedButtons
        value={selectedTab}
        onValueChange={setSelectedTab}
        buttons={[
          { value: 'plans', label: 'Plans' },
          { value: 'payments', label: 'Payments' },
          { value: 'refunds', label: 'Refunds' },
        ]}
        style={styles.tabs}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selectedTab === 'plans' && renderPlans()}
        {selectedTab === 'payments' && renderPayments()}
        {selectedTab === 'refunds' && renderRefunds()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  tabs: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    position: 'relative',
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  currentChip: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  planName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontWeight: 'bold',
  },
  pricePeriod: {
    marginLeft: 4,
    opacity: 0.6,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
  },
  upgradeButton: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    marginTop: 16,
    opacity: 0.6,
  },
});
