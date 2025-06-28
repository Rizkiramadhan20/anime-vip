'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/AuthContext';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const { forgotPassword, resetPasswordWithOTP, resendResetOTP } = useAuth();

    // Countdown timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [countdown]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            await forgotPassword(email);
            setOtpSent(true);
            setCountdown(60);
            toast.success('Reset OTP sent! Please check your email.');
        } catch (error) {
            console.error('Send OTP error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`reset-otp-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`reset-otp-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            // Verify OTP first
            const response = await fetch('/api/auth/verify-reset-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otpString }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'OTP verification failed');
            }

            setOtpVerified(true);
            toast.success('OTP verified! Now enter your new password.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error('OTP verification failed: ' + error.message);
            } else {
                toast.error('OTP verification failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setIsLoading(true);
        try {
            await resendResetOTP(email);
            setCountdown(60);
            toast.success('Reset OTP sent again!');
        } catch (error) {
            console.error('Resend error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await resetPasswordWithOTP(email, otp.join(''), newPassword);
            // Redirect to signin
            window.location.href = '/signin';
        } catch (error) {
            console.error('Reset password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex bg-background">
            {/* Left: Forgot Password Form */}
            <div className="flex flex-col justify-between w-full max-w-2xl px-8 py-8 lg:px-16 lg:py-12 lg:w-3/5">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" className="text-primary-foreground" /></svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Remember your password?</span>
                        <Link href="/signin">
                            <Button variant="outline" size="sm">Sign In</Button>
                        </Link>
                    </div>
                </div>

                {/* Main Form */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2">
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.5" />
                                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">
                                {!otpSent ? 'Forgot your password?' :
                                    !otpVerified ? 'Enter verification code' :
                                        'Reset your password'}
                            </h2>
                            <p className="text-muted-foreground text-sm text-center">
                                {!otpSent ? 'Enter your email to receive a reset code' :
                                    !otpVerified ? 'Enter the 6-digit code sent to your email' :
                                        'Enter your new password'}
                            </p>
                        </div>

                        {!otpSent ? (
                            // Step 1: Enter Email
                            <form onSubmit={handleSendOTP}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                    <path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 17.5v-11z" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M3 7l8.293 6.293a1 1 0 001.414 0L21 7" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                            </span>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background border-input"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="mt-6 w-full"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mx-auto"></div>
                                    ) : (
                                        'Send Reset Code'
                                    )}
                                </Button>
                            </form>
                        ) : !otpVerified ? (
                            // Step 2: Enter OTP
                            <form onSubmit={handleVerifyOTP}>
                                <div className="space-y-4">
                                    {/* OTP Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-3">Enter verification code</label>
                                        <div className="flex gap-3 justify-center">
                                            {otp.map((digit, index) => (
                                                <Input
                                                    key={index}
                                                    id={`reset-otp-${index}`}
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    maxLength={1}
                                                    className="w-12 h-12 text-center text-lg font-semibold"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    disabled={isLoading}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resend OTP */}
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Didn't receive the code?
                                        </p>
                                        <Button
                                            type="button"
                                            variant="link"
                                            onClick={handleResendOtp}
                                            disabled={isLoading || countdown > 0}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            {countdown > 0
                                                ? `Resend in ${countdown}s`
                                                : 'Resend reset code'
                                            }
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || otp.join('').length !== 6}
                                    className="mt-6 w-full"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mx-auto"></div>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </Button>
                            </form>
                        ) : (
                            // Step 3: Enter New Password
                            <form onSubmit={handleResetPassword}>
                                <div className="space-y-4">
                                    {/* New Password */}
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-1">New Password</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                    <rect x="6" y="10" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M9 10V7a3 3 0 116 0v3" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                            </span>
                                            <Input
                                                id="newPassword"
                                                name="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                required
                                                className="block w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background border-input"
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isLoading}
                                            >
                                                {showPassword ? (
                                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5" />
                                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.5" />
                                                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                    <rect x="6" y="10" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M9 10V7a3 3 0 116 0v3" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                            </span>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                required
                                                className="block w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background border-input"
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={isLoading}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                disabled={isLoading}
                                            >
                                                {showConfirmPassword ? (
                                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5" />
                                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.5" />
                                                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !newPassword || !confirmPassword}
                                    className="mt-6 w-full"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mx-auto"></div>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-8">
                    <span>© 2024 AniHuaVerse</span>
                    <span>ENG ▼</span>
                </div>
            </div>

            {/* Right: Illustration/Gradient */}
            <div className="hidden lg:block flex-1 bg-gradient-to-br from-primary/10 via-primary/20 to-accent/20 rounded-l-3xl relative overflow-hidden">
                <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full object-cover">
                    <circle cx="260" cy="180" r="110" fill="url(#grad1)" fillOpacity="0.7" />
                    <circle cx="340" cy="80" r="30" fill="url(#grad1)" fillOpacity="0.5" />
                    <defs>
                        <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#a5b4fc" />
                            <stop offset="100%" stopColor="#f0abfc" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </section>
    );
} 