import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import { forgotPasswordValidationSchema } from '../utils/validation';
import { authService } from '../services/authService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' });

  const handleForgotPassword = async (values: { email: string }) => {
    setLoading(true);
    try {
      await authService.forgotPassword(values.email);
      setSnackbar({
        visible: true,
        message: 'Password reset email sent! Please check your inbox.',
        type: 'success',
      });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Failed to send reset email',
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
            Forgot Password
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordValidationSchema}
            onSubmit={handleForgotPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={touched.email && !!errors.email}
                  style={styles.input}
                />
                <HelperText type="error" visible={touched.email && !!errors.email}>
                  {errors.email}
                </HelperText>

                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                >
                  Send Reset Link
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
