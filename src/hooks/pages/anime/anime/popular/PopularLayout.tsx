import React, { useState } from 'react'

import { useRouter } from 'next/navigation';

import { PopularToday } from '@/interface/Anime';

import Link from 'next/link';

import LoadingOverlay from '@/base/loading/LoadingOverlay';

import { Card } from '@/components/ui/card';

import Image from 'next/image';

import ImagePlaceholder from '@/base/helper/ImagePlaceholder';

import { BookOpen } from 'lucide-react';


interface PopularProps {
    popularAnichinData: PopularToday;
}


export default function PopularLayout({ popularAnichinData }: PopularProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsLoading(true);
        router.push(e.currentTarget.href);
    };

    return (
        <section>
            <LoadingOverlay isLoading={isLoading} message="Loading content..." />
            <div className="flex flex-col gap-6 md:gap-8">
                <div className='border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6'>
                    <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>Completed Donghua</h3>
                </div>

                <div
                    className="w-full overflow-x-auto touch-pan-x cursor-grab active:cursor-grabbing select-none scrollbar-hide pb-4"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehaviorX: 'contain',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    } as React.CSSProperties}
                >
                    <div className="flex gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-5">
                        {popularAnichinData.animeList.map((donghua, idx) => (
                            <div
                                key={idx}
                                className="flex-none group touch-pan-y"
                            >
                                <Link
                                    href={`donghua/${donghua.href}`}
                                    className="block w-[200px] sm:w-full"
                                    onClick={handleLinkClick}
                                >
                                    <Card className="h-full bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 cursor-pointer p-0 border-0">
                                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
                                            {donghua.poster ? (
                                                <Image
                                                    src={donghua.poster}
                                                    alt={donghua.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 180px"
                                                    priority={idx < 6}
                                                />
                                            ) : (
                                                <ImagePlaceholder />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                <h5 className="text-base font-bold tracking-tight text-white line-clamp-1 mb-2">
                                                    {donghua.title}
                                                </h5>

                                                <div className="flex justify-between items-center gap-3 text-sm text-gray-200">
                                                    <span className="flex items-center gap-1.5">
                                                        <BookOpen className="w-4 h-4" />
                                                        {donghua.type}
                                                    </span>

                                                    <span className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full">
                                                        Eps {donghua.episodes}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
