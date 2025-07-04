import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { Role, UserAccount, FirebaseUser, AuthContextType } from '@/interface/Auth';

import { auth, db } from '@/utils/firebase/firebase';

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
} from 'firebase/auth';

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { toast } from 'sonner';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserAccount | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const router = useRouter();

    const getDashboardUrl = (userRole: string) => {
        switch (userRole) {
            case Role.ADMIN:
                return `/dashboard`;
            case Role.USER:
                return `/anime`;
            default:
                return '/anime';
        }
    };

    const handleRedirect = (userData: UserAccount) => {
        // Check if there's a saved redirect URL
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin'); // Clear the saved URL
            router.push(redirectUrl);
            return;
        }

        // For regular users - redirect to anime page
        if (userData.role === Role.USER) {
            router.push('/anime');
            return;
        }

        // For other roles, redirect to their dashboard
        const dashboardUrl = getDashboardUrl(userData.role);
        router.push(dashboardUrl);
    };

    const login = async (email: string, password: string): Promise<UserAccount> => {
        try {
            if (!email || !password) {
                throw new Error('Email dan password harus diisi');
            }

            const emailString = String(email).trim();
            const userCredential = await signInWithEmailAndPassword(auth, emailString, password);

            const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, userCredential.user.uid));
            const userData = userDoc.data() as UserAccount;

            if (!userData) {
                throw new Error('User account not found');
            }

            // Get Firebase auth token and create session
            const idToken = await userCredential.user.getIdToken();
            await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            setUser(userData);
            const welcomeMessage = getWelcomeMessage(userData);
            toast.success(welcomeMessage);
            handleRedirect(userData);

            return userData;
        } catch (error) {
            if (error instanceof Error) {
                // Check if the error is due to disabled account
                if (error.message.includes('auth/user-disabled')) {
                    setShowInactiveModal(true);
                } else {
                    toast.error('Login gagal: ' + error.message);
                }
            } else {
                toast.error('Terjadi kesalahan saat login');
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Sign out from Firebase
            await signOut(auth);
            setUser(null);

            // Clear the session cookie through an API call
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', // Important: This ensures cookies are included
            });

            // Clear any stored redirect URLs
            localStorage.removeItem('redirectAfterLogin');

            // Force reload the page to clear any remaining state
            window.location.href = '/signin';

            toast.success('Anda berhasil logout');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Terjadi kesalahan saat logout');
        }
    };

    const deleteAccount = async () => {
        try {
            if (!user) {
                throw new Error('No user logged in');
            }

            const idToken = await auth.currentUser?.getIdToken();
            if (!idToken) {
                throw new Error('Failed to get authentication token');
            }

            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete account');
            }

            setUser(null);
            toast.success('Akun berhasil dihapus');
            router.push('/signin');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus akun');
            throw error;
        }
    };

    const hasRole = (roles: string | string[]): boolean => {
        if (!user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    };

    const getWelcomeMessage = (userData: UserAccount): string => {
        const { displayName } = userData;
        return `Selamat datang, ${displayName}!`;
    };

    const createSocialUser = async (firebaseUser: FirebaseUser): Promise<UserAccount> => {
        const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, firebaseUser.uid);
        const userData: UserAccount = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            role: Role.USER,
            days: 0,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            emailVerified: true
        };

        await setDoc(userDocRef, userData, { merge: true });
        return userData;
    };

    const loginWithGoogle = async (): Promise<UserAccount> => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, result.user.uid));
            let userData: UserAccount;

            if (!userDoc.exists()) {
                userData = await createSocialUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                });
            } else {
                userData = userDoc.data() as UserAccount;
            }

            // Get Firebase auth token and create session
            const idToken = await result.user.getIdToken();
            await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            setUser(userData);
            const welcomeMessage = getWelcomeMessage(userData);
            toast.success(welcomeMessage);
            handleRedirect(userData);

            return userData;
        } catch (error) {
            // Check if the error is due to disabled account
            if (error instanceof Error && error.message.includes('auth/user-disabled')) {
                setShowInactiveModal(true);
            } else {
                toast.error('Gagal login dengan Google');
            }
            throw error;
        }
    };

    const loginWithGithub = async (): Promise<UserAccount> => {
        try {
            const provider = new GithubAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, result.user.uid));
            let userData: UserAccount;

            if (!userDoc.exists()) {
                userData = await createSocialUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                });
            } else {
                userData = userDoc.data() as UserAccount;
            }

            // Get Firebase auth token and create session
            const idToken = await result.user.getIdToken();
            await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            setUser(userData);
            const welcomeMessage = getWelcomeMessage(userData);
            toast.success(welcomeMessage);
            handleRedirect(userData);

            return userData;
        } catch (error) {
            // Check if the error is due to disabled account
            if (error instanceof Error && error.message.includes('auth/user-disabled')) {
                setShowInactiveModal(true);
            } else {
                toast.error('Gagal login dengan GitHub');
            }
            throw error;
        }
    };

    const loginWithFacebook = async (): Promise<UserAccount> => {
        try {
            // For now, we'll show a message that Facebook login is not implemented
            toast.error('Login dengan Facebook belum tersedia');
            throw new Error('Facebook login not implemented');
        } catch (error) {
            throw error;
        }
    };

    const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
        try {
            if (!process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS) {
                throw new Error('Collection path is not configured');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const userData: UserAccount = {
                uid: userCredential.user.uid,
                email: email,
                displayName: displayName,
                role: Role.USER,
                days: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                emailVerified: false
            };

            const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS, userCredential.user.uid);
            await setDoc(userDocRef, userData);

            // Send OTP for email verification
            const otpResponse = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!otpResponse.ok) {
                throw new Error('Failed to send verification OTP');
            }

            // Sign out immediately after creating account
            await signOut(auth);

            toast.success('Registration successful! Please check your email for verification OTP.');
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('auth/email-already-in-use')) {
                    toast.error('Email already in use. Please use a different email.');
                } else {
                    toast.error('Registration failed: ' + error.message);
                }
            } else {
                toast.error('Registration failed');
            }
            throw error;
        }
    };

    const verifyEmail = async (email: string, otp: string): Promise<void> => {
        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            toast.success('Email verified successfully!');
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Verification failed: ' + error.message);
            } else {
                toast.error('Verification failed');
            }
            throw error;
        }
    };

    const resendVerificationEmail = async (email: string): Promise<void> => {
        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend verification email');
            }

            toast.success('Verification OTP sent! Please check your inbox.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Failed to resend verification email: ' + error.message);
            } else {
                toast.error('Failed to resend verification email');
            }
            throw error;
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            // Send OTP for password reset
            const otpResponse = await fetch('/api/auth/send-reset-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!otpResponse.ok) {
                const data = await otpResponse.json();
                throw new Error(data.error || 'Failed to send reset OTP');
            }

            toast.success('Password reset OTP sent! Please check your email.');
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('auth/user-not-found')) {
                    toast.error('No account found with this email address.');
                } else {
                    toast.error('Failed to send reset OTP: ' + error.message);
                }
            } else {
                toast.error('Failed to send reset OTP.');
            }
            throw error;
        }
    };

    const resetPasswordWithOTP = async (email: string, otp: string, newPassword: string): Promise<void> => {
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            toast.success('Password reset successfully!');
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Password reset failed: ' + error.message);
            } else {
                toast.error('Password reset failed');
            }
            throw error;
        }
    };

    const resendResetOTP = async (email: string): Promise<void> => {
        try {
            const response = await fetch('/api/auth/send-reset-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend reset OTP');
            }

            toast.success('Reset OTP sent again! Please check your email.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Failed to resend reset OTP: ' + error.message);
            } else {
                toast.error('Failed to resend reset OTP');
            }
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser && process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS) {
                    const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, firebaseUser.uid));
                    const userData = userDoc.data() as UserAccount;
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        login,
        loginWithGoogle,
        loginWithGithub,
        loginWithFacebook,
        logout,
        deleteAccount,
        hasRole,
        getDashboardUrl,
        signUp,
        forgotPassword,
        verifyEmail,
        resendVerificationEmail,
        showInactiveModal,
        setShowInactiveModal,
        resetPasswordWithOTP,
        resendResetOTP
    };
    return (
        <AuthContext.Provider value={value as AuthContextType}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};