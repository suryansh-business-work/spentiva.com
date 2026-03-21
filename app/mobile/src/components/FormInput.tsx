import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import type { TextInputProps } from 'react-native-paper';

interface FormInputProps extends Omit<TextInputProps, 'error'> {
  error?: string;
  touched?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  error,
  touched,
  style,
  ...props
}) => {
  const theme = useTheme();
  const hasError = touched && !!error;

  return (
    <>
      <TextInput
        mode="outlined"
        error={hasError}
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        style={[styles.input, style]}
        outlineStyle={styles.outline}
        {...props}
      />
      {hasError && (
        <HelperText type="error" visible={hasError}>
          {error}
        </HelperText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 4,
  },
  outline: {
    borderRadius: 12,
  },
});
