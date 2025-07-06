'use client';

import React from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/utils/context/AuthContext';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Input } from '@/components/ui/input';

import { Search, Bookmark, Menu, X, Coins, History } from 'lucide-react';

import { ModeToggle } from '@/utils/theme/ThemeToggle';

import { searchAnime } from '@/lib/anime/FetchAnime';

import { AnimeItem } from '@/interface/Anime';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<AnimeItem[]>([]);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Debounce search
    React.useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }
        setLoading(true);
        const handler = setTimeout(async () => {
            try {
                const results = await searchAnime(searchQuery.trim());
                setSearchResults(results.slice(0, 8));
                setShowDropdown(true);
            } catch {
                setSearchResults([]);
                setShowDropdown(false);
            } finally {
                setLoading(false);
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Hide dropdown on click outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        }
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleResultClick = (href: string) => {
        setShowDropdown(false);
        setSearchQuery('');
        router.push(`anime/${href}`);
    };

    return (
        <header className="sticky top-0 z-20 h-16 bg-[var(--sidebar)] backdrop-blur-xl border-b border-[var(--sidebar-border)] flex items-center justify-between px-2 sm:px-4 lg:px-6 shadow-lg">
            {/* Left side */}
            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    className="lg:hidden p-2 hover:bg-[var(--sidebar-accent)]/10 rounded-lg transition-colors duration-200"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X size={24} className="text-[var(--sidebar-foreground)]" /> : <Menu size={24} className="text-[var(--sidebar-foreground)]" />}
                </button>
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--sidebar-foreground)]" size={20} />
                    <Input
                        ref={inputRef}
                        placeholder="Search anime, movies, or streamers..."
                        className="w-[180px] sm:w-[300px] h-10 bg-[var(--sidebar)] border-[var(--sidebar-border)] text-[var(--sidebar-foreground)] placeholder-[var(--muted-foreground)] pl-10 rounded-xl focus:ring-2 focus:ring-[var(--sidebar-primary)] focus:border-[var(--sidebar-primary)] transition-all duration-300"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        autoComplete="off"
                    />
                    {showDropdown && (
                        <div ref={dropdownRef} className="absolute left-0 mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-[200] max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-muted-foreground text-sm">Searching...</div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground text-sm">No results found</div>
                            ) : (
                                <ul>
                                    {searchResults.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 px-4 py-2 hover:bg-accent cursor-pointer transition" onClick={() => handleResultClick(item.href)}>
                                            <img src={item.poster} alt={item.title} className="w-10 h-14 object-cover rounded-md border border-border" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm truncate">{item.title}</div>
                                                <div className="text-xs text-muted-foreground flex gap-2">
                                                    <span>{item.status}</span>
                                                    <span className="font-semibold text-primary">{item.score}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right side - Actions and User */}
            <div className="flex items-center gap-2 sm:gap-4">
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
                <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                    <Coins size={16} className="text-yellow-400 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-yellow-400 font-semibold text-xs sm:text-sm">
                        {user ? user.days : 'premium'}
                    </span>
                </div>

                {/* User Profile */}
                {user ? (
                    <div className="hidden md:flex items-center gap-2 sm:gap-3">
                        <span className="font-medium text-[var(--sidebar-foreground)] hidden md:block">{user?.displayName}</span>
                        <Avatar className="w-9 h-9 sm:w-10 sm:h-10 ring-2 ring-[var(--sidebar-primary)] hover:ring-[var(--sidebar-primary)] transition-all duration-300">
                            <AvatarImage src={user?.photoURL || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                                {user?.displayName?.[0] || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                ) : (
                    <Link href="/signin">
                        <button className="hidden md:block px-3 py-2 sm:px-4 sm:py-2 bg-[var(--sidebar-primary)] text-white rounded-lg font-semibold hover:bg-[var(--sidebar-accent)] transition-colors duration-200 text-sm sm:text-base">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}
