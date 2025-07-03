'use client';

import React from 'react';
import Link from 'next/link';

import { useAuth } from '@/utils/context/AuthContext';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Input } from '@/components/ui/input';

import { Search, Bookmark, Menu, X, Coins, History } from 'lucide-react';

import { ModeToggle } from '@/utils/theme/ThemeToggle';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-20 h-16 bg-[var(--sidebar)] backdrop-blur-xl border-b border-[var(--sidebar-border)] flex items-center justify-between px-4 lg:px-6 shadow-lg">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden p-2 hover:bg-[var(--sidebar-accent)]/10 rounded-lg transition-colors duration-200"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X size={24} className="text-[var(--sidebar-foreground)]" /> : <Menu size={24} className="text-[var(--sidebar-foreground)]" />}
                </button>
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--sidebar-foreground)]" size={20} />
                    <Input
                        placeholder="Search anime, movies, or streamers..."
                        className="w-[300px] h-10 bg-[var(--sidebar)] border-[var(--sidebar-border)] text-[var(--sidebar-foreground)] placeholder-[var(--muted-foreground)] pl-10 rounded-xl focus:ring-2 focus:ring-[var(--sidebar-primary)] focus:border-[var(--sidebar-primary)] transition-all duration-300"
                    />
                </div>
            </div>

            {/* Right side - Actions and User */}
            <div className="flex items-center gap-4">
                {/* History */}
                <button className="relative group">
                    <div className="p-2 hover:bg-[var(--sidebar-accent)]/10 rounded-lg transition-colors duration-200">
                        <History size={20} className="text-[var(--sidebar-foreground)] group-hover:text-[var(--sidebar-primary)]" />
                    </div>
                </button>

                {/* Bookmarks */}
                <button className="relative group">
                    <div className="p-2 hover:bg-[var(--sidebar-accent)]/10 rounded-lg transition-colors duration-200">
                        <Bookmark size={20} className="text-[var(--sidebar-foreground)] group-hover:text-[var(--sidebar-primary)]" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--destructive)] rounded-full ring-2 ring-[var(--sidebar-border)]"></span>
                    </div>
                </button>

                {/* Theme Toggle */}
                <ModeToggle />

                {/* Token Display */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                    <Coins size={18} className="text-yellow-400" />
                    <span className="text-yellow-400 font-semibold text-sm">
                        {user ? user.token : 'premium'}
                    </span>
                </div>

                {/* User Profile */}
                {user ? (
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-[var(--sidebar-foreground)] hidden sm:block">{user?.displayName}</span>
                        <Avatar className="w-10 h-10 ring-2 ring-[var(--sidebar-primary)] hover:ring-[var(--sidebar-primary)] transition-all duration-300">
                            <AvatarImage src={user?.photoURL || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                                {user?.displayName?.[0] || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                ) : (
                    <Link href="/signin">
                        <button className="px-4 py-2 bg-[var(--sidebar-primary)] text-white rounded-lg font-semibold hover:bg-[var(--sidebar-accent)] transition-colors duration-200">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}
