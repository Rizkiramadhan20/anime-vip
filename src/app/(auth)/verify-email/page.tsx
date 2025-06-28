'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [email, setEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { verifyEmail, resendVerificationEmail } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Get email from URL params
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }

        // Check if user is already logged in
        checkLoginStatus();
    }, [searchParams]);

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/auth/check-verification');
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                if (!email && data.email) {
                    setEmail(data.email);
                }
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            await verifyEmail(email, otp);

            // Redirect based on login status
            if (isLoggedIn) {
                router.push('/anime');
            } else {
                router.push('/signin');
            }
        } catch (error) {
            console.error('Verification error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setIsLoading(true);
        try {
            await resendVerificationEmail(email);
            setCountdown(60); // 60 seconds countdown
            toast.success('Verification OTP sent! Please check your inbox.');
        } catch (error) {
            console.error('Resend error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex bg-background">
            {/* Left: Verification Form */}
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
                        <span className="text-muted-foreground text-sm">Already verified?</span>
                        <Link href="/signin">
                            <Button variant="outline" size="sm">Sign In</Button>
                        </Link>
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleVerify} className="flex-1 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex flex-col gap-2 items-center mb-6">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2">
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                                    <path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 17.5v-11z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M3 7l8.293 6.293a1 1 0 001.414 0L21 7" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">Verify your email</h2>
                            <p className="text-muted-foreground text-sm text-center flex gap-2 flex-col">
                                We've sent a verification code to <br />
                                <span className="font-medium text-foreground">{email}</span>
                            </p>
                            {isLoggedIn && (
                                <p className="text-sm text-blue-600 mt-2">
                                    You're already logged in. Please verify your email to continue.
                                </p>
                            )}
                        </div>

                        {/* OTP Input */}
                        <div className="mb-6">
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                    disabled={isLoading}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                                        <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                                        <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                                        <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                                        <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                                        <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>

                        {/* Resend OTP */}
                        <div className="text-center mb-6">
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
                                    : 'Resend verification code'
                                }
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="w-full"
                            size="lg"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mx-auto"></div>
                            ) : (
                                'Verify Email'
                            )}
                        </Button>
                    </div>
                </form>

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