import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { generateOTP, getOTPExpiry, OTPResponse } from '@/lib/otp';
import nodemailer from 'nodemailer';

/**
 * POST /api/auth/send-otp
 * Send OTP to user's email after successful password authentication
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, email, userName } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { success: false, message: 'User ID and email are required', error: 'MISSING_PARAMS' },
        { status: 400 }
      );
    }

    // Generate OTP code
    const otp = generateOTP();
    const expiresAt = getOTPExpiry();
    const sessionId = `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Delete any existing OTP records for this user (cleanup)
    const existingOTPQuery = query(collection(db, 'otps'), where('userId', '==', userId));
    const existingOTPs = await getDocs(existingOTPQuery);
    for (const doc of existingOTPs.docs) {
      await deleteDoc(doc.ref);
    }

    // Store OTP in Firestore
    await addDoc(collection(db, 'otps'), {
      userId,
      email,
      code: otp,
      createdAt: Date.now(),
      expiresAt,
      attempts: 0,
      verified: false,
      sessionId,
    });

    // Send OTP via email (if configured)
    // For development, we'll just log it to console
    if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@aryantechsolution.com',
          to: email,
          subject: 'Your Aryan Tech Solution Login OTP',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">Aryan Tech Solution - Login Verification</h2>
              <p>Hello ${userName || 'User'},</p>
              <p>Your One-Time Password (OTP) for login is:</p>
              <div style="background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                <h1 style="color: #1e40af; letter-spacing: 8px; margin: 0;">${otp}</h1>
              </div>
              <p style="color: #666;">This code will expire in 5 minutes.</p>
              <p style="color: #999; font-size: 12px;">
                If you didn't request this code, please ignore this email and your account will remain secure.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    console.log(`[DEV OTP] Email: ${email}, Code: ${otp} (expires in 5 minutes)`);

    const response: OTPResponse = {
      success: true,
      message: 'OTP sent successfully',
      sessionId,
      expiresIn: 300, // 5 minutes in seconds
    };

    // In development, include OTP for testing
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        ...response,
        devOTP: otp, // Only in development
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP', error: String(error) },
      { status: 500 }
    );
  }
}
