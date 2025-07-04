import React from 'react'

import DetailsAnimeSkeleton from '@/hooks/pages/anime/DetailsAnimeSkelaton'

import { fetchAnimeBySlug } from '@/lib/anime/FetchAnime'

import DetailsAnimeContent from '@/hooks/pages/anime/DetailsAnimeContent'

import { AnimeBySlugResponse, AnimeBySlugData } from "@/interface/Anime"

// Tambahkan tipe untuk props
interface DetailsAnimeProps {
    params: {
        slug: string;
    };
}

export default async function DetailsAnime({ params }: DetailsAnimeProps) {
    const { slug } = params;
    let animeResponse: AnimeBySlugResponse | null = null;
    let error: string | null = null;

    try {
        animeResponse = await fetchAnimeBySlug(slug);
    } catch (err) {
        error = err instanceof Error ? err.message : "Failed to load anime data";
    }

    if (error || !animeResponse || !animeResponse.ok) {
        return (
            <DetailsAnimeSkeleton />
        );
    }

    const animeData = animeResponse.data;

    return (
        <DetailsAnimeContent animeData={animeData} />
    )
} 