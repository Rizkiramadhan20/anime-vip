'use client';

import React, { useEffect, useState } from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { useRouter } from 'next/navigation';

import { LatestRelease, PopularToday, TopUpcoming, BannerItem } from '@/interface/Anime';

import PopularLayout from './popular/PopularLayout';

import LatestRealese from "@/hooks/pages/anime/anime/latest-realese/Latest_realese"

import BannerLayout from "./banner/BannerLayout";

import TopUpcomingAside from './aside/TopUpcomingAside';

interface AnimeContentProps {
    animeData: {
        popular_today: PopularToday;
        latest_realese: LatestRelease
        top_upcoming: TopUpcoming
        banner: BannerItem[];
    };
}

export default function AnimePage({ animeData }: AnimeContentProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [activeBanner, setActiveBanner] = useState(0);
    const bannerList = animeData.banner || [];

    useEffect(() => {
        if (!bannerList || bannerList.length === 0) return;
        const interval = setInterval(() => {
            setActiveBanner((prev) => (prev + 1) % bannerList.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [bannerList]);

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
        <div className="py-6 px-4 sm:px-5">
            <div className="flex flex-col xl:flex-row gap-8">
                <div className="flex-1 space-y-14">
                    {/* Banner/Video */}
                    <BannerLayout
                        bannerList={bannerList}
                        activeBanner={activeBanner}
                        setActiveBanner={setActiveBanner}
                        router={router}
                    />

                    {/* Most Popular Anime */}
                    <PopularLayout popularAnichinData={animeData.popular_today} />

                    {/* Latest Realese & Top Upcoming Aside side by side */}
                    <div className="flex gap-8 flex-col xl:flex-row">
                        <div className="w-full xl:w-3/4">
                            <LatestRealese leatestAnichinData={animeData.latest_realese} />
                        </div>
                        <div className="w-full xl:w-1/3">
                            <TopUpcomingAside topUpcoming={animeData.top_upcoming} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

