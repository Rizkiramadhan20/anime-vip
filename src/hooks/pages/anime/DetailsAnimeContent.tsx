"use client"

import React, { useState } from 'react'

import Link from 'next/link'

import Image from 'next/image'

import { Search, Bookmark, Star, HelpCircle } from 'lucide-react'

import { useRouter } from 'next/navigation'

import { AnimeBySlugData } from '@/interface/Anime'

import LoadingOverlay from '@/base/loading/LoadingOverlay'

import { formatSlug } from "@/base/helper/anime/FormatSlug"

import { useAuth } from '@/utils/context/AuthContext'

import ImagePlaceholder from '@/base/helper/ImagePlaceholder'

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface DetailsAnimeContentProps {
    animeData: AnimeBySlugData;
}

// Star Rating Component
const StarRating = ({ score }: { score: string | number }) => {
    const numericScore = typeof score === 'string' ? parseFloat(score) : score;
    const fullStars = Math.floor(numericScore / 2);
    const hasHalfStar = (numericScore % 2) >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            {hasHalfStar && (
                <div className="relative">
                    <Star className="w-4 h-4 text-gray-300" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                {numericScore.toFixed(1)}
            </span>
        </div>
    );
};

export default function DetailsAnimeContent({ animeData }: DetailsAnimeContentProps) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const { user } = useAuth();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setLoadingId(href);
        setLoadingProgress(0);

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setLoadingProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                router.push(href);
            }
        }, 100);
    };

    const filteredEpisodes = (animeData.episodeList ?? []).filter((ep) => {
        if (!ep || ep.fullTitle === undefined || ep.fullTitle === null) return false;

        const titleStr = ep.fullTitle.toString().toLowerCase();
        const searchStr = search.toLowerCase();
        const episodeNumber = ep.eps?.toString() || '';

        // Format episode number with leading zeros
        const formatEpisodeNumber = (num: string) => {
            const episodeNum = parseInt(num);
            if (isNaN(episodeNum)) return num;

            if (episodeNum < 100) {
                return episodeNum.toString().padStart(2, '0'); // 01, 02, ..., 99
            } else {
                return episodeNum.toString(); // 100, 101, etc.
            }
        };

        const formattedEpisodeNum = formatEpisodeNumber(episodeNumber);

        return (
            titleStr.includes(searchStr) ||
            `episode ${titleStr}`.includes(searchStr) ||
            `e${titleStr}`.includes(searchStr) ||
            `episode ${episodeNumber}`.includes(searchStr) ||
            `episode ${formattedEpisodeNum}`.includes(searchStr) ||
            `e${episodeNumber}`.includes(searchStr) ||
            `e${formattedEpisodeNum}`.includes(searchStr) ||
            episodeNumber.includes(searchStr) ||
            formattedEpisodeNum.includes(searchStr)
        );
    });

    // Extract YouTube video ID from trailer URL
    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const trailerVideoId = animeData.trailer ? getYouTubeVideoId(animeData.trailer) : null;

    return (
        <section className='py-6'>
            <LoadingOverlay
                isLoading={!!loadingId || loadingProgress > 0}
                message="Loading in progress"
                progress={loadingProgress}
            />
            <div className="container px-4">
                <div className="relative w-full aspect-[32/9] rounded-2xl overflow-hidden shadow-lg mb-6 md:mb-8">
                    {animeData.thumbnail ? (
                        <Image
                            src={animeData.thumbnail}
                            alt={animeData.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <ImagePlaceholder className="w-full h-full" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gray-800/80 text-white text-xs px-2 py-1 rounded font-semibold">{animeData.status}</span>
                            <span className="bg-gray-800/80 text-white text-xs px-2 py-1 rounded font-semibold">{animeData.duration}</span>
                            <span className="bg-gray-800/80 text-white text-xs px-2 py-1 rounded font-semibold">{animeData.type}</span>
                            <span className="bg-gray-800/80 text-white text-xs px-2 py-1 rounded font-semibold">
                                {animeData.episodes || (animeData.episodeList ? animeData.episodeList.length : '?')} Episodes
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{animeData.title}</h1>
                        <div className="flex items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 md:px-6 py-2 rounded-full font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition text-sm md:text-base">Play all episodes</button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <p>Start watching from the first episode</p>
                                    </TooltipContent>
                                </Tooltip>

                                {trailerVideoId && (
                                    <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DialogTrigger asChild>
                                                    <button className="bg-gray-800/60 text-white px-4 md:px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-700/80 transition text-sm md:text-base flex items-center gap-2">
                                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        Watch Trailer
                                                    </button>
                                                </DialogTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                <p>Watch the official trailer</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-gradient-to-br from-card via-background to-card border border-border shadow-2xl backdrop-blur-sm overflow-hidden">
                                            <div className="relative">
                                                {/* Animated background elements */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-pulse" />
                                                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-chart-1/30 to-chart-2/30 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
                                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-chart-3/30 to-chart-4/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />

                                                {/* Header with gradient overlay */}
                                                <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-card/90 via-background/60 to-transparent h-24 pointer-events-none" />

                                                {/* Title with theme colors */}
                                                <div className="absolute top-4 left-4 z-20">
                                                    <h2 className="text-xl md:text-2xl font-bold drop-shadow-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                                        {animeData.title}
                                                    </h2>
                                                    <p className="text-sm md:text-base font-medium bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                                                        Official Trailer
                                                    </p>
                                                </div>

                                                {/* Video container with theme border */}
                                                <div className="relative w-full aspect-video bg-black mx-4 mt-20 mb-4 rounded-2xl overflow-hidden border-2 border-primary shadow-2xl">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-card/20 via-background/20 to-accent/20 pointer-events-none" />
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${trailerVideoId}?autoplay=1&rel=0&modestbranding=1`}
                                                        title={`${animeData.title} Trailer`}
                                                        className="w-full h-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>

                                                {/* Bottom gradient overlay with theme colors */}
                                                <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-card/80 via-background/40 to-transparent h-20 pointer-events-none" />

                                                {/* Decorative elements with theme colors */}
                                                <div className="absolute top-8 right-8 w-2 h-2 bg-chart-1 rounded-full animate-ping" />
                                                <div className="absolute bottom-8 left-8 w-3 h-3 bg-chart-3 rounded-full animate-pulse" />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}

                                <div className="flex items-center gap-3">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                className={`bg-gray-800/60 p-2 rounded-full text-white hover:bg-gray-700/80 transition flex items-center justify-center disabled:opacity-50`}
                                                aria-label="Bookmark"
                                            >
                                                <Bookmark className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Add to bookmarks</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="col-span-1">
                        <div className="relative aspect-[3/4] w-full mx-auto rounded-xl overflow-hidden shadow-lg">
                            {animeData.poster ? (
                                <Image
                                    src={animeData.poster}
                                    alt={animeData.title}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority
                                />
                            ) : (
                                <ImagePlaceholder className="w-full h-full" />
                            )}
                        </div>
                        <Card className="mt-6">
                            <CardContent className="p-4 md:p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Japanese:</span>
                                        <span className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">{animeData.japanese || 'N/A'}</span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Score:</span>
                                        <span className="text-gray-900 dark:text-gray-100">
                                            {animeData.score && animeData.score.trim() !== '' ? (
                                                <StarRating score={animeData.score} />
                                            ) : (
                                                'N/A'
                                            )}
                                        </span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Status:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{animeData.status || 'N/A'}</span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Episodes:</span>
                                        <span className="text-gray-900 dark:text-gray-100">
                                            {animeData.episodes || (animeData.episodeList ? animeData.episodeList.length : 'N/A')}
                                        </span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Duration:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{animeData.duration || 'N/A'}</span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Aired:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{animeData.aired || 'N/A'}</span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Studios:</span>
                                        <span className="text-gray-900 dark:text-gray-100">
                                            {animeData.studios && animeData.studios.length > 0
                                                ? animeData.studios.map((studio, idx) => (
                                                    <Link href={studio.url} key={studio.name + idx} className="text-blue-600 dark:text-blue-400 hover:underline">{studio.name}{idx < animeData.studios.length - 1 ? ', ' : ''}</Link>
                                                ))
                                                : 'N/A'}
                                        </span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Producers:</span>
                                        <span className="text-gray-900 dark:text-gray-100">
                                            {animeData.producers && animeData.producers.length > 0
                                                ? animeData.producers.map((producer, idx) => (
                                                    <Link href={producer.url} key={producer.name + idx} className="text-blue-600 dark:text-blue-400 hover:underline">{producer.name}{idx < animeData.producers.length - 1 ? ', ' : ''}</Link>
                                                ))
                                                : 'N/A'}
                                        </span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Director:</span>
                                        <span className="text-gray-900 dark:text-gray-100">
                                            {animeData.director && animeData.director.length > 0
                                                ? animeData.director.map((director, idx) => (
                                                    <Link href={director.url} key={director.name + idx} className="text-blue-600 dark:text-blue-400 hover:underline">{director.name}{idx < animeData.director.length - 1 ? ', ' : ''}</Link>
                                                ))
                                                : 'N/A'}
                                        </span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Released:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{animeData.releasedOn || 'N/A'}</span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Updated:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{animeData.updatedOn || 'N/A'}</span>

                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Season:</span>
                                        <span className="text-gray-900 dark:text-gray-100">
                                            {animeData.season ? (
                                                <Link href={animeData.season.url} className="text-blue-600 dark:text-blue-400 hover:underline">
                                                    {animeData.season.name}
                                                </Link>
                                            ) : (
                                                'N/A'
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-1 lg:col-span-2 space-y-6 md:space-y-8">
                        {animeData.synopsis && animeData.synopsis.paragraphs && animeData.synopsis.paragraphs.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Synopsis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose dark:prose-invert max-w-none">
                                        {animeData.synopsis.paragraphs.map((paragraph, index) => (
                                            <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">{paragraph}</p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {animeData.characters && animeData.characters.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Characters ({animeData.characters ? animeData.characters.length : 0})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                        {animeData.characters.map((character, index) => (
                                            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-start gap-3">
                                                    {/* Character Image */}
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-16 h-16 rounded-full overflow-hidden">
                                                            {character.image ? (
                                                                <Image
                                                                    src={character.image}
                                                                    alt={character.name}
                                                                    width={64}
                                                                    height={64}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <ImagePlaceholder className="w-full h-full" />
                                                            )}
                                                        </div>
                                                        <div className={`absolute -top-1 -right-1 px-2 py-1 rounded-full text-xs font-semibold ${character.role === 'Main' ? 'bg-blue-500 text-white' :
                                                            character.role === 'Supporting' ? 'bg-green-500 text-white' :
                                                                character.role === 'Antagonist' ? 'bg-red-500 text-white' :
                                                                    'bg-gray-500 text-white'
                                                            }`}>
                                                            {character.role}
                                                        </div>
                                                    </div>

                                                    {/* Character Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base truncate">
                                                            {character.name}
                                                        </h3>

                                                        {/* Voice Actor Info */}
                                                        <div className="mt-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                                                    {character.voiceActorImage ? (
                                                                        <Image
                                                                            src={character.voiceActorImage}
                                                                            alt={character.voiceActor}
                                                                            width={32}
                                                                            height={32}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <ImagePlaceholder className="w-full h-full" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                                        {character.voiceActor}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                                        </svg>
                                                                        {character.voiceActorLang}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Genres ({animeData.genreList ? animeData.genreList.length : 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {animeData.genreList.map((genre, index) => (
                                        <Link
                                            key={index}
                                            href={`/anime/genres/${genre.href}`}
                                            className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/70 transition-colors text-sm"
                                            onClick={(e) => handleClick(e, `/anime/genres/${genre.href}`)}
                                        >
                                            {genre.title}
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Episodes ({animeData.episodeList ? animeData.episodeList.length : 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TooltipProvider>
                                    <div className="relative">

                                        <div className="relative mb-4">
                                            <input
                                                type="text"
                                                placeholder="Search episode..."
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                            <HelpCircle className="h-5 w-5" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="left" className="max-w-sm">
                                                        <div className="space-y-2">
                                                            <p className="font-semibold text-sm">How to search episodes:</p>
                                                            <div className="space-y-1 text-xs">
                                                                <p>• <span className="font-medium">Episode number:</span> "1", "01", "100"</p>
                                                                <p>• <span className="font-medium">Episode title:</span> "pilot", "finale"</p>
                                                                <p>• <span className="font-medium">With prefix:</span> "episode 1", "E1", "E01"</p>
                                                                <p>• <span className="font-medium">Partial match:</span> "ep" for episode</p>
                                                            </div>
                                                            <p className="text-xs text-blue-400 font-medium">Try searching for "1" or "01" to see the first episode!</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                        <div className="text-sm text-muted-foreground mb-2">
                                            {search ? (
                                                `Showing ${filteredEpisodes.length} of ${animeData.episodeList ? animeData.episodeList.length : 0} episodes for "${search}"`
                                            ) : (
                                                `Showing ${animeData.episodeList ? animeData.episodeList.length : 0} episodes`
                                            )}
                                        </div>
                                        {filteredEpisodes.length > 0 ? (
                                            filteredEpisodes.map((ep) => (
                                                <Tooltip key={ep.episodeId}>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={`/anime/episode/${formatSlug(ep.href)}`}
                                                            className="flex items-center rounded-xl p-2 md:p-3 shadow transition-all duration-300 bg-card/80 hover:bg-accent/80 border border-border/50 hover:border-border"
                                                            onClick={(e) => handleClick(e, `/anime/episode/${formatSlug(ep.href)}`)}
                                                        >
                                                            <div className="relative">
                                                                {animeData.poster ? (
                                                                    <Image
                                                                        src={animeData.poster}
                                                                        alt={animeData.title}
                                                                        width={48}
                                                                        height={48}
                                                                        className="rounded-lg w-12 h-12 object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                                                                        <ImagePlaceholder className="w-full h-full" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0 ml-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-sm md:text-base text-foreground">
                                                                        E{ep.eps && parseInt(ep.eps.toString()) < 100
                                                                            ? ep.eps.toString().padStart(2, '0')
                                                                            : ep.eps}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">{animeData.duration}</span>
                                                                    <span className={`text-xs px-2 py-1 rounded-full ${ep.status === 'Sub' ? 'bg-green-500/20 text-green-400' :
                                                                        ep.status === 'Dub' ? 'bg-blue-500/20 text-blue-400' :
                                                                            'bg-muted text-muted-foreground'
                                                                        }`}>
                                                                        {ep.status}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs md:text-sm truncate text-muted-foreground">{ep.fullTitle}</div>
                                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    {ep.date}
                                                                </div>
                                                            </div>
                                                            <div className="ml-4 text-lg md:text-xl text-primary group-hover:text-primary/80">▶</div>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-xs">
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-sm">
                                                                Episode {ep.eps && parseInt(ep.eps.toString()) < 100
                                                                    ? ep.eps.toString().padStart(2, '0')
                                                                    : ep.eps}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{ep.fullTitle}</p>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <span>Duration: {animeData.duration}</span>
                                                                <span>•</span>
                                                                <span>Status: {ep.status}</span>
                                                                <span>•</span>
                                                                <span>Date: {ep.date}</span>
                                                            </div>
                                                            <p className="text-xs text-blue-500 font-medium">Click to watch this episode</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))
                                        ) : (
                                            <div className="text-muted-foreground text-center py-8">
                                                {search ? (
                                                    <div>
                                                        <p>No episodes found for "{search}".</p>
                                                        <p className="text-sm mt-1">Try a different search term.</p>
                                                    </div>
                                                ) : (
                                                    'No episodes available.'
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </TooltipProvider>
                            </CardContent>
                        </Card>

                        {animeData.recommendedAnimeList && animeData.recommendedAnimeList.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        Recommended Anime ({animeData.recommendedAnimeList ? animeData.recommendedAnimeList.length : 0})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                                        {animeData.recommendedAnimeList.map((anime, index) => (
                                            <Link
                                                key={index}
                                                href={`/anime/${formatSlug(anime.href)}`}
                                                className="group"
                                                onClick={(e) => handleClick(e, `/anime/${formatSlug(anime.href)}`)}
                                            >
                                                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 shadow-md">
                                                    {anime.poster ? (
                                                        <Image
                                                            src={anime.poster}
                                                            alt={anime.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                                        />
                                                    ) : (
                                                        <ImagePlaceholder className="w-full h-full" />
                                                    )}
                                                </div>
                                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {anime.title}
                                                </h3>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
} 