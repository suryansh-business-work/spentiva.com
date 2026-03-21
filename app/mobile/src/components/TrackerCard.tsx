import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/colors';
import type { Tracker } from '@/types';

interface TrackerCardProps {
  tracker: Tracker;
  onPress: (tracker: Tracker) => void;
}

export const TrackerCard: React.FC<TrackerCardProps> = React.memo(
  ({ tracker, onPress }) => {
    const theme = useTheme();
    const isBusiness = tracker.type === 'business';

    const gradientColors = isBusiness
      ? [colors.tracker.businessLight, '#FFFFFF']
      : [colors.tracker.personalLight, '#FFFFFF'];

    const typeColor = isBusiness
      ? colors.tracker.business
      : colors.tracker.personal;

    return (
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        onPress={() => onPress(tracker)}
        mode="elevated"
      >
        <LinearGradient
          colors={gradientColors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Card.Content style={styles.content}>
            <Text variant="titleMedium" style={styles.name}>
              {tracker.name}
            </Text>
            <Text
              variant="labelSmall"
              style={[styles.type, { color: typeColor }]}
            >
              {tracker.type.toUpperCase()}
            </Text>
            {tracker.description && (
              <Text
                variant="bodySmall"
                numberOfLines={2}
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {tracker.description}
              </Text>
            )}
            <Text variant="labelSmall" style={styles.currency}>
              {tracker.currency}
            </Text>
          </Card.Content>
        </LinearGradient>
      </Card>
    );
  }
);

TrackerCard.displayName = 'TrackerCard';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 16,
  },
  content: {
    padding: 16,
    gap: 6,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
  },
  type: {
    fontFamily: 'Inter-Medium',
  },
  currency: {
    marginTop: 4,
    opacity: 0.7,
  },
});
