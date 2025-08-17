// hooks/usePhoneAuth.ts
import { useState } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  AuthError
} from 'firebase/auth';
import { auth } from '../firebase';

interface OTPResult {
  success: boolean;
  message?: string;
  error?: string;
  user?: any; // You can use Firebase's User type if needed
}

export const usePhoneAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Setup reCAPTCHA
  const setupRecaptcha = (): RecaptchaVerifier | null => {
    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: (_response: unknown) => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
            }
          }
        );
      }
      return (window as any).recaptchaVerifier;
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
      setError('Failed to setup reCAPTCHA');
      return null;
    }
  };

  // Send OTP
  const sendOTP = async (phoneNumber: string): Promise<OTPResult> => {
    setLoading(true);
    setError(null);

    try {
      // Format phone number (ensure it starts with country code)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const recaptcha = setupRecaptcha();
      if (!recaptcha) {
        throw new Error('reCAPTCHA setup failed');
      }

      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
      setConfirmationResult(result);
      setVerificationId(result.verificationId);
      
      console.log('OTP sent successfully');
      return { success: true, message: 'OTP sent successfully' };
    } catch (err) {
      const errorMsg = (err as AuthError).message || 'Failed to send OTP';
      console.error('Error sending OTP:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (otpCode: string): Promise<OTPResult> => {
    setLoading(true);
    setError(null);

    try {
      if (!confirmationResult) {
        throw new Error('No confirmation result found. Please request OTP first.');
      }

      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;
      
      console.log('Phone number verified successfully:', user);
      return { success: true, user, message: 'Phone number verified successfully' };
    } catch (err) {
      const errorMsg = (err as AuthError).message || 'Failed to verify OTP';
      console.error('Error verifying OTP:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async (phoneNumber: string): Promise<OTPResult> => {
    // Clear previous reCAPTCHA
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
      (window as any).recaptchaVerifier = null;
    }
    
    return await sendOTP(phoneNumber);
  };

  return {
    loading,
    error,
    verificationId,
    sendOTP,
    verifyOTP,
    resendOTP,
    setError
  };
};
