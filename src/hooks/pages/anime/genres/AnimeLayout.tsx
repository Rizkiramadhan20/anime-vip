'use client';

import React from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';

import { Play } from 'lucide-react';

export default function AnimePage() {
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
        <div className="py-6">
            {/* Banner/Video */}
            <section className="mb-10 px-4">
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
            <section className="mb-8 px-4">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--sidebar-foreground)] to-[var(--muted-foreground)] bg-clip-text text-transparent">
                    Trending Anime
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <Card key={i} className="bg-[var(--sidebar)]/80 backdrop-blur-xl border-[var(--sidebar-border)] hover:bg-[var(--sidebar)] transition-all duration-300 group cursor-pointer rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 p-0">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <div className='overflow-hidden'>
                                        <img
                                            src={`https://picsum.photos/400/250?random=${i}`}
                                            alt="Anime"
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="absolute top-3 right-3 bg-[var(--destructive)] text-[var(--sidebar-foreground)] text-xs font-bold px-2 py-1 rounded-full">
                                        HOT
                                    </div>

                                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Button size="sm" className="w-full bg-[var(--sidebar-accent)]/20 backdrop-blur-sm hover:bg-[var(--sidebar-accent)]/30 text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)]">
                                            <Play size={16} className="mr-2" />
                                            Watch
                                        </Button>
                                    </div>
                                </div>
                                <div className="py-7 px-4">
                                    <h4 className="font-bold mb-2 text-[var(--sidebar-foreground)] group-hover:text-[var(--sidebar-primary)] transition-colors duration-300">
                                        Anime Trending #{i}
                                    </h4>
                                    <p className="text-[var(--muted-foreground)] text-sm mb-3 line-clamp-2">
                                        Deskripsi singkat anime trending dengan rating tinggi dan review positif dari komunitas.
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                                        <span>⭐ {(4 + Math.random() * 1).toFixed(1)}</span>
                                        <span>EP {Math.floor(Math.random() * 24) + 1}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
