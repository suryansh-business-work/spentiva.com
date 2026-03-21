import { Alert, Platform, ToastAndroid } from 'react-native';

type ErrorSeverity = 'info' | 'warning' | 'error';

/**
 * Show user-facing error feedback.
 * Uses Toast on Android, Alert on iOS.
 */
export const showError = (message: string, _severity: ErrorSeverity = 'error'): void => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Alert.alert('Error', message);
  }
};

/**
 * Show a success message.
 */
export const showSuccess = (message: string): void => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('Success', message);
  }
};

/**
 * Extract a user-friendly error message from various error shapes.
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unexpected error occurred';
};
