import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { isOTPExpired, isValidOTPFormat, OTPResponse } from '@/lib/otp';

/**
 * POST /api/auth/verify-otp
 * Verify OTP code submitted by user
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, otp, sessionId } = await request.json();

    if (!userId || !otp || !sessionId) {
      return NextResponse.json(
        { success: false, message: 'User ID, OTP, and Session ID are required', error: 'MISSING_PARAMS' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!isValidOTPFormat(otp)) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP format. Must be 6 digits.', error: 'INVALID_FORMAT' },
        { status: 400 }
      );
    }

    // Find OTP record
    const otpQuery = query(
      collection(db, 'otps'),
      where('userId', '==', userId),
      where('sessionId', '==', sessionId)
    );
    const otpSnapshots = await getDocs(otpQuery);

    if (otpSnapshots.empty) {
      return NextResponse.json(
        { success: false, message: 'OTP session not found or expired', error: 'SESSION_NOT_FOUND' },
        { status: 404 }
      );
    }

    const otpDoc = otpSnapshots.docs[0];
    const otpData = otpDoc.data();

    // Check if already verified
    if (otpData.verified) {
      return NextResponse.json(
        { success: false, message: 'OTP already used. Please request a new one.', error: 'ALREADY_VERIFIED' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (isOTPExpired(otpData.expiresAt)) {
      await deleteDoc(otpDoc.ref);
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.', error: 'OTP_EXPIRED' },
        { status: 400 }
      );
    }

    // Check attempts limit (max 5 attempts)
    if ((otpData.attempts || 0) >= 5) {
      await deleteDoc(otpDoc.ref);
      return NextResponse.json(
        { success: false, message: 'Maximum OTP attempts exceeded. Please request a new one.', error: 'MAX_ATTEMPTS' },
        { status: 400 }
      );
    }

    // Check if OTP code matches
    if (otpData.code !== otp) {
      // Increment attempt count
      await updateDoc(otpDoc.ref, {
        attempts: otpData.attempts + 1,
      });

      const remainingAttempts = 5 - (otpData.attempts + 1);
      return NextResponse.json(
        {
          success: false,
          message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
          error: 'INVALID_OTP',
        },
        { status: 400 }
      );
    }

    // OTP verified successfully
    await updateDoc(otpDoc.ref, {
      verified: true,
      verifiedAt: Date.now(),
    });

    const response: OTPResponse = {
      success: true,
      message: 'OTP verified successfully',
      sessionId,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP', error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/verify-otp
 * Clean up OTP session (optional - called after successful login)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId, userId } = await request.json();

    if (!sessionId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Session ID and User ID are required', error: 'MISSING_PARAMS' },
        { status: 400 }
      );
    }

    const otpQuery = query(
      collection(db, 'otps'),
      where('userId', '==', userId),
      where('sessionId', '==', sessionId)
    );
    const otpSnapshots = await getDocs(otpQuery);

    for (const doc of otpSnapshots.docs) {
      await deleteDoc(doc.ref);
    }

    return NextResponse.json({ success: true, message: 'OTP session cleaned up' });
  } catch (error) {
    console.error('OTP cleanup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cleanup OTP', error: String(error) },
      { status: 500 }
    );
  }
}
