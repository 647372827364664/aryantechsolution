'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, ArrowRight, Chrome, MessageCircle, Shield, Zap, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase';
import { signInSchema, SignInFormData } from '@/lib/validations';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpSessionId, setOtpSessionId] = useState('');
  const [userId, setUserId] = useState('');
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const router = useRouter();
  const { isFirebaseConfigured, user, loading } = useAuth();

  // OTP Timer countdown
  useEffect(() => {
    if (!showOTPForm) return;
    
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowOTPForm(false);
          setErrorMessage('OTP expired. Please login again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showOTPForm]);

  // Handle role-based redirection after successful authentication
  const handleSuccessfulLogin = (userRole?: string) => {
    const role = userRole || 'client';
    
    setSuccessMessage('Login successful! Redirecting...');
    
    setTimeout(() => {
      switch (role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'developer':
          router.push('/developer');
          break;
        case 'client':
        default:
          router.push('/dashboard');
          break;
      }
    }, 1000);
  };

  // Monitor authentication state changes for automatic redirection
  useEffect(() => {
    if (user) {
      setSuccessMessage(`Welcome back, ${user.name}!`);
      handleSuccessfulLogin(user.role);
    }
  }, [user, router]);

  useEffect(() => {
    // If user is already logged in, redirect based on role
    if (user && !loading) {
      const role = user.role || 'client';
      switch (role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'developer':
          router.push('/developer');
          break;
        case 'client':
        default:
          router.push('/dashboard');
          break;
      }
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    if (!isFirebaseConfigured) {
      setErrorMessage('Firebase not configured. Please set up your Firebase environment variables.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Check if input is email or phone
      const isEmail = data.emailOrPhone.includes('@');
      
      if (!isEmail) {
        setErrorMessage('Phone number login coming soon! Please use email for now.');
        return;
      }

      // Step 1: Authenticate with email and password
      const userCredential = await signInWithEmail(data.emailOrPhone, data.password);
      const userId = userCredential.user.uid;
      
      setUserId(userId);
      
      // Step 2: Send OTP to user
      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: data.emailOrPhone,
          userName: userCredential.user.displayName || 'User',
        }),
      });

      const otpData = await otpResponse.json();

      if (!otpData.success) {
        setErrorMessage(otpData.message || 'Failed to send OTP');
        return;
      }

      setOtpSessionId(otpData.sessionId);
      setShowOTPForm(true);
      setOtpTimer(300);
      setSuccessMessage('OTP sent to your email! Please enter it below.');
      toast.success('OTP sent to your email!');

      // Show dev OTP if available
      if (otpData.devOTP) {
        console.log('🔐 Development OTP:', otpData.devOTP);
        toast.success(`Dev OTP: ${otpData.devOTP}`);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Firebase not configured')) {
        setErrorMessage('Authentication service not configured. Please contact support.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address.');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }

    if (!userId || !otpSessionId) {
      setErrorMessage('OTP session expired. Please login again.');
      return;
    }

    setIsVerifyingOTP(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          otp: otpCode,
          sessionId: otpSessionId,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        setErrorMessage(verifyData.message || 'Invalid OTP');
        setOtpCode('');
        return;
      }

      // OTP verified - complete login
      setSuccessMessage('OTP verified! Logging you in...');
      toast.success('Login successful!');
      
      // Clean up OTP session
      await fetch('/api/auth/verify-otp', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, sessionId: otpSessionId }),
      });

      // Redirect will be handled by useEffect monitoring user state
      setTimeout(() => {
        handleSuccessfulLogin();
      }, 1500);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setErrorMessage('OTP verification failed. Please try again.');
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      setErrorMessage('Firebase not configured. Please set up your Firebase environment variables.');
      return;
    }
    
    setIsGoogleLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await signInWithGoogle();
      // Note: Redirection will be handled by useEffect monitoring user state
      setSuccessMessage('Google login successful! Redirecting...');
    } catch (error: any) {
      console.error('Google login error:', error);
      if (error.message.includes('Firebase not configured')) {
        setErrorMessage('Authentication service not configured. Please contact support.');
      } else {
        setErrorMessage('Google login failed. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    // No notification for Discord - just a simple placeholder
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Welcome Content */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold shadow-lg">
              <Shield className="h-5 w-5 mr-2" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Secure & Fast Authentication
              </span>
            </div>
            
            <h1 className="text-5xl font-black text-gray-900">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Aryan Tech Solution
              </span>
            </h1>
            
            <p className="text-xl text-gray-800 leading-relaxed">
              Access your dashboard, manage your hosting services, and connect with our community. 
              Sign in to continue your journey with us.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instant Access</h3>
                <p className="text-gray-800 text-sm">Get immediate access to all your services</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Platform</h3>
                <p className="text-gray-800 text-sm">Your data is protected with enterprise-grade security</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Community Support</h3>
                <p className="text-gray-800 text-sm">Connect with 500+ developers in our Discord</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sign In
              </CardTitle>
              <CardDescription className="text-gray-600">
                Welcome back! Please sign in to your account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  variant="outline"
                  className="w-full relative group border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  <Chrome className="h-5 w-5 mr-3 text-blue-600" />
                  <span className="font-semibold">
                    {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                  </span>
                  {isGoogleLoading && (
                    <div className="absolute right-4 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </Button>
                
                <Button
                  onClick={handleDiscordLogin}
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 group"
                >
                  <MessageCircle className="h-5 w-5 mr-3 text-purple-600" />
                  <span className="font-semibold">Continue with Discord</span>
                  <span className="ml-2 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full">
                    Soon
                  </span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Success Message */}
                {successMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">{successMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address or Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="emailOrPhone"
                      type="text"
                      placeholder="Enter your email or phone number"
                      className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('emailOrPhone')}
                    />
                  </div>
                  {errors.emailOrPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.emailOrPhone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pr-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      {...register('rememberMe')}
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* OTP Verification Form */}
              {showOTPForm && (
                <form onSubmit={handleOTPSubmit} className="space-y-4 border-t-2 border-gray-100 pt-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">An OTP has been sent to your registered email</p>
                  </div>

                  {/* Error/Success Messages in OTP */}
                  {successMessage && !showOTPForm.toString().includes('false') && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter 6-Digit OTP
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="otp"
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-2xl text-center font-mono letter-spacing-wide"
                      />
                    </div>
                  </div>

                  <div className="flex items-justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Time Remaining
                    </span>
                    <span className={`text-lg font-bold font-mono ${otpTimer < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                      {formatTime(otpTimer)}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    disabled={isVerifyingOTP || otpTimer <= 0}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isVerifyingOTP ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Verifying OTP...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Verify OTP
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setShowOTPForm(false);
                      setOtpCode('');
                      setOtpTimer(0);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-gray-900"
                  >
                    Back to Login
                  </Button>
                </form>
              )}

              {!showOTPForm && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      href="/auth/signup"
                      className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              )}

              {/* Community Link */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                <div className="text-center">
                  <p className="text-sm text-purple-800 mb-2">
                    <MessageCircle className="h-4 w-4 inline mr-1" />
                    Join our Discord community
                  </p>
                  <a
                    href="https://discord.gg/SSVg6QrG28"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    500+ developers • Instant support
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
