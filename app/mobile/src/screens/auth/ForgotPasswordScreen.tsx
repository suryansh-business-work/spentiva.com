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
import { useSnackbar } from '@/contexts';
import { http } from '@/utils/http';
import config from '@/config';
import type { AuthStackParamList } from '@/types/navigation';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

type ForgotNav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ForgotNav>();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = useCallback(
    async (values: { email: string }) => {
      await http.post(config.AUTH.FORGOT_PASSWORD, { email: values.email });
      showSnackbar('If an account exists, a reset link has been sent.', 'success');
      navigation.navigate('Login');
    },
    [showSnackbar, navigation]
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
              Reset Password
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Enter your email to receive a reset link
            </Text>
          </View>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit: submit, values, errors, touched, isSubmitting }) => (
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
                <AppButton
                  title="Send Reset Link"
                  mode="contained"
                  onPress={() => submit()}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  fullWidth
                />
                <Text
                  variant="labelLarge"
                  style={[styles.link, { color: theme.colors.primary }]}
                  onPress={() => navigation.navigate('Login')}
                >
                  Back to Sign In
                </Text>
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
  link: { textAlign: 'center', marginTop: 12 },
});
