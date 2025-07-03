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
        <section className='min-h-[60dvh]'>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[60dvh] flex flex-col md:flex-row items-stretch group">
                {/* Background image with fade transition */}
                <AnimatePresence initial={false}>
                    {bannerList.map((item, idx) =>
                        idx === activeBanner ? (
                            <motion.img
                                key={item.animeId}
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                                style={{ transitionProperty: 'opacity' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7 }}
                            />
                        ) : null
                    )}
                </AnimatePresence>
                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10 backdrop-blur-md" />
                {/* Navigation Buttons di pojok kanan bawah */}
                <div className="absolute right-3 bottom-3 md:right-6 md:bottom-6 z-30 flex flex-row gap-2">
                    <button
                        className="bg-black/40 hover:bg-black/70 text-white rounded-full p-2 md:p-2.5 shadow-lg transition-all duration-200 focus:outline-none"
                        onClick={() => setActiveBanner((prev) => (prev - 1 + bannerList.length) % bannerList.length)}
                        aria-label="Previous Banner"
                        type="button"
                    >
                        <ChevronLeft size={24} className="md:size-[28px]" />
                    </button>
                    <button
                        className="bg-black/40 hover:bg-black/70 text-white rounded-full p-2 md:p-2.5 shadow-lg transition-all duration-200 focus:outline-none"
                        onClick={() => setActiveBanner((prev) => (prev + 1) % bannerList.length)}
                        aria-label="Next Banner"
                        type="button"
                    >
                        <ChevronRight size={24} className="md:size-[28px]" />
                    </button>
                </div>
                {/* Card Content */}
                <motion.div
                    key={bannerList[activeBanner]?.animeId}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
                    className="relative z-20 w-full max-w-full md:max-w-xl px-4 md:pl-10 py-10 md:py-20"
                >
                    <Card className="bg-transparent shadow-none border-none">
                        <CardContent className="p-0 flex flex-col gap-3 md:gap-4">
                            <motion.div
                                variants={textStagger}
                                initial="hidden"
                                animate="show"
                                className="flex flex-col gap-3 md:gap-4"
                            >
                                <motion.div variants={textItem}>
                                    <CardTitle className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold line-clamp-2 text-white mb-2 md:mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] transition-all duration-500">
                                        {bannerList[activeBanner]?.title || "-"}
                                    </CardTitle>
                                </motion.div>
                                <motion.div variants={textItem}>
                                    <CardDescription className="text-base sm:text-lg md:text-xl text-gray-200 mb-2 md:mb-4 font-medium line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-500">
                                        {bannerList[activeBanner]?.description || "-"}
                                    </CardDescription>
                                </motion.div>
                                <motion.div variants={textItem}>
                                    <Link href={`anime/${bannerList[activeBanner]?.href}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex items-center gap-2 md:gap-3 bg-white/90 text-purple-700 font-bold px-5 py-3 md:px-8 md:py-6 rounded-2xl shadow-xl hover:bg-purple-700 hover:text-white hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-purple-300 focus:outline-none mt-2 cursor-pointer text-base md:text-lg"
                                            onClick={() => bannerList[activeBanner]?.href && router.push(bannerList[activeBanner].href)}
                                        >
                                            <span className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-700 text-white shadow-lg mr-1 md:mr-2 animate-pulse">
                                                <Play size={18} className="md:size-[22px]" />
                                            </span>
                                            <span className="font-semibold">Watch Now</span>
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* Character image (optional, jika ada di data) */}
                <AnimatePresence>
                    {bannerList[activeBanner]?.image && (
                        <motion.div
                            key={bannerList[activeBanner]?.animeId + '-character'}
                            initial={{ opacity: 0, scale: 0.95, x: 40 }}
                            animate={{ opacity: 0.9, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 40 }}
                            transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
                            className="hidden md:block absolute right-0 bottom-0 h-2/3 md:h-full z-20 pointer-events-none select-none"
                        >
                            <Image
                                src={bannerList[activeBanner].image}
                                width={1080}
                                height={1080}
                                loading='lazy'
                                alt={bannerList[activeBanner].title}
                                className="h-full object-contain drop-shadow-2xl scale-110 md:scale-125 opacity-90 transition-transform duration-700"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
