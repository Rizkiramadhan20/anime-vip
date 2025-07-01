'use client';

import React, { useEffect } from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { useRouter, usePathname } from 'next/navigation';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user && pathname === '/') {
      // Only redirect if user is on the home page and authenticated
      router.push('/anime');
    }
  }, [user, loading, router, pathname]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--sidebar-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show simple page
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-[var(--sidebar-foreground)]">Selamat Datang di AniHuaVerse</h1>
          <p className="text-[var(--muted-foreground)] mb-4">Silakan login untuk mengakses konten anime</p>
          <button
            onClick={() => router.push('/signin')}
            className="bg-[var(--sidebar-primary)] hover:bg-[var(--sidebar-accent)] text-[var(--sidebar-primary-foreground)] font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // If user is authenticated, show a simple redirect message
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--sidebar-primary)] mx-auto"></div>
        <p className="mt-4 text-[var(--muted-foreground)]">Mengarahkan ke halaman anime...</p>
      </div>
    </div>
  );
}
