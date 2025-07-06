import React from 'react'

import DetailsEpisode from "@/hooks/pages/anime/episode/DetailsEpisode"

import { Metadata, ResolvingMetadata } from "next"

import { fetchEpisodeBySlug } from "@/lib/anime/FetchAnime"

import type { EpisodeResponse } from "@/hooks/pages/anime/episode/types/interface";

type Props = {
    params: Promise<{ slug: string }>
}

async function getAnimeData(slug: string): Promise<EpisodeResponse | null> {
    try {
        const data = await fetchEpisodeBySlug(slug);
        return data;
    } catch (error) {
        console.error("Error fetching episode data:", error);
        return null;
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const { slug } = await params;

    // fetch data
    const animeData = await getAnimeData(slug);
    const anime = animeData?.data;

    if (!anime) {
        return {
            title: "Episode Not Found",
            description: "The requested episode could not be found.",
        };
    }

    // optionally access and extend parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${anime.title} | Riznime`,
        description: `Watch ${anime.title} online.`,
        openGraph: {
            title: `${anime.title} | Riznime`,
            description: `Watch ${anime.title} online.`,
            images: previousImages,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${anime.title} | Riznime`,
            description: `Watch ${anime.title} online.`,
            images: [],
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    return (
        <DetailsEpisode params={{ slug }} />
    )
} 