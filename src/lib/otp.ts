// OTP utility functions for Two-Factor Authentication

/**
 * Generate a random 6-digit OTP code
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate OTP expiration timestamp (5 minutes from now)
 */
export const getOTPExpiry = (): number => {
  return Date.now() + 5 * 60 * 1000; // 5 minutes
};

/**
 * Check if OTP has expired
 */
export const isOTPExpired = (expiryTime: number): boolean => {
  return Date.now() > expiryTime;
};

/**
 * Validate OTP format
 */
export const isValidOTPFormat = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * OTP data structure stored in Firestore
 */
export interface OTPData {
  userId: string;
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  sessionId?: string;
}

/**
 * OTP Response structure
 */
export interface OTPResponse {
  success: boolean;
  message: string;
  sessionId?: string;
  expiresIn?: number; // seconds
  error?: string;
}
