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
            <div className="flex flex-col gap-8 md:gap-10">
                <div className='border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6'>
                    <h3 className='text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>Popular Today</h3>
                </div>

                <div
                    className="w-full overflow-x-auto touch-pan-x cursor-grab active:cursor-grabbing select-none scrollbar-hide pb-4"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehaviorX: 'contain',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'thin',
                    } as React.CSSProperties}
                >
                    <div className="grid grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[22%] xl:auto-cols-[18.7%] gap-5 md:gap-7 px-1 md:px-0">
                        {popularAnichinData.animeList.map((donghua, idx) => (
                            <div
                                key={idx}
                                className="group h-full flex flex-col justify-end"
                            >
                                <Link
                                    href={`anime/${donghua.href}`}
                                    className="block h-full"
                                    onClick={handleLinkClick}
                                >
                                    <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer p-0 rounded-2xl overflow-hidden relative">
                                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                                            {donghua.poster ? (
                                                <Image
                                                    src={donghua.poster}
                                                    alt={donghua.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90"
                                                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 18vw"
                                                    priority={idx < 6}
                                                />
                                            ) : (
                                                <ImagePlaceholder />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                                                <h5 className="text-lg font-bold tracking-tight text-white line-clamp-1 mb-1 md:mb-2 drop-shadow-md">
                                                    {donghua.title}
                                                </h5>

                                                <div className="flex justify-between items-center gap-2 text-xs md:text-sm text-gray-200">
                                                    <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full">
                                                        <BookOpen className="w-4 h-4" />
                                                        {donghua.type}
                                                    </span>

                                                    <span className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full">
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
