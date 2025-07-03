'use client';

import React, { useState, useRef } from 'react'

import ReactDOM from 'react-dom/client'

import { MovieItem } from '@/interface/Anime';

import Image from 'next/image'

import Link from 'next/link'

import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'

import { Card, CardHeader } from '@/components/ui/card';

import ImagePlaceholder from '@/base/helper/ImagePlaceholder'

import { useRouter } from 'next/navigation'

interface AnimeContentProps {
    movieData: {
        movieList: MovieItem[];
    };
}

export default function AnimePage({ movieData }: AnimeContentProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsLoading(true);
        router.push(e.currentTarget.href);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (sliderRef.current) {
            setStartX(e.pageX - sliderRef.current.offsetLeft);
            setScrollLeft(sliderRef.current.scrollLeft);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        if (sliderRef.current) {
            const x = e.pageX - sliderRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            sliderRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (sliderRef.current) {
            setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
            setScrollLeft(sliderRef.current.scrollLeft);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (sliderRef.current) {
            const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            sliderRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleScroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = 400; // Adjust this value based on your needs
            const newScrollLeft = direction === 'left'
                ? sliderRef.current.scrollLeft - scrollAmount
                : sliderRef.current.scrollLeft + scrollAmount;

            sliderRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-6 px-4 sm:px-5">
            <div className='flex justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-6'>
                <h3 className='text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white'>Movie</h3>
                <Link href={"/item/completed"} onClick={handleLinkClick} className='text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-semibold flex items-center gap-2'>
                    Lihat Semua
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="relative mt-10">
                {/* Navigation Buttons */}
                <button
                    onClick={() => handleScroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur shadow-xl hover:scale-110 transition-all duration-300 p-2 rounded-full border border-gray-200 dark:border-gray-700"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
                <button
                    onClick={() => handleScroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur shadow-xl hover:scale-110 transition-all duration-300 p-2 rounded-full border border-gray-200 dark:border-gray-700"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>

                {/* Gradient Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-white/80 dark:from-gray-900/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-white/80 dark:from-gray-900/80 to-transparent z-10 pointer-events-none" />

                <div
                    ref={sliderRef}
                    className="w-full overflow-x-auto touch-pan-x cursor-grab active:cursor-grabbing select-none scrollbar-hide pb-4"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehaviorX: 'contain',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    } as React.CSSProperties}
                >
                    <div className="flex gap-5">
                        {movieData.movieList.slice(0, 10).map((item, idx) => (
                            <div
                                key={idx}
                                className="flex-none group touch-pan-y"
                                onDragStart={(e) => e.preventDefault()}
                            >
                                <Link
                                    href={`item/${item.href}`}
                                    className="block w-[180px] sm:w-[220px] lg:w-[260px] xl:w-[300px]"
                                    onClick={handleLinkClick}
                                >
                                    <Card className="h-full bg-white dark:bg-gray-900 shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer p-0 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                                        <CardHeader className="p-0">
                                            <div className="relative aspect-[3/4] w-full overflow-hidden">
                                                {item.poster ? (
                                                    <Image
                                                        src={item.poster}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 180px"
                                                        priority={idx < 6}
                                                        onError={(e) => {
                                                            const imgElement = e.target as HTMLImageElement;
                                                            imgElement.style.display = 'none';
                                                            const parent = imgElement.parentElement;
                                                            if (parent) {
                                                                const placeholder = document.createElement('div');
                                                                placeholder.style.width = '100%';
                                                                placeholder.style.height = '100%';
                                                                parent.appendChild(placeholder);
                                                                const root = ReactDOM.createRoot(placeholder);
                                                                root.render(<ImagePlaceholder />);
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <ImagePlaceholder />
                                                )}

                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white z-10">
                                                    <h5 className="text-base md:text-lg font-bold tracking-tight line-clamp-1 mb-1 md:mb-2 drop-shadow-md">
                                                        {item.title}
                                                    </h5>
                                                    <div className="flex justify-between items-center gap-2 text-xs md:text-sm">
                                                        <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full">
                                                            <BookOpen className="w-4 h-4" />
                                                            {item.type}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full">
                                                            Eps {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

