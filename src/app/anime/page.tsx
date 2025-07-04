import React, { Fragment } from 'react';

import { fetchAnimeData, fetchMovieData, fetchMostPopularData } from '@/lib/anime/FetchAnime';

import AnimeLayout from '@/hooks/pages/anime/anime/AnimeLayout';

import MovieLayout from '@/hooks/pages/anime/movie/MovieLayout';

import AnimeSkelaton from '@/hooks/pages/anime/anime/AnimeSkelaton';

import MostPopularLayout from "@/hooks/pages/anime/anime/most-popular/MostPopularLayout"

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
        const movieData = await fetchMovieData();
        const mostPopularData = await fetchMostPopularData();

        return <Fragment>
            <AnimeLayout animeData={animeData} />
            <MovieLayout movieData={movieData} />
            <MostPopularLayout mostPopularData={mostPopularData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return (
            <AnimeSkelaton />
        );
    }
}