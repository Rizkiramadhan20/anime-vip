import React from 'react'

import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card';

import { LatestRelease } from '@/interface/Anime';

import Image from 'next/image';

interface LatestProps {
    leatestAnichinData: LatestRelease;
}

export default function LatestRealese({ leatestAnichinData }: LatestProps) {
    return (
        <section className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6">
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Latest Realese</h3>
                <Link href={"/donghua/completed"} className="mt-2 md:mt-0 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-semibold flex items-center gap-2">
                    Lihat Semua
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {leatestAnichinData.animeList.map((i, index) => (
                    <Link key={index} href={`anime/${i.href}`}>
                        <Card className="bg-[var(--sidebar)]/80 backdrop-blur-xl border-[var(--sidebar-border)] shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer rounded-3xl overflow-hidden hover:scale-[1.03] p-0">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <div className="overflow-hidden rounded-t-3xl">
                                        <Image
                                            src={i.poster}
                                            alt={i.title}
                                            className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                                            width={1080}
                                            height={1080}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="absolute top-3 right-3 bg-[var(--destructive)] text-[var(--sidebar-foreground)] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        {i.type}
                                    </div>
                                </div>
                                <div className="py-6 px-4">
                                    <h4 className="font-bold text-base md:text-lg mb-1 text-[var(--sidebar-foreground)] group-hover:text-[var(--sidebar-primary)] transition-colors duration-300 line-clamp-1">
                                        {i.title}
                                    </h4>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    )
}
