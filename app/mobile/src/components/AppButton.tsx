import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import type { ButtonProps } from 'react-native-paper';

interface AppButtonProps extends Omit<ButtonProps, 'children'> {
  title: string;
  fullWidth?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  fullWidth = false,
  style,
  ...props
}) => {
  return (
    <PaperButton
      style={[styles.button, fullWidth && styles.fullWidth, style]}
      contentStyle={styles.content}
      labelStyle={styles.label}
      {...props}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    paddingVertical: 6,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});
