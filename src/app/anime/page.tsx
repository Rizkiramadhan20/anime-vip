import React, { Fragment } from 'react';

import { fetchAnimeData } from '@/lib/anime/FetchAnime';

import AnimeLayout from '@/hooks/pages/anime/anime/AnimeLayout';

import AnimeSkelaton from '@/hooks/pages/anime/anime/AnimeSkelaton';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AniHuaVerse - Anime',
    description: 'AniHuaVerse - Anime',
    icons: {
        icon: '/favicon.ico',
    },
    openGraph: {
        title: 'AniHuaVerse - Anime',
    },
}

export default async function Page() {
    try {
        const animeData = await fetchAnimeData();

        return <Fragment>
            <AnimeLayout animeData={animeData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return (
            <AnimeSkelaton />
        );
    }
}