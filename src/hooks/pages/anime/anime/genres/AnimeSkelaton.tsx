import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AnimeSkelaton() {
    const initialCount = 28;
    return (
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
    )
}
