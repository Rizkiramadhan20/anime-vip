import React from 'react'

import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { LatestRelease } from '@/interface/Anime';

import { Play } from 'lucide-react';

interface LatestProps {
    leatestAnichinData: LatestRelease;
}

export default function LatestRealese({ leatestAnichinData }: LatestProps) {
    return (
        <section className='flex flex-col gap-6 md:gap-8'>
            <div className='flex justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6'>
                <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>Completed Donghua</h3>
                <Link href={"/donghua/completed"} className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium flex items-center gap-2'>
                    Lihat Semua
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {leatestAnichinData.animeList.map((i, index) => (
                    <Card key={index} className="bg-[var(--sidebar)]/80 backdrop-blur-xl border-[var(--sidebar-border)] hover:bg-[var(--sidebar)] transition-all duration-300 group cursor-pointer rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 p-0">
                        <CardContent className="p-0">
                            <div className="relative">
                                <div className='overflow-hidden'>
                                    <img
                                        src={i.poster}
                                        alt="Anime"
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="absolute top-3 right-3 bg-[var(--destructive)] text-[var(--sidebar-foreground)] text-xs font-bold px-2 py-1 rounded-full">
                                    {i.type}
                                </div>

                                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Button size="sm" className="w-full bg-[var(--sidebar-accent)]/20 backdrop-blur-sm hover:bg-[var(--sidebar-accent)]/30 text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)]">
                                        <Play size={16} className="mr-2" />
                                        Watch
                                    </Button>
                                </div>
                            </div>
                            <div className="py-7 px-4">
                                <h4 className="font-bold mb-2 text-[var(--sidebar-foreground)] group-hover:text-[var(--sidebar-primary)] transition-colors duration-300 line-clamp-1">
                                    {i.title}
                                </h4>

                                <span>EP {Math.floor(Math.random() * 24) + 1}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
