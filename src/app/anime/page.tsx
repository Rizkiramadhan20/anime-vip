import React, { Fragment } from 'react';

import { fetchAnimeData, fetchMovieData, fetchMostPopularData, fetchGenresData, fetchCompletedData } from '@/lib/anime/FetchAnime';

import AnimeLayout from '@/hooks/pages/anime/anime/AnimeLayout';

import MovieLayout from '@/hooks/pages/anime/movie/MovieLayout';

import AnimeSkelaton from '@/hooks/pages/anime/anime/AnimeSkelaton';

import MostPopularLayout from "@/hooks/pages/anime/anime/most-popular/MostPopularLayout"

import GenresLayout from "@/hooks/pages/anime/anime/genres/GenresLayout"

import CompletedLayout from "@/hooks/pages/anime/anime/completed/CompletedLayout"

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AniHuaVerse: Satu Versi, Semua Dunia - Anime',
    description: 'Selamat datang di AniHuaVerse, gerbang ke dunia hiburan Asia yang tak terbatas. Satu tempat untuk menyelami kisah-kisah terbaik dari Jepang, Tiongkok, dan Korea – semua bersatu dalam satu semesta hiburan.',
    icons: {
        icon: '/favicon.ico',
    },
    openGraph: {
        title: 'AniHuaVerse: Satu Versi, Semua Dunia - Anime',
    },
}

export default async function Page() {
    try {
        const animeData = await fetchAnimeData();
        const movieData = await fetchMovieData();
        const mostPopularData = await fetchMostPopularData();
        const GenresData = await fetchGenresData();
        const completedData = await fetchCompletedData();

        return <Fragment>
            <AnimeLayout animeData={animeData} />
            <MovieLayout movieData={movieData} />
            <MostPopularLayout mostPopularData={mostPopularData} />
            <GenresLayout GenresData={GenresData} />
            <CompletedLayout completedData={completedData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return (
            <AnimeSkelaton />
        );
    }
}