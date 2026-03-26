import React, { useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { FormInput, AppButton } from '@/components';
import { useSnackbar } from '@/contexts';
import { http } from '@/utils/http';
import config from '@/config';
import type { AuthStackParamList } from '@/types/navigation';

const resetPasswordSchema = Yup.object().shape({
  token: Yup.string().required('Reset token is required'),
  password: Yup.string()
    .min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[a-z]/, 'Must contain lowercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

type ResetPasswordNav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type ResetPasswordRoute = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>['route'];

export const ResetPasswordScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<ResetPasswordNav>();
  const route = useRoute<ResetPasswordRoute>();
  const { showSnackbar } = useSnackbar();

  const tokenFromParam = route.params?.token || '';

  const handleSubmit = useCallback(
    async (values: { token: string; password: string; confirmPassword: string }) => {
      const result = await http.post(config.AUTH.RESET_PASSWORD, {
        token: values.token,
        password: values.password,
      });
      if (result.success) {
        showSnackbar('Password reset successful! Please sign in.', 'success');
        navigation.navigate('Login');
      } else {
        showSnackbar(result.message || 'Failed to reset password', 'error');
      }
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
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.title}>
                Reset Password
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Enter your reset token and new password
              </Text>
            </View>

            <Formik
              initialValues={{ token: tokenFromParam, password: '', confirmPassword: '' }}
              validationSchema={resetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit: submit, values, errors, touched, isSubmitting }) => (
                <View style={styles.form}>
                  <FormInput
                    label="Reset Token"
                    value={values.token}
                    onChangeText={handleChange('token')}
                    onBlur={handleBlur('token')}
                    error={errors.token}
                    touched={touched.token}
                    autoCapitalize="none"
                  />
                  <FormInput
                    label="New Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={errors.password}
                    touched={touched.password}
                    secureTextEntry
                  />
                  <FormInput
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    secureTextEntry
                  />
                  <AppButton
                    title="Reset Password"
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  header: { marginBottom: 24, gap: 8 },
  title: { fontFamily: 'Inter-Bold' },
  form: { gap: 12 },
  link: { textAlign: 'center', marginTop: 12 },
});
