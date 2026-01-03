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
import authService from '../services/authService';
import { ApiError } from '../config/response-parser';

interface SignupScreenProps {
  navigation: any;
}

// Validation Schema
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSignup = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setErrorMessage('');
      const response = await authService.signup(values);

      // Navigate to Tracker on successful signup
      if (response.data?.token) {
        navigation.replace('Tracker');
      }
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(
        apiError.message || 'Signup failed. Please try again.'
      );
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
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
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
                Create an account
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Start managing your expenses today.
              </Text>

              <View style={styles.inputContainer}>
                <Text variant="labelLarge" style={styles.label}>
                  Full Name
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="Enter your full name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  autoCapitalize="words"
                  autoComplete="name"
                  left={<TextInput.Icon icon="account-outline" />}
                  error={touched.name && !!errors.name}
                  style={styles.input}
                />
                {touched.name && errors.name && (
                  <HelperText type="error" visible={true}>
                    {errors.name}
                  </HelperText>
                )}
              </View>

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
                  placeholder="Create a password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoComplete="password-new"
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

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.signupButton}
                contentStyle={{ flexDirection: 'row-reverse', paddingVertical: 8 }}
                icon="arrow-right"
              >
                Create account
              </Button>

              <View style={styles.loginContainer}>
                <Text variant="bodyMedium" style={styles.loginText}>
                  Already have an account?{' '}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Login')}
                >
                  Sign in
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
  signupButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: palette.text.secondary,
  },
  loginLink: {
    color: palette.primary,
    fontWeight: '600',
  },
});
