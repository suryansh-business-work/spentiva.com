import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Banner } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function VerificationBanner() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(true);
  const [sending, setSending] = useState(false);

  if (!user || user.emailVerified || !visible) {
    return null;
  }

  const handleResendVerification = async () => {
    try {
      setSending(true);
      await api.post('/auth/resend-verification');
      // Show success message (could use Snackbar)
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification:', error);
      alert('Failed to send verification email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: 'Dismiss',
          onPress: () => setVisible(false),
        },
        {
          label: sending ? 'Sending...' : 'Resend Email',
          onPress: handleResendVerification,
          disabled: sending,
        },
      ]}
      icon="alert-circle"
      style={styles.banner}
    >
      Please verify your email address. Check your inbox for the verification link.
    </Banner>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff3cd',
  },
});
