import React from 'react'

import DetailsEpisodeSkeleton from '@/hooks/pages/anime/episode/DetailsEpisodeSkelaton'

import { fetchEpisodeBySlug } from '@/lib/anime/FetchAnime'

import DetailsEpisodeContent from '@/hooks/pages/anime/episode/DetailsEpisodeContent'

import { EpisodeResponse } from "@/hooks/pages/anime/episode/types/interface"

export default async function DetailsEpisode({ params }: { params: { slug: string } }) {
    const { slug } = params;
    let episodeResponse: EpisodeResponse | null = null;
    let error: string | null = null;

    try {
        episodeResponse = await fetchEpisodeBySlug(slug);
    } catch (err) {
        error = err instanceof Error ? err.message : "Failed to load episode data";
    }

    if (error || !episodeResponse || !episodeResponse.ok || !episodeResponse.data || !episodeResponse.data.server) {
        return (
            <DetailsEpisodeSkeleton />
        );
    }

    const episodeData = episodeResponse.data;

    return (
        <DetailsEpisodeContent episodeData={episodeData} slug={slug} />
    )
} 