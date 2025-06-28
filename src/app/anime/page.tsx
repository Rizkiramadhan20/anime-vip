'use client';

import React from 'react';
import { useAuth } from '@/utils/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AnimePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is not authenticated, redirect to signin
    if (!user) {
        router.push('/signin');
        return null;
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Anime Collection</h1>
                    <p className="text-gray-600">Selamat datang, {user.displayName}!</p>
                </header>

                <main>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder content */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-2">Anime Terbaru</h3>
                            <p className="text-gray-600">Daftar anime terbaru akan ditampilkan di sini.</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-2">Anime Populer</h3>
                            <p className="text-gray-600">Daftar anime populer akan ditampilkan di sini.</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-2">Rekomendasi</h3>
                            <p className="text-gray-600">Rekomendasi anime untuk Anda.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
