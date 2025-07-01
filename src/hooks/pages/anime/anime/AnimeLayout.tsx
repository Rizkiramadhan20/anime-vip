'use client';

import React from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';

import { Play } from 'lucide-react';

import { LatestRelease, PopularToday, TopUpcoming } from '@/interface/Anime';

import PopularLayout from './popular/PopularLayout';

import LatestRealese from "@/hooks/pages/anime/anime/latest-realese/Latest_realese"

interface AnimeContentProps {
    animeData: {
        popular_today: PopularToday;
        latest_realese: LatestRelease
        top_upcoming: TopUpcoming
    };
}

export default function AnimePage({ animeData }: AnimeContentProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                    <p className="mt-6 text-gray-300 text-lg font-medium">Loading your anime world...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        router.push('/signin');
        return null;
    }

    return (
        <div className="py-6 space-y-6 px-5">
            {/* Banner/Video */}
            <section>
                <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 shadow-2xl relative min-h-[280px] group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-purple-800/90"></div>
                    <div className="relative z-10 p-8 flex items-center justify-between">
                        <div className="max-w-lg">
                            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                                Anime Pilihan Minggu Ini
                            </h2>
                            <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                                Tonton anime terbaru dan terpopuler dengan kualitas terbaik!
                            </p>
                            <Button className="flex items-center gap-3 bg-white text-purple-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                                <Play size={20} />
                                Watch Now
                            </Button>
                        </div>
                        <div className="hidden lg:block">
                            <img src="/favicon.png" alt="Banner" className="w-64 h-48 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommended Streamers */}
            <section className="mb-10 px-4">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--sidebar-foreground)] to-[var(--muted-foreground)] bg-clip-text text-transparent">
                    Top Streamers
                </h3>

                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex flex-col items-center min-w-[120px] group">
                            <div className="relative mb-3">
                                <Avatar className="w-20 h-20 ring-4 ring-[var(--sidebar-primary)]/30 group-hover:ring-[var(--sidebar-primary)]/60 transition-all duration-300">
                                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
                                    <AvatarFallback className="bg-gradient-to-br from-[var(--sidebar-primary)] to-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] font-semibold">
                                        S{i}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--destructive)] rounded-full border-2 border-[var(--sidebar)]"></div>
                            </div>
                            <span className="text-sm font-semibold text-[var(--sidebar-foreground)] group-hover:text-[var(--sidebar-primary)] transition-colors duration-300">
                                Streamer {i}
                            </span>
                            <span className="text-xs text-[var(--muted-foreground)]">{Math.floor(Math.random() * 50) + 10}k viewers</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Most Popular Anime */}

            <PopularLayout popularAnichinData={animeData.popular_today} />

            <LatestRealese leatestAnichinData={animeData.latest_realese} />
        </div>
    );
}
