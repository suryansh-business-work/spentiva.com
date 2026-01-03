import { useState, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { postRequest } from '../../../utils/http';
import { parseResponseMessage } from '../../../utils/response-parser';

interface VerificationState {
  loading: boolean;
  error: string;
  success: string;
  isDialogOpen: boolean;
}

export const useEmailVerification = (userEmail: string, onVerificationSuccess: () => void) => {
  const [state, setState] = useState<VerificationState>({
    loading: false,
    error: '',
    success: '',
    isDialogOpen: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  /**
   * Send verification OTP to email
   */
  const sendVerificationOtp = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: '', success: '' }));

    try {
      const response = await postRequest(endpoints.auth.sendVerificationOtp, { email: userEmail });
      const message = parseResponseMessage(response, 'Verification code sent to your email');

      setState(prev => ({ ...prev, loading: false, success: message }));
      setOtpSent(true);
      setCountdown(60); // 60 seconds countdown

      // Start countdown
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to send verification code';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false;
    }
  }, [userEmail]);

  /**
   * Verify email with OTP
   */
  const verifyEmail = useCallback(
    async (otp: string) => {
      setState(prev => ({ ...prev, loading: true, error: '', success: '' }));

      try {
        const response = await postRequest(endpoints.auth.verifyEmail, { email: userEmail, otp });
        const message = parseResponseMessage(response, 'Email verified successfully');

        setState(prev => ({ ...prev, loading: false, success: message, isDialogOpen: false }));
        setOtpSent(false);

        // Call success callback
        onVerificationSuccess();

        return true;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Invalid or expired OTP';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return false;
      }
    },
    [userEmail, onVerificationSuccess]
  );

  /**
   * Open verification dialog
   */
  const openDialog = useCallback(() => {
    setState(prev => ({ ...prev, isDialogOpen: true, error: '', success: '' }));
  }, []);

  /**
   * Close verification dialog
   */
  const closeDialog = useCallback(() => {
    setState(prev => ({ ...prev, isDialogOpen: false, error: '', success: '' }));
    setOtpSent(false);
    setCountdown(0);
  }, []);

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, error: '', success: '' }));
  }, []);

  return {
    ...state,
    otpSent,
    countdown,
    sendVerificationOtp,
    verifyEmail,
    openDialog,
    closeDialog,
    clearMessages,
  };
};
