import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <View key={item.label} style={styles.item}>
            {item.onPress && !isLast ? (
              <TouchableRipple onPress={item.onPress}>
                <Text
                  variant="labelMedium"
                  style={{ color: theme.colors.primary }}
                >
                  {item.label}
                </Text>
              </TouchableRipple>
            ) : (
              <Text
                variant="labelMedium"
                style={{
                  color: isLast
                    ? theme.colors.onSurface
                    : theme.colors.onSurfaceVariant,
                  fontFamily: isLast ? 'Inter-SemiBold' : 'Inter-Regular',
                }}
              >
                {item.label}
              </Text>
            )}
            {!isLast && (
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color={theme.colors.onSurfaceVariant}
                style={styles.separator}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginHorizontal: 4,
  },
});
