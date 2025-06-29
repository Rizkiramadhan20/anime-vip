'use client';

import React, { useState } from 'react';

import { z } from 'zod';

import { useAuth } from '@/utils/context/AuthContext';

import Link from 'next/link';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth';

import BlobsBackground from '@/components/background/BlobsBackground';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
    const { signUp } = useAuth();

    const validateForm = (): boolean => {
        try {
            signUpSchema.parse({ email, password, confirmPassword, displayName });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Partial<SignUpFormData> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as keyof SignUpFormData] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
            return false;
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await signUp(email, password, displayName);
        } catch (error) {
            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof SignUpFormData, value: string) => {
        switch (field) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            case 'displayName':
                setDisplayName(value);
                break;
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <section className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
            {/* Left: Signup Form */}
            <div className="flex flex-col justify-between w-full max-w-3xl px-8 py-8 lg:px-16 lg:py-12 lg:w-2/5 order-last lg:order-first">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                    {/* Logo */}
                    <div className="hidden lg:flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <svg width="20" height="20" className="sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" fill="currentColor" className="text-primary-foreground" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 w-full">
                        <span className="text-muted-foreground text-xs sm:text-sm">Already have an account?</span>
                        <Link href="/signin">
                            <Button variant="outline" size="sm">Sign In</Button>
                        </Link>
                    </div>
                </div>

                {/* Main Form */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col items-center mb-6 sm:mb-8">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
                                <svg width="24" height="24" className="sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24">
                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">Create your account</h2>
                            <p className="text-muted-foreground text-xs sm:text-sm text-center max-w-sm">Enter your details to register.</p>
                        </div>
                        <div className="space-y-4">
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="displayName" className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                    </span>
                                    <Input
                                        id="displayName"
                                        name="displayName"
                                        type="text"
                                        required
                                        className={`block w-full pl-10 pr-3 py-3 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background text-sm sm:text-base ${errors.displayName ? 'border-destructive focus:ring-destructive' : 'border-input'
                                            }`}
                                        placeholder="Enter your full name"
                                        value={displayName}
                                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.displayName && (
                                    <p className="text-sm text-destructive mt-1">{errors.displayName}</p>
                                )}
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
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
                                        className={`block w-full pl-10 pr-3 py-3 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background text-sm sm:text-base ${errors.email ? 'border-destructive focus:ring-destructive' : 'border-input'
                                            }`}
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                                            <rect x="6" y="10" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M9 10V7a3 3 0 116 0v3" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                    </span>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        className={`block w-full pl-10 pr-12 py-3 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background text-sm sm:text-base ${errors.password ? 'border-destructive focus:ring-destructive' : 'border-input'
                                            }`}
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5" />
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.5" />
                                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
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
                                        className={`block w-full pl-10 pr-12 py-3 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background text-sm sm:text-base ${errors.confirmPassword ? 'border-destructive focus:ring-destructive' : 'border-input'
                                            }`}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
                                            <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5" />
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" className="sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.5" />
                                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="mt-6 w-full py-3 sm:py-2"
                            size="lg"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mx-auto"></div>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground mt-6 sm:mt-8">
                    <span>© 2025 AniHuaVerse</span>
                    <span>ID</span>
                </div>
            </div>

            {/* Right: Illustration/Gradient */}
            <BlobsBackground />
        </section>
    );
}
