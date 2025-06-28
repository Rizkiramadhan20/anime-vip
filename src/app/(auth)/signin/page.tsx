'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useAuth } from '@/utils/context/AuthContext';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { signInSchema, type SignInFormData } from '@/lib/validations/auth';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<SignInFormData>>({});
    const { login } = useAuth();

    const validateForm = (): boolean => {
        try {
            signInSchema.parse({ email, password });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Partial<SignInFormData> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as keyof SignInFormData] = err.message;
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
            await login(email, password);
            // Redirect handled by AuthContext
        } catch (error) {
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof SignInFormData, value: string) => {
        if (field === 'email') {
            setEmail(value);
        } else if (field === 'password') {
            setPassword(value);
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <section className="min-h-screen flex bg-background">
            {/* Left: Login Form */}
            <div className="flex flex-col justify-between w-full max-w-3xl px-8 py-8 lg:px-16 lg:py-12 lg:w-3/5">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" className="text-primary-foreground" /></svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">New to AniHuaVerse?</span>
                        <Link href="/signup">
                            <Button variant="outline" size="sm">Register</Button>
                        </Link>
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleEmailLogin} className="flex-1 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2">
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="currentColor" className="text-muted-foreground" /><ellipse cx="12" cy="17" rx="7" ry="4" fill="currentColor" className="text-muted-foreground" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">Login to your account</h2>
                            <p className="text-muted-foreground text-sm">Enter your details to login.</p>
                        </div>
                        <div className="space-y-4">
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 17.5v-11z" stroke="currentColor" strokeWidth="1.5" /><path d="M3 7l8.293 6.293a1 1 0 001.414 0L21 7" stroke="currentColor" strokeWidth="1.5" /></svg>
                                    </span>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background ${errors.email ? 'border-destructive focus:ring-destructive' : 'border-input'
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
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="6" y="10" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M9 10V7a3 3 0 116 0v3" stroke="currentColor" strokeWidth="1.5" /></svg>
                                    </span>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className={`block w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground bg-background ${errors.password ? 'border-destructive focus:ring-destructive' : 'border-input'
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
                                {errors.password && (
                                    <p className="text-sm text-destructive mt-1">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center text-sm text-muted-foreground gap-2 cursor-pointer select-none">
                                <Checkbox
                                    checked={rememberMe}
                                    onCheckedChange={val => setRememberMe(val === true)}
                                    disabled={isLoading}
                                    id="rememberMe"
                                />
                                Remember me
                            </label>

                            <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="mt-6 w-full"
                            size="lg"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mx-auto"></div>
                            ) : (
                                'Login'
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