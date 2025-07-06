import React, { useState, useRef, useEffect } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { formatSlug } from '@/base/helper/anime/FormatSlug';

import Image from 'next/image';

import LoadingOverlay from '@/base/loading/LoadingOverlay';

import { TopUpcoming } from '@/interface/Anime';

import { Card } from '@/components/ui/card';

import { useIsMobile } from '@/base/helper/useIsMobile';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TopUpcomingAsideProps {
    topUpcoming: TopUpcoming;
}

export default function TopUpcomingAside({ topUpcoming }: TopUpcomingAsideProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const isMobile = useIsMobile();

    useEffect(() => {
        // Tidak perlu logic di sini, hook sudah handle event
    }, []);

    const handleAnimeClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setLoadingId(href);
        setLoadingProgress(0);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setLoadingProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                router.push(`/anime/${formatSlug(href)}`);
            }
        }, 100);
    };

    return (
        <aside className='w-full sticky top-5'>
            <LoadingOverlay
                isLoading={!!loadingId || loadingProgress > 0}
                message="Loading in progress"
                progress={loadingProgress}
            />
            <Card className="flex flex-col gap-6 p-4 sm:p-6 rounded-2xl shadow-xl min-h-[400px] max-h-[100dvh] overflow-y-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800">
                <div className='flex justify-between items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4'>
                    <h3 className='text-lg sm:text-2xl font-extrabold tracking-tight' style={{ color: 'var(--primary)' }}>Top Upcoming</h3>
                    <Link href={'/anime/top-upcoming'} className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium text-sm sm:text-base'>
                        Lihat Semua
                    </Link>
                </div>
                <ScrollArea className="w-full pb-2">
                    <div
                        className={`flex ${isMobile ? 'flex-row gap-4 overflow-x-auto pb-2 px-2 hide-scrollbar' : 'flex-col gap-6 overflow-x-visible'} xl:flex-col xl:gap-6 xl:overflow-x-visible`}
                        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                    >
                        {topUpcoming.animeList.map((item, idx) => (
                            <Link
                                href={`/anime/${formatSlug(item.href)}`}
                                key={idx}
                                rel=''
                                className={`group flex-shrink-0 xl:flex-shrink w-36 sm:w-44 xl:w-auto min-w-[144px] sm:min-w-[176px] xl:min-w-0 transition-transform duration-200 hover:scale-[1.03]`}
                                onClick={(e) => handleAnimeClick(e, item.href)}
                            >
                                <div className='flex flex-col xl:flex-row bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden h-full transition-shadow duration-300 relative'>
                                    <div className='relative w-full aspect-[3/4] xl:w-28 xl:aspect-[3/4] flex-shrink-0'>
                                        <Image
                                            src={item.poster}
                                            alt={item.title}
                                            fill
                                            loading='lazy'
                                            className='object-cover w-full h-full rounded-xl border-2 border-blue-200 dark:border-blue-900 shadow-lg group-hover:scale-105 transition-transform duration-300'
                                            sizes="(max-width: 639px) 144px, (max-width: 1279px) 176px, 112px"
                                        />
                                        {isMobile && (
                                            <>
                                                <span className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold shadow">
                                                    <svg width='14' height='14' fill='none' viewBox='0 0 24 24'><path d='M8 17V15C8 13.8954 8.89543 13 10 13H14C15.1046 13 16 13.8954 16 15V17' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><circle cx='12' cy='8' r='3' stroke='currentColor' strokeWidth='1.5' /></svg>
                                                    {item.episodes ?? '-'} eps
                                                </span>
                                                <span className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-semibold shadow">
                                                    <svg width='14' height='14' fill='none' viewBox='0 0 24 24'><path d='M8 7V3M16 7V3M3 11H21M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
                                                    {item.type}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2 p-2 sm:p-4 justify-center'>
                                        <h5 className='text-base sm:text-lg font-bold text-blue-800 dark:text-blue-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-1'>{item.title}</h5>
                                        <div className='flex flex-wrap gap-2'>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                                                <svg width='14' height='14' fill='none' viewBox='0 0 24 24'><path d='M8 7V3M16 7V3M3 11H21M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
                                                {item.releaseDate}
                                            </span>
                                            {!isMobile && (
                                                <>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold">
                                                        <svg width='14' height='14' fill='none' viewBox='0 0 24 24'><path d='M8 17V15C8 13.8954 8.89543 13 10 13H14C15.1046 13 16 13.8954 16 15V17' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><circle cx='12' cy='8' r='3' stroke='currentColor' strokeWidth='1.5' /></svg>
                                                        {item.episodes ?? '-'} eps
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-semibold">
                                                        <svg width='14' height='14' fill='none' viewBox='0 0 24 24'><path d='M8 7V3M16 7V3M3 11H21M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
                                                        {item.type}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Card>
        </aside>
    );
} 