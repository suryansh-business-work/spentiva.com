import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import { resetPasswordValidationSchema } from '../utils/validation';
import { authService } from '../services/authService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ route, navigation }: Props) {
  const { token } = route.params;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' });

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, values.password);
      setSnackbar({
        visible: true,
        message: 'Password reset successful! Redirecting to login...',
        type: 'success',
      });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Failed to reset password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Reset Password
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Enter your new password below.
          </Text>

          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={handleResetPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <TextInput
                  label="New Password"
                  mode="outlined"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  error={touched.password && !!errors.password}
                  style={styles.input}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                <HelperText type="error" visible={touched.password && !!errors.password}>
                  {errors.password}
                </HelperText>

                <TextInput
                  label="Confirm Password"
                  mode="outlined"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  style={styles.input}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />
                <HelperText
                  type="error"
                  visible={touched.confirmPassword && !!errors.confirmPassword}
                >
                  {errors.confirmPassword}
                </HelperText>

                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                >
                  Reset Password
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Login')}
                  disabled={loading}
                  style={styles.linkButton}
                >
                  Back to Login
                </Button>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbar({ ...snackbar, visible: false }),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 32,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  linkButton: {
    marginTop: 8,
  },
});
