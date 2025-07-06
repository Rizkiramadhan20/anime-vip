"use client"

import React, { useState } from 'react'

import Link from 'next/link'

import { GenresItem } from '@/interface/Anime';

import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import {
    Sword,
    Tv,
    Users,
    Compass,
    Laugh,
    Shield,
    Skull,
    Ghost,
    Drama,
    Gamepad2,
    Wand2,
    School2,
    Brain,
    Heart,
    Zap,
    Clock,
    BookOpen,
    Car,
    Baby,
    Award,
    Sparkles,
    ChefHat,
    Users2,
    Search,
    GraduationCap,
    Eye,
    Crown,
    Star,
    Palette,
    Target,
    Trophy,
    Mountain,
    Briefcase,
    LucideIcon,
    UserX,
    HeartHandshake,
    UserCog,
    HeartCrack,
    Cpu,
    Stethoscope,
    Music,
    Monitor,
    Copy,
    Theater,
    PawPrint,
    RotateCcw,
    DoorOpen,
    User,
    Mic,
    Coffee,
    Satellite,
    Atom,
    AlertTriangle,
    Droplets,
    Building,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface GenresContentProps {
    GenresData: {
        genreList: GenresItem[];
    };
}

// Icon mapping for each genre
const genreIcons: Record<string, LucideIcon> = {
    'action': Sword,
    'adult-cast': Users,
    'adventure': Compass,
    'animation': Tv,
    'anthropomorphic': PawPrint,
    'avant-garde': Sparkles,
    'award-winning': Award,
    'boys-love': Heart,
    'cgdct': Users2,
    'childcare': Baby,
    'combat-sports': Zap,
    'comedy': Laugh,
    'crossdressing': UserCog,
    'delinquents': UserX,
    'detective': Search,
    'drama': Drama,
    'ecchi': Eye,
    'educational': GraduationCap,
    'erotica': Eye,
    'fantasy': Wand2,
    'gag-humor': Laugh,
    'girls-love': Heart,
    'gore': Skull,
    'gourmet': ChefHat,
    'harem': HeartHandshake,
    'high-stakes-game': Target,
    'historical': BookOpen,
    'horror': Ghost,
    'idols-female': Star,
    'idols-male': Star,
    'isekai': DoorOpen,
    'iyashikei': Coffee,
    'josei': User,
    'kids': Baby,
    'love-polygon': HeartHandshake,
    'love-status-quo': HeartCrack,
    'magical-sex-shift': Sparkles,
    'mahou-shoujo': Wand2,
    'martial-arts': Zap,
    'mecha': Cpu,
    'medical': Stethoscope,
    'military': Shield,
    'music': Music,
    'mystery': Search,
    'mythology': BookOpen,
    'organized-crime': Shield,
    'otaku-culture': Monitor,
    'parody': Copy,
    'performing-arts': Theater,
    'pets': PawPrint,
    'psychological': Brain,
    'racing': Car,
    'reincarnation': RotateCcw,
    'reverse-harem': Heart,
    'romance': Heart,
    'romantic-subtext': Heart,
    'samurai': Sword,
    'school': School2,
    'sci-fi': Atom,
    'seinen': User,
    'shoujo': Heart,
    'shounen': User,
    'showbiz': Mic,
    'slice-of-life': Coffee,
    'space': Satellite,
    'sports': Trophy,
    'strategy-game': Target,
    'super-power': Zap,
    'supernatural': Ghost,
    'survival': Mountain,
    'suspense': AlertTriangle,
    'team-sports': Users,
    'thriller': AlertTriangle,
    'time-travel': Clock,
    'urban-fantasy': Building,
    'vampire': Droplets,
    'video-game': Gamepad2,
    'villainess': Crown,
    'visual-arts': Palette,
    'workplace': Briefcase
};

export default function GenresLayout({ GenresData }: GenresContentProps) {
    const [showAll, setShowAll] = useState(false);
    const initialCount = 24;
    const displayedGenres = showAll ? GenresData.genreList : GenresData.genreList.slice(0, initialCount);

    return (
        <section className='py-6 px-4 sm:px-5'>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/60 pb-6 md:pb-8 mb-8">
                <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                        Anime Genres
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Explore different anime genres and discover your next favorite series
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-5'>
                {displayedGenres.map((item, idx) => {
                    const IconComponent = genreIcons[item.genreId] || BookOpen;

                    return (
                        <Button
                            key={idx}
                            variant="ghost"
                            className="h-auto p-0 group relative overflow-hidden"
                            asChild
                        >
                            <Link href={`anime/genres/${item.href}`}>
                                <Card className='w-full h-full group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 hover:bg-card backdrop-blur-sm'>
                                    <CardContent className='p-5 text-center relative z-10'>
                                        <div className='flex justify-center mb-4'>
                                            <div className='p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 shadow-sm group-hover:shadow-md'>
                                                <IconComponent
                                                    className='w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300'
                                                    strokeWidth={1.8}
                                                />
                                            </div>
                                        </div>
                                        <h3 className='font-semibold text-sm text-card-foreground group-hover:text-primary transition-colors duration-300 leading-tight'>
                                            {item.title}
                                        </h3>
                                    </CardContent>
                                    {/* Subtle background gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </Card>
                            </Link>
                        </Button>
                    )
                })}
            </div>

            {/* Learn More Button */}
            {GenresData.genreList.length > initialCount && (
                <div className="flex justify-center mt-8">
                    <Button
                        onClick={() => setShowAll(!showAll)}
                        variant="outline"
                        className="px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-primary"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp className="w-4 h-4 mr-2" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 mr-2" />
                                Learn More ({GenresData.genreList.length - initialCount} more)
                            </>
                        )}
                    </Button>
                </div>
            )}
        </section>
    )
}
