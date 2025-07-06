"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'

import Link from 'next/link'

import Image from 'next/image'

import { Search, Play } from 'lucide-react'

import { usePathname, useRouter } from 'next/navigation'

import type { EpisodeData, ServerListItem, GenreItem } from "@/hooks/pages/anime/episode/types/interface"

import { fetchServerUrl } from '@/lib/anime/FetchAnime'

import LoadingOverlay from '@/base/loading/LoadingOverlay'

import { formatSlug } from '@/base/helper/anime/FormatSlug'

import { useAuth } from '@/utils/context/AuthContext'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'

import { Info, Calendar, Clock, Eye, Star, Users, Film, User, Tag } from 'lucide-react'

export default function DetailsEpisodeContent({ episodeData, slug }: { episodeData: EpisodeData, slug: string }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [search, setSearch] = useState('');
    const [selectedServer, setSelectedServer] = useState<ServerListItem | null>(() => {
        const firstValidServer = episodeData.server.qualities
            .flatMap(q => q.serverList)
            .filter(s => s.title !== 'HD-2')[0] || null;
        return firstValidServer;
    });
    const [currentStreamingUrl, setCurrentStreamingUrl] = useState(episodeData.defaultStreamingUrl);
    const [isEpisodeLoading, setIsEpisodeLoading] = useState(false);
    const [isRecommendedLoading, setIsRecommendedLoading] = useState(false);

    // Memoized values untuk optimasi
    const hasNextEpisode = useMemo(() =>
        episodeData.hasNextEpisode && episodeData.nextEpisode,
        [episodeData.hasNextEpisode, episodeData.nextEpisode]
    );

    // Sort episodes with latest episode at top
    const sortedEpisodes = useMemo(() => {
        if (!episodeData.episodeList) return [];

        const episodes = [...episodeData.episodeList];

        episodes.sort((a, b) => {
            const episodeA = a.eps || 0;
            const episodeB = b.eps || 0;
            return episodeB - episodeA; // Descending order
        });

        return episodes;
    }, [episodeData.episodeList]);

    const filteredEpisodes = useMemo(() =>
        sortedEpisodes.filter((ep) => {
            if (!ep || ep.fullTitle === undefined || ep.fullTitle === null) return false;
            const titleStr = ep.fullTitle.toString().toLowerCase();
            const episodeNumber = ep.eps?.toString() || '';
            const searchStr = search.toLowerCase();
            return (
                titleStr.includes(searchStr) ||
                `episode ${titleStr}`.includes(searchStr) ||
                `e${titleStr}`.includes(searchStr) ||
                `episode ${episodeNumber}`.includes(searchStr) ||
                `e${episodeNumber}`.includes(searchStr) ||
                episodeNumber.includes(searchStr)
            );
        }),
        [sortedEpisodes, search]
    );

    const isEpisodeActive = useCallback((episodeHref: string) => {
        const cleanPathname = pathname.split('?')[0].replace(/\/$/, '');
        const cleanHref = episodeHref.split('?')[0].replace(/\/$/, '');
        const pathnameParts = cleanPathname.split('/');
        const hrefParts = cleanHref.split('/');
        return formatSlug(pathnameParts[pathnameParts.length - 1]) === formatSlug(hrefParts[hrefParts.length - 1]);
    }, [pathname]);

    const handleEpisodeClick = useCallback((href: string) => {
        if (!href) return;
        setIsEpisodeLoading(true);
        router.push(`/anime/episode/${href}`);
    }, [router]);

    // Initial server fetch
    useEffect(() => {
        if (selectedServer) {
            handleServerSelect(selectedServer);
        }
    }, []);

    const handleServerSelect = async (server: ServerListItem) => {
        try {
            const response: {
                statusCode: number;
                statusMessage: string;
                message: string;
                ok: boolean;
                data: {
                    url: string;
                };
                pagination: null;
            } = await fetchServerUrl(server.serverId);
            if (response.ok) {
                setSelectedServer(server);
                setCurrentStreamingUrl(response.data.url);
            } else {
            }
        } catch (error) {
            setCurrentStreamingUrl(episodeData.defaultStreamingUrl);
        }
    };

    const handleRecommendedClick = (href: string) => {
        setIsRecommendedLoading(true);
        router.push(href);
    };

    return (
        <section className='py-8 md:py-12'>
            <LoadingOverlay isLoading={isEpisodeLoading} message="Loading episode..." />
            <LoadingOverlay isLoading={isRecommendedLoading} message="Loading anime..." />

            <div className="container px-4">
                {/* Banner */}
                <div className="relative w-full aspect-[16/4.5] rounded-3xl overflow-hidden shadow-2xl mb-8 md:mb-12">
                    <Image
                        src={episodeData?.poster || ""}
                        alt={episodeData.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-gray-800/90 text-white text-sm px-3 py-1.5 rounded-full font-medium">{episodeData.type}</span>
                            <span className="bg-gray-800/90 text-white text-sm px-3 py-1.5 rounded-full font-medium">{episodeData.duration}</span>
                            {episodeData.releaseTime && (
                                <span className="bg-gray-800/90 text-white text-sm px-3 py-1.5 rounded-full font-medium">{episodeData.releaseTime}</span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{episodeData.title}</h1>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {episodeData.genreList.map((genre: GenreItem) => (
                                <Link href={`/anime/genres/${formatSlug(genre.href)}`} rel='noopener noreferrer' key={genre.genreId} className="text-sm text-gray-200 bg-gray-700/70 px-3 py-1.5 rounded-full hover:bg-gray-600/80 transition-colors">{genre.title}</Link>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                const iframeSection = document.querySelector('.aspect-video');
                                iframeSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 md:px-8 py-3 rounded-full font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-300 text-base md:text-lg flex items-center gap-2 hover:scale-105"
                        >
                            <Play className="w-5 h-5" />
                            Watch Now
                        </button>

                        <div className="flex items-center gap-4 mt-6">
                            {episodeData.hasPrevEpisode && episodeData.prevEpisode && (
                                <button
                                    onClick={() => episodeData.prevEpisode && handleEpisodeClick(episodeData.prevEpisode.href)}
                                    className="bg-gray-800/80 text-white px-6 md:px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-700/90 transition-all duration-300 text-base md:text-lg flex items-center gap-2 hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Episode {episodeData.prevEpisode?.title}
                                </button>
                            )}
                            {episodeData.hasNextEpisode && episodeData.nextEpisode && (
                                <button
                                    onClick={() => episodeData.nextEpisode && handleEpisodeClick(episodeData.nextEpisode.href)}
                                    className="bg-gray-800/80 text-white px-6 md:px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-700/90 transition-all duration-300 text-base md:text-lg flex items-center gap-2 hover:scale-105"
                                >
                                    Episode {episodeData.nextEpisode?.title}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-8 md:gap-10'>
                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm md:w-[65%] h-fit">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Streaming
                            </h2>
                            {/* Autoplay Toggle Button */}
                            {hasNextEpisode ? (
                                <div className="flex items-center gap-3">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        Next: Ep {episodeData.nextEpisode!.title}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    No next episode
                                </div>
                            )}
                        </div>
                        <div className="space-y-6">
                            <div className="relative w-full aspect-video rounded-xl bg-black shadow-lg">
                                <iframe
                                    ref={iframeRef}
                                    src={currentStreamingUrl}
                                    id='frame'
                                    className="absolute inset-0 w-full h-full"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                            <div className='flex gap-4'>
                                <div className="flex flex-wrap gap-3">
                                    <select
                                        value={selectedServer?.serverId || ''}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            let foundServer: ServerListItem | undefined;
                                            for (const q of episodeData.server.qualities) {
                                                foundServer = q.serverList.filter(s => s.title !== 'HD-2').find(s => s.serverId === e.target.value);
                                                if (foundServer) break;
                                            }
                                            if (foundServer) {
                                                handleServerSelect(foundServer);
                                            }
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        disabled={episodeData.server.qualities.every(q => !q.serverList || q.serverList.filter(s => s.title !== 'HD-2').length === 0)}
                                    >
                                        {episodeData.server.qualities.flatMap(q => q.serverList).filter(s => s.title !== 'HD-2').length > 0 ? (
                                            episodeData.server.qualities.flatMap(q => q.serverList).filter((server: ServerListItem) => server.title !== 'HD-2').map((server: ServerListItem) => (
                                                <option key={server.serverId} value={server.serverId}>
                                                    {server.title}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">No servers available</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm md:w-[35%]">
                        {/* Header with modern design */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                Episodes
                            </h2>

                            <div className="flex flex-col items-end gap-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                    {filteredEpisodes.length} episodes
                                </div>
                                <div className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Latest first
                                </div>
                            </div>
                        </div>

                        {/* Modern search input */}
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search episodes..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        {/* Episodes list with modern design */}
                        <div className="space-y-2 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {filteredEpisodes.length > 0 ? (
                                filteredEpisodes.map((ep, index) => {
                                    const isLatestEpisode = index === 0; // First episode in sorted list is the latest

                                    return (
                                        <Link
                                            href={`/anime/episode/${formatSlug(ep.href)}`}
                                            key={ep.episodeId}
                                            className={`group relative flex items-center gap-4 p-4 rounded-2xl font-medium text-base transition-all duration-300 hover:shadow-lg ${isEpisodeActive(ep.href)
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                                                : isLatestEpisode
                                                    ? 'bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/25 border-2 border-green-300'
                                                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                                                }`}
                                            onClick={() => handleEpisodeClick(ep.href)}
                                        >
                                            {/* Episode thumbnail */}
                                            {episodeData.poster && (
                                                <div className="relative w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                                                    <Image
                                                        src={episodeData.poster}
                                                        alt={`Episode ${ep.fullTitle}`}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        sizes="64px"
                                                    />
                                                    {/* Play overlay */}
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                                                            <Play className="w-4 h-4 text-gray-800" />
                                                        </div>
                                                    </div>
                                                    {/* Latest episode indicator */}
                                                    {isLatestEpisode && (
                                                        <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Episode info */}
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-semibold text-base ${isEpisodeActive(ep.href) || isLatestEpisode ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                                                    }`}>
                                                    Episode {ep.eps}
                                                    {isLatestEpisode && (
                                                        <span className="ml-2 text-xs bg-green-600/80 px-2 py-1 rounded-full">
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>
                                                {episodeData.title && (
                                                    <div className={`text-sm mt-1 ${isEpisodeActive(ep.href) || isLatestEpisode ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                                                        } truncate`}>
                                                        {episodeData.title}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Active indicator */}
                                            {isEpisodeActive(ep.href) && (
                                                <div className="flex-shrink-0 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            )}
                                            {/* Latest episode indicator */}
                                            {isLatestEpisode && (
                                                <div className="flex-shrink-0 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                            )}
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">No episodes found</p>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-8 md:mt-12">
                    {/* Poster */}
                    {episodeData.poster && (
                        <div className="flex justify-center md:justify-start items-start h-full">
                            <div className="relative w-full h-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg border-2 border-blue-200 dark:border-blue-900">
                                <Image
                                    src={episodeData.poster}
                                    alt={episodeData.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                                />
                            </div>
                        </div>
                    )}

                    {/* Info Card */}
                    <div className="md:col-span-2 w-full">
                        <Card className="flex flex-col gap-8 p-6 md:p-8 h-full">
                            {/* Judul & Alternative Titles */}
                            {episodeData.springSeason && (
                                <Card className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 md:p-8 shadow-xl backdrop-blur-sm mb-2">
                                    <CardHeader className="px-0 pb-0 flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-br from-green-500 to-blue-400 rounded-xl mb-2 md:mb-0">
                                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                                            <CardTitle className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                                {episodeData.springSeason.name}
                                            </CardTitle>
                                            <Badge variant="secondary" className="ml-0 md:ml-2 mt-2 md:mt-0">Season</Badge>
                                        </div>
                                    </CardHeader>
                                    {episodeData.springSeason.next && (
                                        <CardContent className="px-0 pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-blue-200 dark:border-blue-900">
                                                <Image
                                                    src={episodeData.springSeason.next.image}
                                                    alt={episodeData.springSeason.next.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <Link
                                                href={episodeData.springSeason.next.link}
                                                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-base md:text-lg mt-2 sm:mt-0"
                                            >
                                                {episodeData.springSeason.next.name}
                                            </Link>
                                        </CardContent>
                                    )}
                                </Card>
                            )}

                            <CardHeader className="px-0 pb-0">
                                <CardTitle className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                                    <Film className="w-7 h-7 text-blue-500" />
                                    {episodeData.title}
                                </CardTitle>
                                {episodeData.alternativeTitles && (
                                    <CardDescription className="text-base mt-1">
                                        <span className="font-semibold">Alternative Titles:</span> {episodeData.alternativeTitles}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            {/* Genres */}
                            {episodeData.genreList && episodeData.genreList.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {episodeData.genreList.map((genre: GenreItem) => (
                                        <Badge key={genre.genreId} variant="secondary" className="text-xs px-3 py-1.5">
                                            <Link href={`/anime/genres/${formatSlug(genre.href)}`} rel='noopener noreferrer'>
                                                {genre.title}
                                            </Link>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <CardContent className="px-0">
                                {/* Description */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="w-5 h-5 text-purple-500" />
                                        <span className="font-semibold text-lg">Description</span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {episodeData.description}
                                    </p>
                                </div>
                                {/* Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Tag className="w-4 h-4 text-blue-400" />
                                        <span className="font-semibold">Type:</span>
                                        <span>{episodeData.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Eye className="w-4 h-4 text-gray-400" />
                                        <span className="font-semibold">Status:</span>
                                        <span>{episodeData.status}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-green-400" />
                                        <span className="font-semibold">Released:</span>
                                        <span>{episodeData.released}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-yellow-400" />
                                        <span className="font-semibold">Duration:</span>
                                        <span>{episodeData.duration || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Eye className="w-4 h-4 text-pink-400" />
                                        <span className="font-semibold">Censor:</span>
                                        <span>{episodeData.censor}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span className="font-semibold">Rating:</span>
                                        <span>{episodeData.rating}</span>
                                    </div>
                                    {episodeData.season && (
                                        <div className="flex items-center gap-2 text-sm col-span-1 sm:col-span-2">
                                            <Calendar className="w-4 h-4 text-blue-400" />
                                            <span className="font-semibold">Season:</span>
                                            <span>{episodeData.season.name}</span>
                                        </div>
                                    )}
                                </div>
                                {/* Studios, Directors, Casts */}
                                <div className="flex flex-wrap gap-6 mt-8">
                                    {episodeData.studios && episodeData.studios.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <Film className="w-4 h-4 text-blue-500" />
                                                <span className="font-semibold text-sm">Studios</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {episodeData.studios.map((studio, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs px-3 py-1.5">
                                                        <Link href={studio.url}>{studio.name}</Link>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {episodeData.director && episodeData.director.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <User className="w-4 h-4 text-green-500" />
                                                <span className="font-semibold text-sm">Directors</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {episodeData.director.map((director, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs px-3 py-1.5">
                                                        <Link href={director.url}>{director.name}</Link>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {episodeData.casts && episodeData.casts.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <Users className="w-4 h-4 text-purple-500" />
                                                <span className="font-semibold text-sm">Cast</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {episodeData.casts.map((cast, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs px-3 py-1.5">
                                                        <Link href={cast.url}>{cast.title}</Link>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-8 md:mt-12">
                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Recommended Anime
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {episodeData.recommendedAnimeList?.map((anime) => (
                                <button
                                    onClick={() => handleRecommendedClick(`/anime/${formatSlug(anime.href)}`)}
                                    key={anime.animeId}
                                    className="group relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    <Image
                                        src={anime.poster}
                                        alt={anime.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                                        <h3 className="text-white text-sm md:text-base font-medium line-clamp-2">{anime.title}</h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 
