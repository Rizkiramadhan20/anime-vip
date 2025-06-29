'use client';

import React, { useState } from 'react';

import { z } from 'zod';

import { useAuth } from '@/utils/context/AuthContext';

import Link from 'next/link';

import { Input } from '@/components/ui/input';

import { Checkbox } from '@/components/ui/checkbox';

import { Button } from '@/components/ui/button';

import { signInSchema, type SignInFormData } from '@/lib/validations/auth';

import BlobsBackground from '@/components/background/BlobsBackground';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isGithubLoading, setIsGithubLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { login, loginWithGoogle, loginWithGithub } = useAuth();

    const validateForm = (): boolean => {
        try {
            signInSchema.parse({ email, password, rememberMe });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0] && typeof err.message === 'string') {
                        fieldErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
            return false;
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Store remember me preference in localStorage
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }

            await login(email, password);
            // Redirect handled by AuthContext
        } catch (error) {
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
            // Redirect handled by AuthContext
        } catch (error) {
            // Handle error
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGithubLogin = async () => {
        setIsGithubLoading(true);
        try {
            await loginWithGithub();
            // Redirect handled by AuthContext
        } catch (error) {
            // Handle error
        } finally {
            setIsGithubLoading(false);
        }
    };

    const handleInputChange = (field: keyof SignInFormData, value: string) => {
        if (field === 'email') {
            setEmail(value);
        } else if (field === 'password') {
            setPassword(value);
        }

        // Clear error when user starts typing
        if (errors[field as string]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field as string];
                return newErrors;
            });
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setRememberMe(checked);
        // Clear error when user changes checkbox
        if (errors.rememberMe) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.rememberMe;
                return newErrors;
            });
        }
    };

    // Test function to demonstrate checkbox validation
    const testCheckboxValidation = () => {
        try {
            signInSchema.parse({ email: "test@gmail.com", password: "password123", rememberMe: undefined });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0] && typeof err.message === 'string') {
                        fieldErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
        }
    };

    return (
        <section className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
            {/* Left: Login Form */}
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
                        <span className="text-muted-foreground text-xs sm:text-sm">New to AniHuaVerse?</span>
                        <Link href="/signup">
                            <Button variant="outline" size="sm">Register</Button>
                        </Link>
                    </div>
                </div>

                {/* Main Form */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col items-center mb-6 sm:mb-8">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
                                <svg width="24" height="24" className="sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="8" r="4" fill="currentColor" className="text-muted-foreground" />
                                    <ellipse cx="12" cy="17" rx="7" ry="4" fill="currentColor" className="text-muted-foreground" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">Login to your account</h2>
                            <p className="text-muted-foreground text-xs sm:text-sm text-center max-w-sm">Enter your details to login.</p>
                        </div>
                        <form onSubmit={handleEmailLogin} className="space-y-4">
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
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>

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
                                        autoComplete="current-password"
                                        required
                                        className={`block w-full pl-10 pr-12 py-3 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background text-sm sm:text-base ${errors.password ? 'border-destructive focus:ring-destructive' : 'border-input'
                                            }`}
                                        placeholder="Enter your password"
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

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center text-xs sm:text-sm text-muted-foreground gap-2 cursor-pointer select-none">
                                        <Checkbox
                                            checked={rememberMe}
                                            onCheckedChange={handleCheckboxChange}
                                            disabled={isLoading}
                                            id="rememberMe"
                                        />
                                        Remember me
                                    </label>
                                    {errors.rememberMe && (
                                        <p className="text-sm text-destructive mt-1">{errors.rememberMe}</p>
                                    )}
                                </div>

                                <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
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
                                    'Login'
                                )}
                            </Button>
                        </form>

                        {/* Social Login Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Atau login dengan</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleLogin}
                                disabled={isLoading || isGoogleLoading || isGithubLoading}
                                className="w-full py-3 sm:py-2"
                                size="lg"
                            >
                                {isGoogleLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto"></div>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Login dengan Google
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGithubLogin}
                                disabled={isLoading || isGoogleLoading || isGithubLoading}
                                className="w-full py-3 sm:py-2"
                                size="lg"
                            >
                                {isGithubLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto"></div>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        Login dengan GitHub
                                    </>
                                )}
                            </Button>
                        </div>
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