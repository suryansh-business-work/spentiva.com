import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message }) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {message && (
          <Text variant="bodyMedium" style={styles.text}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  content: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    elevation: 8,
  },
  text: {
    marginTop: 8,
  },
});
