"use client"

import React, { useState } from 'react'

import Image from 'next/image';

import ImagePlaceholder from '@/base/helper/ImagePlaceholder';

import { BookOpen } from 'lucide-react';

import { MovieListItem, MovieSimpleItem } from '@/interface/Anime';

import { motion, AnimatePresence } from 'framer-motion'

import Link from 'next/link';

import { Card } from '@/components/ui/card';

interface LatestActionAdventureProps {
    latestAdventureActionData: MovieListItem[];
    MovieActionData: MovieSimpleItem[];
}

const FILTERS = ['Movie', 'Adventure'];

export default function LatestActionAdventure({ latestAdventureActionData, MovieActionData }: LatestActionAdventureProps) {
    const [filter, setFilter] = useState('Movie');

    // Tampilkan hanya satu sumber data sesuai filter
    const showLatest = filter === 'Adventure';
    const showMovie = filter === 'Movie';

    return (
        <section className='py-6 px-4 sm:px-5'>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6 mb-10">
                {/* Filter buttons */}
                <div className="overflow-x-auto flex items-center justify-start md:justify-center w-full md:w-fit">
                    <div className="flex items-center justify-start md:justify-center gap-1 sm:gap-2 p-1 bg-secondary/20 dark:bg-secondary/10 rounded-xl border border-border w-fit md:max-w-full sm:min-w-0">
                        {FILTERS.map((f) => (
                            <motion.button
                                key={f}
                                whileInView={{ scale: [0.9, 1] }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3 }}
                                className={`relative px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors duration-200 capitalize cursor-pointer ${filter === f
                                    ? 'text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                onClick={() => setFilter(f)}
                            >
                                {filter === f && (
                                    <motion.div
                                        layoutId="activeProjectCategory"
                                        className="absolute inset-0 bg-primary rounded-lg"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30
                                        }}
                                    />
                                )}
                                <span className="relative z-10">{f}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {filter === "Movie" ? (
                    <Link
                        href={
                            filter === "Movie"
                                ? "/anime/movie"
                                : "/anime/latest-action-adventure"
                        }
                        className="mt-2 md:mt-0 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold flex items-center gap-2"
                    >
                        {filter === "Movie" ? "Lihat Semua Movie" : "Lihat Semua Adventure"}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ) : (
                    <Link
                        href={
                            filter === "Adventure"
                                ? "/anime/latest-action-adventure"
                                : "/anime/movie"
                        }
                        className="mt-2 md:mt-0 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold flex items-center gap-2"
                    >
                        {filter === "Movie" ? "Lihat Semua Movie" : "Lihat Semua Adventure"}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                )}
            </div>

            {/* Animated List */}
            <AnimatePresence mode="wait">
                {showLatest && (
                    <div
                        key="adventure"
                        className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5'
                    >
                        {latestAdventureActionData.map((item, idx) => (
                            <div
                                key={idx}
                                className="group h-full flex flex-col justify-end"
                            >
                                <Link
                                    href={`anime/${item.href}`}
                                    className="block h-full"
                                >
                                    <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer p-0 rounded-2xl overflow-hidden relative">
                                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                                            {item.poster ? (
                                                <Image
                                                    src={item.poster}
                                                    alt={item.title}
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
                                                    {item.title}
                                                </h5>

                                                <div className="flex justify-between items-center gap-2 text-xs md:text-sm text-gray-200">
                                                    <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full">
                                                        <BookOpen className="w-4 h-4" />
                                                        {item.type}
                                                    </span>

                                                    <span className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full">
                                                        Eps {item.episodes}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
                {showMovie && (
                    <div
                        key="action"
                        className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5'
                    >
                        {MovieActionData.map((item, idx) => (
                            <div
                                key={idx}
                                className="group h-full flex flex-col justify-end"
                            >
                                <Link
                                    href={`anime/${item.href}`}
                                    className="block h-full"
                                >
                                    <Card className="h-full bg-white dark:bg-gray-800 border-0 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer p-0 rounded-2xl overflow-hidden relative">
                                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                                            {item.poster ? (
                                                <Image
                                                    src={item.poster}
                                                    alt={item.title}
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
                                                    {item.title}
                                                </h5>

                                                <div className="flex justify-between items-center gap-2 text-xs md:text-sm text-gray-200">
                                                    <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full">
                                                        <BookOpen className="w-4 h-4" />
                                                        {item.type}
                                                    </span>

                                                    <span className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full">
                                                        {item.subType}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="absolute top-0 right-0 p-3 md:p-4 text-white">
                                                <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full">
                                                    <BookOpen className="w-4 h-4" />
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
