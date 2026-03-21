import React, { useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { FormInput, AppButton } from '@/components';
import { useAuthStore } from '@/contexts';
import { useSnackbar } from '@/contexts';
import { http } from '@/utils/http';
import config from '@/config';
import type { AuthStackParamList } from '@/types/navigation';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

interface LoginValues {
  email: string;
  password: string;
}

type LoginNav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<LoginNav>();
  const login = useAuthStore((s) => s.login);
  const { showSnackbar } = useSnackbar();

  const handleLogin = useCallback(
    async (values: LoginValues) => {
      const result = await http.post<{ token: string }>(
        config.AUTH.LOGIN,
        values,
      );
      if (result.success && result.data?.token) {
        await login(result.data.token);
      } else {
        showSnackbar(result.message || 'Login failed', 'error');
      }
    },
    [login, showSnackbar]
  );

  return (
    <LinearGradient
      colors={[theme.colors.primaryContainer, theme.colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome Back
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Sign in to Spentiva
            </Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <FormInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <FormInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={errors.password}
                  touched={touched.password}
                  secureTextEntry
                />
                <AppButton
                  title="Sign In"
                  mode="contained"
                  onPress={() => handleSubmit()}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  fullWidth
                />
                <View style={styles.links}>
                  <Text
                    variant="labelLarge"
                    style={{ color: theme.colors.primary }}
                    onPress={() => navigation.navigate('ForgotPassword')}
                  >
                    Forgot Password?
                  </Text>
                  <Text
                    variant="labelLarge"
                    style={{ color: theme.colors.primary }}
                    onPress={() => navigation.navigate('Register')}
                  >
                    Create Account
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { marginBottom: 32, gap: 8 },
  title: { fontFamily: 'Inter-Bold' },
  form: { gap: 12 },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
