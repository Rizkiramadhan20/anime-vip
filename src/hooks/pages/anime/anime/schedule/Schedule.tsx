"use client"

import React, { useState } from 'react';

import { Schedule as ScheduleType, ScheduleItem } from '@/interface/Anime';

import { Card } from '@/components/ui/card';

import ImagePlaceholder from '@/base/helper/ImagePlaceholder';

import { motion } from "framer-motion";

import Image from 'next/image';

import Link from 'next/link';

const seasons = [
    { label: 'Airing now', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'All Time', value: 'all' },
];

interface ScheduleProps {
    schedule: ScheduleType;
}

export default function Schedule({ schedule }: ScheduleProps) {
    const [selectedSeason, setSelectedSeason] = useState('weekly');

    let animeList: ScheduleItem[] = [];
    if (selectedSeason === 'weekly') animeList = schedule?.weekly || [];
    else if (selectedSeason === 'monthly') animeList = schedule?.monthly || [];
    else if (selectedSeason === 'all') animeList = schedule?.all || [];

    return (
        <section>
            <div className="overflow-x-auto flex items-center justify-start md:justify-center mb-10 w-full md:w-fit">
                <div className="flex items-center justify-start md:justify-center gap-1 sm:gap-2 p-1 bg-secondary/20 dark:bg-secondary/10 rounded-xl border border-border w-fit md:max-w-full sm:min-w-0">
                    {seasons.map((season) => (
                        <motion.button
                            key={season.value}
                            whileInView={{ scale: [0.9, 1] }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                            className={`relative px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors duration-200 capitalize cursor-pointer ${selectedSeason === season.value
                                ? 'text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setSelectedSeason(season.value)}
                        >
                            {selectedSeason === season.value && (
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
                            <span className="relative z-10">{season.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Anime Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {animeList.map((anime) => (
                    <Card
                        key={anime.animeId}
                        className="relative overflow-hidden border border-border bg-card p-0 shadow-sm hover:shadow-lg transition-all duration-200 group h-full"
                    >
                        {anime.poster ? (
                            <div className="relative w-full aspect-[3/4] h-52 sm:h-full">
                                <Image
                                    src={anime.poster}
                                    alt={anime.title}
                                    fill
                                    loading='lazy'
                                    className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
                                />
                                {/* Overlay for title and genres */}
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm px-2 sm:px-3 py-4 sm:py-8 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                                    <div className="font-semibold text-white text-xs sm:text-sm truncate">
                                        {anime.title}
                                    </div>

                                    <div className="text-[10px] sm:text-xs flex flex-wrap gap-1 mb-2 sm:mb-4 mt-2 sm:mt-4">
                                        {
                                            anime.genres.map((Item, idx) => {
                                                const slug = Item.toLowerCase().replace(/\s+/g, '-');
                                                return (
                                                    <Link
                                                        key={idx}
                                                        href={`/anime/genres/${slug}`}
                                                        className="inline-block rounded bg-primary/20 px-1.5 sm:px-2 py-0.5 text-white hover:bg-primary/40 transition-colors duration-150"
                                                    >
                                                        {Item}
                                                    </Link>
                                                )
                                            })
                                        }
                                    </div>
                                    {/* Watch Now button */}
                                    <Link
                                        href={`/anime/${anime.href}`}
                                        className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold shadow hover:bg-primary/80 transition-colors duration-150"
                                    >
                                        Watch Now
                                    </Link>
                                </div>
                                {/* Score badge inside image */}
                                <span className="absolute top-2 left-2 flex items-center gap-1 bg-primary/90 text-primary-foreground rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-bold shadow-md backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-yellow-300 drop-shadow">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                    </svg>
                                    {anime.score}
                                </span>
                            </div>
                        ) : (
                            <div className="relative w-full h-36 flex items-center justify-center bg-muted text-muted-foreground text-lg font-bold rounded-t-lg p-0">
                                <ImagePlaceholder className="absolute inset-0 w-full h-full" />
                                {/* Overlay for title and genres */}
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                                    <div className="text-[10px] sm:text-xs flex flex-wrap gap-1 mb-0.5">
                                        {anime.genres.map((Item, idx) => {
                                            const slug = Item.toLowerCase().replace(/\s+/g, '-');
                                            return (
                                                <Link
                                                    key={idx}
                                                    href={`/genres/${slug}`}
                                                    className="inline-block rounded bg-primary/20 px-1.5 sm:px-2 py-0.5 text-primary-foreground hover:bg-primary/40 transition-colors duration-150"
                                                >
                                                    {Item}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="font-semibold text-white text-xs sm:text-sm truncate">
                                        {anime.title}
                                    </div>
                                    {/* Watch Now button */}
                                    <Link
                                        href={`/anime/${anime.animeId}`}
                                        className="inline-block mt-1 sm:mt-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold shadow hover:bg-primary/80 transition-colors duration-150"
                                    >
                                        Watch Now
                                    </Link>
                                </div>
                                {/* Score badge inside no-image */}
                                <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-primary/90 text-primary-foreground rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-bold shadow-md backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-yellow-300 drop-shadow">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                    </svg>
                                    {anime.score}
                                </span>
                            </div>
                        )}
                        {/* Rank badge */}
                        <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-primary text-primary-foreground rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold shadow-md">#{anime.rank}</span>
                    </Card>
                ))}
            </div>
        </section>
    );
}
