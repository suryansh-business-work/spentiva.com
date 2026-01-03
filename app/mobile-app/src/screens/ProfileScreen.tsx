import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Text,
  TextInput,
  Snackbar,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { formatDate } from '../utils/formatters';
import { Formik } from 'formik';
import { profileValidationSchema } from '../utils/validation';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const handleUpdateProfile = async (values: { name: string; email: string }) => {
    setLoading(true);
    try {
      const response = await api.put('/auth/profile', values);
      updateUser(response.data);
      setSnackbar({ visible: true, message: 'Profile updated successfully!' });
    } catch (error: any) {
      setSnackbar({ visible: true, message: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Avatar.Text size={80} label={user.name.charAt(0).toUpperCase()} />
          <Text variant="headlineMedium" style={styles.name}>
            {user.name}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user.email}
          </Text>
          <Text variant="bodySmall" style={styles.accountType}>
            {user.accountType.toUpperCase()} Account
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Personal Information" />
          <Card.Content>
            <Formik
              initialValues={{
                name: user.name,
                email: user.email,
              }}
              validationSchema={profileValidationSchema}
              onSubmit={handleUpdateProfile}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <TextInput
                    label="Name"
                    mode="outlined"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={touched.name && !!errors.name}
                    style={styles.input}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}

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
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <Button
                    mode="contained"
                    onPress={() => handleSubmit()}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                  >
                    Update Profile
                  </Button>
                </View>
              )}
            </Formik>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Account Details" />
          <Card.Content>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Member Since
              </Text>
              <Text variant="bodyMedium">
                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Email Verified
              </Text>
              <Text variant="bodyMedium">{user.emailVerified ? 'Yes' : 'No'}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Role
              </Text>
              <Text variant="bodyMedium">{user.role}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Security" />
          <Card.Content>
            <Button mode="outlined" style={styles.securityButton}>
              Change Password
            </Button>
            <Button
              mode="outlined"
              textColor="#d32f2f"
              style={styles.securityButton}
              onPress={handleLogout}
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  email: {
    marginTop: 4,
    opacity: 0.7,
  },
  accountType: {
    marginTop: 8,
    opacity: 0.6,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontWeight: '600',
  },
  divider: {
    marginVertical: 4,
  },
  securityButton: {
    marginBottom: 8,
  },
});
