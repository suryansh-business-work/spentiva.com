import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface StatCardProps {
  icon: IconName;
  label: string;
  value: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = React.memo(
  ({ icon, label, value, color }) => {
    const theme = useTheme();
    const iconColor = color ?? theme.colors.primary;

    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
        <Card.Content style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
            <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
          </View>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {label}
          </Text>
          <Text variant="titleMedium" style={styles.value}>
            {value}
          </Text>
        </Card.Content>
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
  },
  content: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Inter-SemiBold',
  },
});
