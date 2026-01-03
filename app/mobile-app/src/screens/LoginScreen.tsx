import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput, Button, Text, HelperText, Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { palette } from '../theme/palette';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../config/response-parser';

interface LoginScreenProps {
  navigation: any;
}

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setErrorMessage('');
      await login(values.email, values.password);
      // Navigation will happen automatically when user state changes
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(apiError.message || 'Login failed. Please try again.');
      setShowError(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <View style={styles.formContainer}>
              <Text variant="headlineMedium" style={styles.title}>
                Welcome back
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Please enter your details to sign in.
              </Text>

              <View style={styles.inputContainer}>
                <Text variant="labelLarge" style={styles.label}>
                  Email
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  left={<TextInput.Icon icon="email-outline" />}
                  error={touched.email && !!errors.email}
                  style={styles.input}
                />
                {touched.email && errors.email && (
                  <HelperText type="error" visible={true}>
                    {errors.email}
                  </HelperText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text variant="labelLarge" style={styles.label}>
                  Password
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="Enter your password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoComplete="password"
                  left={<TextInput.Icon icon="lock-outline" />}
                  right={
                    <TextInput.Icon
                      icon={passwordVisible ? 'eye-off' : 'eye'}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                  error={touched.password && !!errors.password}
                  style={styles.input}
                />
                {touched.password && errors.password && (
                  <HelperText type="error" visible={true}>
                    {errors.password}
                  </HelperText>
                )}
              </View>

              <View style={styles.forgotPasswordContainer}>
                <Text
                  variant="bodyMedium"
                  style={styles.forgotPasswordText}
                  onPress={() => console.log('Forgot password')}
                >
                  Forgot password?
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.signInButton}
                contentStyle={styles.buttonContent}
              >
                Sign in
              </Button>

              <View style={styles.signupContainer}>
                <Text variant="bodyMedium" style={styles.signupText}>
                  Don't have an account?{' '}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={styles.signupLink}
                  onPress={() => navigation.navigate('Signup')}
                >
                  Sign up for free
                </Text>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={4000}
        action={{
          label: 'Close',
          onPress: () => setShowError(false),
        }}
      >
        {errorMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 60,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    color: palette.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: palette.text.secondary,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: palette.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: palette.inputBackground,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: palette.primary,
  },
  signInButton: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: palette.text.secondary,
  },
  signupLink: {
    color: palette.primary,
    fontWeight: '600',
  },
});
