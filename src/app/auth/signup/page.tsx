'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, User, Lock, ArrowRight, Chrome, MessageCircle, Shield, Zap, AlertCircle, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase';
import { signUpSchema, SignUpFormData } from '@/lib/validations';
import toast, { Toaster } from 'react-hot-toast';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpSessionId, setOtpSessionId] = useState('');
  const [userId, setUserId] = useState('');
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const { isFirebaseConfigured } = useAuth();

  // OTP Timer countdown
  useEffect(() => {
    if (!showOTPForm) return;
    
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowOTPForm(false);
          toast.error('OTP expired. Please sign up again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showOTPForm]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    if (!isFirebaseConfigured) {
      toast.error('Firebase not configured. Please set up your Firebase environment variables.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Prepare additional user data
      const additionalData = {
        displayName: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone || null,
        role: 'user',
        plan: 'free',
        emailVerified: false,
        onboardingCompleted: false,
      };

      // Step 1: Create user account
      const userCredential = await signUpWithEmail(data.email, data.password, additionalData);
      const userId = userCredential.user.uid;

      setUserId(userId);
      setUserEmail(data.email);

      // Step 2: Send OTP to user's email
      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: data.email,
          userName: data.firstName,
        }),
      });

      const otpData = await otpResponse.json();

      if (!otpData.success) {
        toast.error(otpData.message || 'Failed to send OTP');
        return;
      }

      setOtpSessionId(otpData.sessionId);
      setShowOTPForm(true);
      setOtpTimer(300);
      toast.success('Account created! OTP sent to your email.');

      // Show dev OTP if available
      if (otpData.devOTP) {
        console.log('🔐 Development OTP:', otpData.devOTP);
        toast.success(`Dev OTP: ${otpData.devOTP}`);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message.includes('Firebase not configured')) {
        toast.error('Authentication service not configured. Please contact support.');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isFirebaseConfigured) {
      toast.error('Firebase not configured. Please set up your Firebase environment variables.');
      return;
    }
    
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Account created successfully! Welcome to Aryan Tech Solution.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign up error:', error);
      if (error.message.includes('Firebase not configured')) {
        toast.error('Authentication service not configured. Please contact support.');
      } else {
        toast.error('Google sign up failed. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDiscordSignUp = () => {
    toast('Discord sign up coming soon! Join our Discord community for now.', {
      icon: '🔜',
    });
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (!userId || !otpSessionId) {
      toast.error('OTP session expired. Please sign up again.');
      return;
    }

    setIsVerifyingOTP(true);

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
        toast.error(verifyData.message || 'Invalid OTP');
        setOtpCode('');
        return;
      }

      // OTP verified - complete signup
      toast.success('Account verified! Welcome to Aryan Tech Solution.');
      
      // Clean up OTP session
      await fetch('/api/auth/verify-otp', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, sessionId: otpSessionId }),
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error('OTP verification failed. Please try again.');
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' }
    ];

    return { score, ...levels[score] };
  };

  const passwordStrength = getPasswordStrength(password || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-right" />
      
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
                Join 50+ Developers
              </span>
            </div>
            
            <h1 className="text-5xl font-black text-gray-900">
              Start Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cloud Journey
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Create your account and get access to premium hosting, development tools, 
              and our thriving community of developers.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instant Setup</h3>
                <p className="text-gray-600 text-sm">Get your services running in minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                <p className="text-gray-600 text-sm">Expert help whenever you need it</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Active Community</h3>
                <p className="text-gray-600 text-sm">Learn and grow with fellow developers</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-600">Developers</div>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl">
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl">
              <div className="text-2xl font-bold text-pink-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Join Aryan Tech Solution and start building amazing things
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Social Sign Up Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                  variant="outline"
                  className="w-full relative group border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  <Chrome className="h-5 w-5 mr-3 text-blue-600" />
                  <span className="font-semibold">
                    {isGoogleLoading ? 'Creating account...' : 'Sign up with Google'}
                  </span>
                  {isGoogleLoading && (
                    <div className="absolute right-4 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </Button>
                
                <Button
                  onClick={handleDiscordSignUp}
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                >
                  <MessageCircle className="h-5 w-5 mr-3 text-purple-600" />
                  <span className="font-semibold">Sign up with Discord</span>
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
                  <span className="bg-white px-4 text-gray-500 font-medium">Or create account with email</span>
                </div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...register('firstName')}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('phone')}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
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
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Password strength</span>
                        <span className={`font-medium ${
                          passwordStrength.score >= 4 ? 'text-green-600' : 
                          passwordStrength.score >= 3 ? 'text-blue-600' : 
                          passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color} ${
                            passwordStrength.score === 1 ? 'w-1/5' :
                            passwordStrength.score === 2 ? 'w-2/5' :
                            passwordStrength.score === 3 ? 'w-3/5' :
                            passwordStrength.score === 4 ? 'w-4/5' :
                            passwordStrength.score === 5 ? 'w-full' : 'w-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="pr-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      {...register('acceptTerms')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="acceptTerms" className="text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Create Account
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
                      Verify Your Email
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">An OTP has been sent to {userEmail}</p>
                  </div>

                  <div>
                    <label htmlFor="signupOtp" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter 6-Digit OTP
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="signupOtp"
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-2xl text-center font-mono"
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
                        Verify & Complete Signup
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setShowOTPForm(false);
                      setOtpCode('');
                      setOtpTimer(0);
                    }}
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-gray-900"
                  >
                    Back to Signup
                  </Button>
                </form>
              )}

              {!showOTPForm && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Sign in here
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
                    500+ developers • Get help instantly
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
