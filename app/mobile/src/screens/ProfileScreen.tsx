import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Avatar, List, Divider, useTheme, Dialog, Portal, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ScreenHeader, Breadcrumb, FormInput, AppButton } from '@/components';
import { useAuthStore, useSnackbar } from '@/contexts';
import { http } from '@/utils/http';
import config from '@/config';
import type { User } from '@/types';

const profileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
});

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);
  const { showSnackbar } = useSnackbar();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const initials = user
    ? `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`
    : '?';

  const handleSave = useCallback(
    async (values: { firstName: string; lastName: string }) => {
      try {
        const res = await http.put<{ user: User }>(config.AUTH.PROFILE, values);
        if (res.success && res.data) {
          updateUser(values);
          showSnackbar('Profile updated successfully', 'success');
        } else {
          showSnackbar(res.message || 'Failed to update profile', 'error');
        }
      } catch {
        showSnackbar('Failed to update profile', 'error');
      }
    },
    [updateUser, showSnackbar]
  );

  const handleLogout = useCallback(async () => {
    setShowLogoutDialog(false);
    await logout();
  }, [logout]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScreenHeader title="Profile" onBack={() => navigation.goBack()} />
      <Breadcrumb items={[{ label: 'More', onPress: () => navigation.goBack() }, { label: 'Profile' }]} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.avatarSection, { backgroundColor: theme.colors.surface }]}>
          <Avatar.Text size={72} label={initials} />
          <Text variant="titleMedium" style={styles.name}>
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {user?.email}
          </Text>
        </View>

        <Formik
          initialValues={{
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
          }}
          validationSchema={profileSchema}
          onSubmit={handleSave}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <FormInput
                label="First Name"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                error={errors.firstName}
                touched={touched.firstName}
              />
              <FormInput
                label="Last Name"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                error={errors.lastName}
                touched={touched.lastName}
              />
              <AppButton
                title="Save Changes"
                mode="contained"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                disabled={isSubmitting}
                fullWidth
              />
            </View>
          )}
        </Formik>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Item
            title="Account Status"
            description={user?.isVerified ? 'Verified' : 'Not Verified'}
            left={(props) => <List.Icon {...props} icon="check-circle-outline" />}
          />
          <List.Item
            title="Two-Factor Auth"
            description={user?.mfaEnabled ? 'Enabled' : 'Disabled'}
            left={(props) => <List.Icon {...props} icon="shield-lock-outline" />}
          />
        </List.Section>

        <AppButton
          title="Logout"
          mode="outlined"
          onPress={() => setShowLogoutDialog(true)}
          fullWidth
        />

        <Portal>
          <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
            <Dialog.Title>Logout</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Are you sure you want to logout?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
              <Button onPress={handleLogout}>Logout</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  avatarSection: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    gap: 8,
  },
  name: { fontFamily: 'Inter-SemiBold' },
  form: { gap: 12, marginBottom: 16 },
  divider: { marginVertical: 16 },
});
