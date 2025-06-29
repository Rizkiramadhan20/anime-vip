'use client';

import React from 'react';
import { useAuth } from '@/utils/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Bookmark, Menu, X, Coins, History } from 'lucide-react';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-20 h-16 bg-white/10 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4 lg:px-6 shadow-lg">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
                </button>
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="Search anime, movies, or streamers..."
                        className="w-[300px] h-10 bg-white/10 border-white/20 text-white placeholder-gray-400 pl-10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    />
                </div>
            </div>

            {/* Right side - Actions and User */}
            <div className="flex items-center gap-4">
                {/* History */}
                <button className="relative group">
                    <div className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
                        <History size={20} className="text-gray-300 group-hover:text-white" />
                    </div>
                </button>

                {/* Bookmarks */}
                <button className="relative group">
                    <div className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
                        <Bookmark size={20} className="text-gray-300 group-hover:text-white" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white/10"></span>
                    </div>
                </button>

                {/* Token Display */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                    <Coins size={18} className="text-yellow-400" />
                    <span className="text-yellow-400 font-semibold text-sm">
                        {user?.token || 0}
                    </span>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-200 hidden sm:block">{user?.displayName}</span>
                    <Avatar className="w-10 h-10 ring-2 ring-purple-500/50 hover:ring-purple-500 transition-all duration-300">
                        <AvatarImage src={user?.photoURL || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                            {user?.displayName?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
