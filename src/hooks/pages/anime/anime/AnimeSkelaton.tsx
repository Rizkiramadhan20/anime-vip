import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { Button } from '@/components/ui/button'

export default function AnimeSkelaton() {
    const initialCount = 28;

    return (
        <main className='py-6 px-4 sm:px-5'>
            <section className="min-h-[50dvh] relative">
                <div className="relative rounded-2xl overflow-hidden min-h-[50dvh] flex flex-col md:flex-row items-stretch group bg-background border border-border">
                    {/* Background skeleton */}
                    <Skeleton className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-60" />
                    {/* Soft Overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-card/90 via-card/70 to-transparent rounded-2xl" />
                    {/* Navigation Buttons skeleton */}
                    <div className="absolute right-4 bottom-4 z-30 flex flex-row gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                    {/* Card Content Skeleton */}
                    <div className="relative z-30 w-full max-w-full md:max-w-lg px-4 md:pl-10 py-10 md:py-16">
                        <div className="bg-card/90 backdrop-blur border border-border shadow-none rounded-xl">
                            <div className="p-4 md:p-6 flex flex-col gap-3 md:gap-4">
                                <div className="flex flex-col gap-2 md:gap-3">
                                    <Skeleton className="h-8 md:h-10 w-3/4 mb-2 rounded" /> {/* Title */}
                                    <Skeleton className="h-5 md:h-6 w-2/3 mb-2 rounded" /> {/* Description */}
                                    <Skeleton className="h-10 w-32 mt-2 rounded-lg" /> {/* Button */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Character image skeleton (desktop only) */}
                    <div className="hidden md:block absolute right-8 bottom-8 h-2/3 md:h-3/4 z-20 pointer-events-none select-none">
                        <div className="relative h-full w-auto flex items-end">
                            <div className="backdrop-blur-md bg-card/70 rounded-xl border border-border p-2">
                                <Skeleton className="h-48 md:h-64 w-40 md:w-56 object-contain rounded-lg opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='mt-10'>
                <div className="flex flex-col gap-8 md:gap-10">
                    <div className='border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6'>
                        <Skeleton className="h-8 w-40 md:h-10 md:w-60 rounded" />
                    </div>
                    <div className="grid grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[22%] xl:auto-cols-[20%] gap-5 px-1 md:px-0">
                        {[...Array(6)].map((_, idx) => (
                            <div key={idx} className="group h-full flex flex-col justify-end">
                                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                                <div className="mt-2 space-y-2">
                                    <Skeleton className="h-5 w-3/4 rounded" />
                                    <Skeleton className="h-4 w-1/2 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-8">
                {/* Header skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 md:pb-6">
                    <Skeleton className="h-8 w-48 md:w-64 rounded" />
                    <Skeleton className="h-6 w-32 rounded" />
                </div>

                {/* Grid skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[...Array(4)].map((_, idx) => (
                        <Card key={idx} className="bg-[var(--sidebar)]/80 backdrop-blur-xl border-[var(--sidebar-border)] shadow-lg rounded-3xl overflow-hidden p-0">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <div className="overflow-hidden rounded-t-3xl">
                                        <Skeleton className="w-full h-48 md:h-56 object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300" />
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <Skeleton className="h-6 w-12 rounded-full" />
                                    </div>
                                </div>
                                <div className="py-6 px-4">
                                    <Skeleton className="h-6 w-32 mb-1 rounded" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className='mt-10'>
                {/* Header skeleton (season switcher) */}
                <div className="overflow-x-auto flex items-center justify-start md:justify-center mb-10 w-full md:w-fit">
                    <div className="flex items-center justify-start md:justify-center gap-1 sm:gap-2 p-1 bg-secondary/20 dark:bg-secondary/10 rounded-xl border border-border w-fit md:max-w-full sm:min-w-0">
                        {[...Array(3)].map((_, idx) => (
                            <Skeleton key={idx} className="h-8 w-24 sm:w-32 rounded-lg" />
                        ))}
                    </div>
                </div>
                {/* Anime Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                    {[...Array(5)].map((_, idx) => (
                        <Card
                            key={idx}
                            className="relative overflow-hidden border border-border bg-card p-0 shadow-sm group h-full"
                        >
                            {/* Image skeleton */}
                            <div className="relative w-full aspect-[3/4] h-52 sm:h-full">
                                <Skeleton className="w-full h-full object-cover rounded-t-lg" />
                                {/* Overlay for title and genres */}
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm px-2 sm:px-3 py-4 sm:py-8 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                                    <Skeleton className="h-4 w-32 mb-2 rounded" />
                                    <div className="flex flex-wrap gap-1 mb-2 sm:mb-4 mt-2 sm:mt-4">
                                        {[...Array(2)].map((_, i) => (
                                            <Skeleton key={i} className="h-3 w-12 rounded" />
                                        ))}
                                    </div>
                                    <Skeleton className="h-7 w-24 rounded-lg" />
                                </div>
                                {/* Score badge skeleton */}
                                <span className="absolute top-2 left-2 flex items-center gap-1 bg-primary/90 text-primary-foreground rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-bold shadow-md backdrop-blur-sm">
                                    <Skeleton className="h-4 w-8 rounded-full" />
                                </span>
                            </div>
                            {/* Rank badge skeleton */}
                            <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-primary text-primary-foreground rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold shadow-md">
                                <Skeleton className="h-4 w-8 rounded-full" />
                            </span>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="py-6 px-4 sm:px-5">
                {/* Header skeleton */}
                <div className='flex justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-6'>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>

                <div className="relative mt-10">
                    {/* Navigation Buttons Skeleton */}
                    <Skeleton className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700" />
                    <Skeleton className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700" />

                    {/* Gradient Edges Skeleton (just divs for layout) */}
                    <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-white/80 dark:from-gray-900/80 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-white/80 dark:from-gray-900/80 to-transparent z-10 pointer-events-none" />

                    {/* Horizontal Scroll Skeleton */}
                    <div className="w-full overflow-x-auto touch-pan-x select-none scrollbar-hide pb-4">
                        <div className="flex gap-5">
                            {[...Array(5)].map((_, idx) => (
                                <div key={idx} className="flex-none group w-[180px] sm:w-[220px] lg:w-[260px] xl:w-[300px]">
                                    <Card className="h-full bg-white dark:bg-gray-900 shadow-md p-0 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                                        <CardHeader className="p-0">
                                            <div className="relative aspect-[3/4] w-full overflow-hidden">
                                                <Skeleton className="absolute inset-0 w-full h-full object-cover" />
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 transition-opacity duration-300" />
                                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10">
                                                    <Skeleton className="h-5 w-32 mb-2 rounded" />
                                                    <div className="flex justify-between items-center gap-2">
                                                        <Skeleton className="h-4 w-16 rounded-full" />
                                                        <Skeleton className="h-4 w-16 rounded-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className='py-6 px-4 sm:px-5'>
                {/* Header skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 border-b border-border pb-4 md:pb-6">
                    <Skeleton className="h-8 w-40 md:h-10 md:w-60 rounded" />
                    <Skeleton className="h-6 w-32 rounded" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10">
                    {[...Array(12)].map((_, idx) => (
                        <Card key={idx} className="group hover:shadow-lg transition-all duration-300 cursor-pointer p-0">
                            <CardContent className="p-0">
                                <div className="relative overflow-hidden">
                                    <Skeleton className="w-full h-48 object-cover" />
                                    <div className="absolute top-2 left-2">
                                        <Skeleton className="px-2 py-1 h-5 w-14 rounded-full" />
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <Skeleton className="px-2 py-1 h-5 w-14 rounded-full" />
                                    </div>
                                </div>
                                <div className="p-3">
                                    <Skeleton className="h-5 w-32 mb-2 rounded" />
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        <Skeleton className="h-4 w-12 rounded" />
                                        <Skeleton className="h-4 w-16 rounded" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className='py-6 px-4 sm:px-5'>
                {/* Header skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/60 pb-6 md:pb-8 mb-8">
                    <div>
                        <Skeleton className="h-8 w-40 md:h-10 md:w-60 rounded mb-2" />
                        <Skeleton className="h-5 w-60 md:w-80 rounded" />
                    </div>
                </div>

                {/* Genres grid skeleton */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-5'>
                    {[...Array(initialCount)].map((_, idx) => (
                        <Button
                            key={idx}
                            variant="ghost"
                            className="h-auto p-0 group relative overflow-hidden"
                            disabled
                        >
                            <Card className='w-full h-full group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm'>
                                <CardContent className='p-5 text-center relative z-10'>
                                    <div className='flex justify-center mb-4'>
                                        <div className='p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 shadow-sm'>
                                            <Skeleton className='w-6 h-6 rounded' />
                                        </div>
                                    </div>
                                    <Skeleton className='h-5 w-20 mx-auto rounded' />
                                </CardContent>
                                {/* Subtle background gradient on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </Card>
                        </Button>
                    ))}
                </div>

                {/* Learn More Button Skeleton */}
                <div className="flex justify-center mt-8">
                    <Skeleton className="h-10 w-40 rounded" />
                </div>
            </section>
        </main>
    )
}
