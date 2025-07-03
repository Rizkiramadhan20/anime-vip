import React, { useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { formatSlug } from '@/base/helper/anime/FormatSlug';

import Image from 'next/image';

import LoadingOverlay from '@/base/loading/LoadingOverlay';

import { TopUpcoming } from '@/interface/Anime';

import { Card } from '@/components/ui/card';

interface TopUpcomingAsideProps {
    topUpcoming: TopUpcoming;
}

export default function TopUpcomingAside({ topUpcoming }: TopUpcomingAsideProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

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
            <Card className="flex flex-col gap-8 p-6 rounded-2xl shadow-xl min-h-[400px] max-h-[100dvh] overflow-y-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800">
                <div className='flex justify-between items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-4'>
                    <h3 className='text-2xl font-extrabold tracking-tight' style={{ color: 'var(--primary)' }}>Top Upcoming</h3>
                    <Link href={'/anime/top-upcoming'} className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium'>
                        Lihat Semua
                    </Link>
                </div>
                <div className='flex flex-row xl:flex-col gap-6 overflow-x-auto xl:overflow-x-visible pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent px-2 sm:px-0'>
                    {topUpcoming.animeList.map((item, idx) => (
                        <Link
                            href={`/anime/${formatSlug(item.href)}`}
                            key={idx}
                            rel=''
                            className='group flex-shrink-0 xl:flex-shrink w-44 xl:w-auto min-w-[176px] xl:min-w-0 transition-transform duration-200 hover:scale-[1.03]'
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
                                        sizes="(max-width: 1279px) 176px, 112px"
                                    />
                                </div>
                                <div className='flex flex-col gap-2 p-4 justify-center'>
                                    <h5 className='text-base font-bold text-blue-700 dark:text-blue-300 line-clamp- group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'>{item.title}</h5>
                                    <div className='flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400'>
                                        <span className="inline-flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M8 17V15C8 13.8954 8.89543 13 10 13H14C15.1046 13 16 13.8954 16 15V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /></svg> {item.episodes ?? '-'} eps</span>
                                        <span className="inline-flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M8 7V3M16 7V3M3 11H21M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> {item.releaseDate}</span>
                                        <span className="inline-flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M8 7V3M16 7V3M3 11H21M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> {item.type}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Card>
        </aside>
    );
} 