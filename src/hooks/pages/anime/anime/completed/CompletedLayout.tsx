"use client"

import React, { useMemo, useState, useRef } from 'react'

import { CompletedAnimeItem } from '@/interface/Anime';

import { Card, CardContent } from '@/components/ui/card';

import Image from 'next/image';

import Link from 'next/link';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

interface GenresContentProps {
    completedData: CompletedAnimeItem[];
}

export default function CompletedLayout({ completedData }: GenresContentProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 8;
    const sectionRef = useRef<HTMLElement>(null);

    // Pagination
    const totalPages = Math.ceil(completedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        return completedData.slice(startIdx, startIdx + itemsPerPage);
    }, [completedData, currentPage]);

    // Fungsi scroll ke atas ke section
    const scrollToSection = () => {
        const el = document.getElementById('completed-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section ref={sectionRef} className='py-6 px-4 sm:px-5' id="completed-section">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 border-b border-border pb-4 md:pb-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Anime Completed</h3>
                </div>
                <Link href={"/anime/completed"} className="mt-2 md:mt-0 text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-200 font-semibold flex items-center gap-2">
                    Lihat Semua
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10'>
                {
                    paginatedData.map((item, idx) => {
                        return (
                            <Card key={idx} className="group hover:shadow-lg transition-all duration-300 cursor-pointer p-0">
                                <Link href={`anime/${item.href}`}>
                                    <CardContent className="p-0">
                                        <div className="relative overflow-hidden">
                                            <Image
                                                width={1080}
                                                height={1080}
                                                src={item.poster}
                                                alt={item.title}
                                                className="w-full h-48 object-cover group-hover:brightness-75 group-hover:scale-105 transition-all duration-300"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.sub === 'Dub'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-secondary text-secondary-foreground'
                                                    }`}>
                                                    {item.sub}
                                                </span>
                                            </div>
                                            {item.status && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-background/80 text-foreground backdrop-blur-sm">
                                                        {item.status}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h4>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                                                    {item.type}
                                                </span>
                                                {item.status && (
                                                    <span className={`px-2 py-1 text-xs rounded ${item.status === 'Completed'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        )
                    })
                }
            </div>

            {/* Page info */}
            <div className='flex justify-between mt-5'>
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center text-sm text-muted-foreground font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault();
                                            setCurrentPage(p => {
                                                const newPage = Math.max(1, p - 1);
                                                if (newPage !== p) scrollToSection();
                                                return newPage;
                                            });
                                        }}
                                        aria-disabled={currentPage === 1}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === i + 1}
                                            onClick={e => {
                                                e.preventDefault();
                                                if (currentPage !== i + 1) {
                                                    setCurrentPage(i + 1);
                                                    scrollToSection();
                                                }
                                            }}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault();
                                            setCurrentPage(p => {
                                                const newPage = Math.min(totalPages, p + 1);
                                                if (newPage !== p) scrollToSection();
                                                return newPage;
                                            });
                                        }}
                                        aria-disabled={currentPage === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </section>
    )
}