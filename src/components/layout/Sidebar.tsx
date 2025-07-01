'use client';

import React, { useState } from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { Button } from '@/components/ui/button';

import { Home, Flame, Tv, Book, User, LogOut, Loader2 } from 'lucide-react';

import Link from 'next/link';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 lg:relative
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 transition-all duration-300 ease-in-out
                w-72 lg:w-20 bg-[var(--sidebar)] z-30
                border-r border-[var(--sidebar-border)] shadow-2xl
                flex flex-col
            `}>
                {/* Logo Section */}
                <div className="flex items-center justify-center py-8 border-b border-[var(--sidebar-border)]">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <img src="/favicon.png" alt="Logo" className="w-8 h-8" />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-4 p-4">
                    <Link href="/anime" className="group relative p-3 rounded-xl bg-gradient-to-br from-[var(--sidebar-primary)]/20 to-[var(--sidebar-accent)]/20 hover:from-[var(--sidebar-primary)]/30 hover:to-[var(--sidebar-accent)]/30 transition-all duration-300 border border-[var(--sidebar-border)] hover:border-[var(--sidebar-border)] flex items-center gap-3">
                        <Home size={24} className="text-[var(--sidebar-primary)] group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                        <span className="text-[var(--sidebar-primary)] font-medium lg:hidden">Home</span>
                        {/* Tooltip for large screens */}
                        <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--sidebar)] text-[var(--sidebar-primary)] text-sm rounded-md opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
                            Home
                        </span>
                    </Link>
                    <Link href="/manga" className="group relative p-3 rounded-xl hover:bg-[var(--sidebar-accent)]/10 transition-all duration-300 flex items-center gap-3">
                        <Flame size={24} className="text-[var(--sidebar-foreground)] group-hover:text-orange-400 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                        <span className="text-[var(--sidebar-foreground)] group-hover:text-orange-400 font-medium lg:hidden">Trending</span>
                        {/* Tooltip for large screens */}
                        <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] text-sm rounded-md opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
                            Trending
                        </span>
                    </Link>
                    <Link href="#" className="group relative p-3 rounded-xl hover:bg-[var(--sidebar-accent)]/10 transition-all duration-300 flex items-center gap-3">
                        <Tv size={24} className="text-[var(--sidebar-foreground)] group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                        <span className="text-[var(--sidebar-foreground)] group-hover:text-blue-400 font-medium lg:hidden">TV Shows</span>
                        {/* Tooltip for large screens */}
                        <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] text-sm rounded-md opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
                            TV Shows
                        </span>
                    </Link>
                    <Link href="#" className="group relative p-3 rounded-xl hover:bg-[var(--sidebar-accent)]/10 transition-all duration-300 flex items-center gap-3">
                        <Book size={24} className="text-[var(--sidebar-foreground)] group-hover:text-green-400 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                        <span className="text-[var(--sidebar-foreground)] group-hover:text-green-400 font-medium lg:hidden">Manga</span>
                        {/* Tooltip for large screens */}
                        <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] text-sm rounded-md opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
                            Manga
                        </span>
                    </Link>
                    <Link href="#" className="group relative p-3 rounded-xl hover:bg-[var(--sidebar-accent)]/10 transition-all duration-300 flex items-center gap-3">
                        <User size={24} className="text-[var(--sidebar-foreground)] group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                        <span className="text-[var(--sidebar-foreground)] group-hover:text-purple-400 font-medium lg:hidden">Profile</span>
                        {/* Tooltip for large screens */}
                        <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] text-sm rounded-md opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
                            Profile
                        </span>
                    </Link>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-[var(--sidebar-border)]">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-full p-3 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 flex items-center gap-3 justify-start group"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <Loader2 size={22} className="flex-shrink-0 animate-spin text-[var(--sidebar-foreground)]" />
                        ) : (
                            <LogOut size={22} className="flex-shrink-0 text-[var(--sidebar-foreground)]" />
                        )}
                        <span className="text-red-400 font-medium lg:hidden">
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </span>
                        {/* Tooltip for large screens */}
                        <span className="absolute left-full ml-2 px-2 py-1 bg-[var(--sidebar)] text-red-400 text-sm rounded-md opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </span>
                    </Button>
                </div>
            </aside>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-20"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
}
