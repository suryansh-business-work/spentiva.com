import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  actions,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: theme.colors.surface }}>
      <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        {onBack && <Appbar.BackAction onPress={onBack} />}
        <Appbar.Content title={title} titleStyle={styles.title} />
        {actions}
      </Appbar.Header>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
});
