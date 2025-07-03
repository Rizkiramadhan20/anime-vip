'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    router.push('/anime');
  }, [router]);

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--sidebar-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--muted-foreground)]">Mengarahkan ke halaman anime...</p>
        </div>
      </div>
    );
  }

  return null;
}