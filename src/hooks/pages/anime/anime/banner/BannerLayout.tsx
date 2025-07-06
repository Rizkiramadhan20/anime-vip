import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

import Link from 'next/link';

import Image from 'next/image';

interface BannerItem {
    animeId: string;
    image: string;
    title: string;
    description: string;
    href: string;
}

interface BannerLayoutProps {
    bannerList: BannerItem[];
    activeBanner: number;
    setActiveBanner: React.Dispatch<React.SetStateAction<number>>;
    router: any;
}

const textStagger = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
        },
    },
};

const textItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring" as const, stiffness: 80 } },
};

export default function BannerLayout({ bannerList, activeBanner, setActiveBanner, router }: BannerLayoutProps) {
    return (
        <section className="min-h-[50dvh] relative z-0">
            <div className="relative rounded-2xl overflow-hidden min-h-[50dvh] flex flex-col md:flex-row items-stretch group bg-background border border-border">
                {/* Background image with fade transition */}
                <AnimatePresence initial={false}>
                    {bannerList.map((item, idx) =>
                        idx === activeBanner ? (
                            <motion.img
                                key={item.animeId}
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-60"
                                style={{ transitionProperty: 'opacity' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7 }}
                            />
                        ) : null
                    )}
                </AnimatePresence>
                {/* Soft Overlay with theme card color */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-card/90 via-card/70 to-transparent rounded-2xl" />
                {/* Navigation Buttons - appear on hover only */}
                <div className="absolute right-4 bottom-4 z-30 flex flex-row gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        className="bg-card text-foreground border border-border rounded-full p-2 shadow transition-all duration-200 focus:outline-none hover:bg-card/80"
                        onClick={() => setActiveBanner((prev) => (prev - 1 + bannerList.length) % bannerList.length)}
                        aria-label="Previous Banner"
                        type="button"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <button
                        className="bg-card text-foreground border border-border rounded-full p-2 shadow transition-all duration-200 focus:outline-none hover:bg-card/80"
                        onClick={() => setActiveBanner((prev) => (prev + 1) % bannerList.length)}
                        aria-label="Next Banner"
                        type="button"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>
                {/* Card Content */}
                <motion.div
                    key={bannerList[activeBanner]?.animeId}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
                    className="relative z-30 w-full max-w-full md:max-w-lg px-4 md:pl-10 py-10 md:py-16"
                >
                    <Card className="bg-card/90 backdrop-blur border border-border shadow-none rounded-xl">
                        <CardContent className="p-4 md:p-6 flex flex-col gap-3 md:gap-4">
                            <motion.div
                                variants={textStagger}
                                initial="hidden"
                                animate="show"
                                className="flex flex-col gap-2 md:gap-3"
                            >
                                <motion.div variants={textItem}>
                                    <CardTitle className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2 line-clamp-2">
                                        {bannerList[activeBanner]?.title || "-"}
                                    </CardTitle>
                                </motion.div>
                                <motion.div variants={textItem}>
                                    <CardDescription className="text-base md:text-lg text-muted-foreground mb-1 md:mb-2 font-normal line-clamp-2">
                                        {bannerList[activeBanner]?.description || "-"}
                                    </CardDescription>
                                </motion.div>
                                <motion.div variants={textItem}>
                                    <Link href={`anime/${bannerList[activeBanner]?.href}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2 rounded-lg shadow-sm hover:bg-primary/90 transition-all duration-200 focus:ring-2 focus:ring-ring focus:outline-none mt-2 text-base cursor-pointer"
                                            onClick={() => bannerList[activeBanner]?.href && router.push(bannerList[activeBanner].href)}
                                        >
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-foreground text-primary mr-1 animate-pulse">
                                                <Play size={16} />
                                            </span>
                                            <span>Watch Now</span>
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* Character image (optional, minimal) */}
                <AnimatePresence>
                    {bannerList[activeBanner]?.image && (
                        <motion.div
                            key={bannerList[activeBanner]?.animeId + '-character'}
                            initial={{ opacity: 0, scale: 0.95, x: 30 }}
                            animate={{ opacity: 0.7, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 30 }}
                            transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
                            className="hidden md:block absolute right-8 bottom-8 h-2/3 md:h-3/4 z-20 pointer-events-none select-none"
                        >
                            <div className="relative h-full w-auto flex items-end">
                                <div className="backdrop-blur-md bg-card/70 rounded-xl border border-border p-2">
                                    <Image
                                        src={bannerList[activeBanner].image}
                                        width={400}
                                        height={400}
                                        loading='lazy'
                                        alt={bannerList[activeBanner].title}
                                        className="h-48 md:h-64 w-auto object-contain rounded-lg opacity-80 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
