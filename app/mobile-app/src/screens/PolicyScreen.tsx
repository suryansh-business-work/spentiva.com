import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PolicyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Title title="Privacy Policy & Terms" subtitle="Last updated: December 2025" />
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              1. Introduction
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              Welcome to Spentiva. We are committed to protecting your privacy and ensuring the
              security of your personal information. This policy outlines how we collect, use, and
              protect your data.
            </Text>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              2. Information We Collect
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              We collect information you provide directly to us, including your name, email
              address, and expense data. We also collect usage data and device information to
              improve our services.
            </Text>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              3. How We Use Your Information
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              Your information is used to provide and improve our services, process transactions,
              send notifications, and provide customer support. We use AI to analyze your expense
              patterns and provide insights.
            </Text>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              4. Data Security
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              We implement industry-standard security measures to protect your data. All sensitive
              data is encrypted both in transit and at rest. We regularly audit our security
              practices.
            </Text>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              5. Third-Party Services
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              We use third-party services for analytics, payment processing, and AI features. These
              services have their own privacy policies and we encourage you to review them.
            </Text>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              6. Your Rights
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              You have the right to access, update, or delete your personal information. You can
              also request a copy of your data or opt-out of certain data collection practices.
            </Text>

            <Text variant="titleMedium" style={styles.sectionTitle}>
              7. Contact Us
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              If you have any questions about this policy or our practices, please contact us at
              privacy@spentiva.com
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
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 22,
    opacity: 0.8,
  },
});
