'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchAnime } from '@/lib/anime/FetchAnime';
import { AnimeItem } from '@/interface/Anime';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ImagePlaceholder from '@/base/helper/ImagePlaceholder';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState<AnimeItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setError(null);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const results = await searchAnime(searchQuery);
            setSearchResults(results || []);
        } catch (err) {
            setError('Failed to search anime. Please try again.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    };

    const clearSearch = () => {
        setQuery('');
        setSearchResults([]);
        setError(null);
        setHasSearched(false);
    };

    // Auto-search when component mounts with initial query
    useEffect(() => {
        if (initialQuery) {
            handleSearch(initialQuery);
        }
    }, [initialQuery]);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Search Anime
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Find your favorite anime series and movies
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSubmit} className="max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search anime titles, genres, or keywords..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 pr-20 h-12 text-lg"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                {query && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearSearch}
                                        className="h-8 w-8 p-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="h-8 px-4"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Search'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Search Results */}
                <div className="space-y-6">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Searching...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12">
                            <div className="text-destructive mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Search Error</h3>
                            <p className="text-muted-foreground">{error}</p>
                        </div>
                    )}

                    {hasSearched && !loading && !error && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-foreground">
                                    Search Results
                                </h2>
                                <span className="text-muted-foreground">
                                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                                </span>
                            </div>

                            {searchResults.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-muted-foreground mb-4">
                                        <Search className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                                    <p className="text-muted-foreground">
                                        Try different keywords or check your spelling
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {searchResults.map((anime, index) => (
                                        <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                                            <Link href={anime.href}>
                                                <CardContent className="p-0">
                                                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                                                        {anime.poster ? (
                                                            <Image
                                                                src={anime.poster}
                                                                alt={anime.title}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                            />
                                                        ) : (
                                                            <ImagePlaceholder />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </div>
                                                    <div className="p-3">
                                                        <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                                            {anime.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                            <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                                                {anime.score}
                                                            </span>
                                                            <span className="inline-block px-2 py-0.5 rounded bg-secondary/10 text-secondary font-medium">
                                                                {anime.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Link>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!hasSearched && !loading && !error && (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Start Searching</h3>
                            <p className="text-muted-foreground">
                                Enter a search term above to find anime
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 