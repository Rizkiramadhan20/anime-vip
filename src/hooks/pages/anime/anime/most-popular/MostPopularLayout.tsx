"use client"

import React, { useState, useMemo } from 'react'

import { mostPopularItem } from '@/interface/Anime';

import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Checkbox } from '@/components/ui/checkbox';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Input } from '@/components/ui/input';

import Image from 'next/image';

import { Filter, Search, X } from 'lucide-react';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/components/ui/pagination';

interface AnimeContentProps {
    mostPopularData: {
        animeList: mostPopularItem[];
    };
}

export default function MostPopularLayout({ mostPopularData }: AnimeContentProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedDubStatus, setSelectedDubStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('title');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // Number of items to show per page

    // Extract unique values for filters
    const uniqueTypes = useMemo(() => {
        const types = mostPopularData.animeList.map(item => item.type);
        return Array.from(new Set(types)).sort();
    }, [mostPopularData.animeList]);

    const uniqueStatuses = useMemo(() => {
        const statuses = mostPopularData.animeList.map(item => item.status).filter(Boolean);
        return Array.from(new Set(statuses)).sort();
    }, [mostPopularData.animeList]);

    const uniqueDubStatuses = useMemo(() => {
        const dubStatuses = mostPopularData.animeList.map(item => item.dubStatus);
        return Array.from(new Set(dubStatuses)).sort();
    }, [mostPopularData.animeList]);

    // Filter and sort anime list
    const filteredAnimeList = useMemo(() => {
        let filtered = mostPopularData.animeList;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Type filter
        if (selectedTypes.length > 0) {
            filtered = filtered.filter(item => selectedTypes.includes(item.type));
        }

        // Status filter
        if (selectedStatuses.length > 0) {
            filtered = filtered.filter(item => selectedStatuses.includes(item.status));
        }

        // Dub status filter
        if (selectedDubStatus && selectedDubStatus !== 'all') {
            filtered = filtered.filter(item => item.dubStatus === selectedDubStatus);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'type':
                    return a.type.localeCompare(b.type);
                case 'status':
                    return (a.status || '').localeCompare(b.status || '');
                case 'episodes':
                    return (a.episodes || 0) - (b.episodes || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [mostPopularData.animeList, searchTerm, selectedTypes, selectedStatuses, selectedDubStatus, sortBy]);

    // Pagination logic
    const totalPages = Math.ceil(filteredAnimeList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredAnimeList.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedTypes, selectedStatuses, selectedDubStatus, sortBy]);

    // Handle filter changes
    const handleTypeChange = (type: string, checked: boolean) => {
        if (checked) {
            setSelectedTypes(prev => [...prev, type]);
        } else {
            setSelectedTypes(prev => prev.filter(t => t !== type));
        }
    };

    const handleStatusChange = (status: string, checked: boolean) => {
        if (checked) {
            setSelectedStatuses(prev => [...prev, status]);
        } else {
            setSelectedStatuses(prev => prev.filter(s => s !== status));
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedTypes([]);
        setSelectedStatuses([]);
        setSelectedDubStatus('all');
        setSortBy('title');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm || selectedTypes.length > 0 || selectedStatuses.length > 0 || (selectedDubStatus && selectedDubStatus !== 'all');

    // Generate pagination items
    const generatePaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={currentPage === i}
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(i);
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            // Show first page
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        href="#"
                        isActive={currentPage === 1}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(1);
                        }}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            // Show ellipsis if needed
            if (currentPage > 3) {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            // Show current page and neighbors
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={currentPage === i}
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(i);
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            // Show ellipsis if needed
            if (currentPage < totalPages - 2) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            // Show last page
            if (totalPages > 1) {
                items.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink
                            href="#"
                            isActive={currentPage === totalPages}
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(totalPages);
                            }}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    return (
        <section className='py-6 px-4 sm:px-5'>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 border-b border-border pb-4 md:pb-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Most Popular</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                {[searchTerm, selectedTypes.length, selectedStatuses.length, selectedDubStatus].filter(Boolean).length}
                            </span>
                        )}
                    </Button>
                </div>
                <Link href={"/donghua/completed"} className="mt-2 md:mt-0 text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-200 font-semibold flex items-center gap-2">
                    Lihat Semua
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-10">
                {/* Filter Sidebar */}
                <div className={`lg:w-80 transition-all duration-300 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <Card className="sticky top-4">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold text-foreground">Filters</h4>
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-destructive hover:text-destructive/80"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Clear
                                    </Button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        placeholder="Search anime titles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Sort By</label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="type">Type</SelectItem>
                                        <SelectItem value="status">Status</SelectItem>
                                        <SelectItem value="episodes">Episodes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Type Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Type</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {uniqueTypes.map((type) => (
                                        <div key={type} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`type-${type}`}
                                                checked={selectedTypes.includes(type)}
                                                onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
                                            />
                                            <label
                                                htmlFor={`type-${type}`}
                                                className="text-sm text-muted-foreground cursor-pointer"
                                            >
                                                {type}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Status</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {uniqueStatuses.map((status) => (
                                        <div key={status} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`status-${status}`}
                                                checked={selectedStatuses.includes(status)}
                                                onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                                            />
                                            <label
                                                htmlFor={`status-${status}`}
                                                className="text-sm text-muted-foreground cursor-pointer"
                                            >
                                                {status}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dub Status Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Dub Status</label>
                                <Select value={selectedDubStatus} onValueChange={setSelectedDubStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Dub Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Dub Status</SelectItem>
                                        {uniqueDubStatuses.map((dubStatus) => (
                                            <SelectItem key={dubStatus} value={dubStatus}>
                                                {dubStatus}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Results Count */}
                            <div className="pt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1}-{Math.min(endIndex, filteredAnimeList.length)} of {filteredAnimeList.length} results
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {currentItems.map((item, idx) => (
                            <Card key={idx} className="group hover:shadow-lg transition-all duration-300 cursor-pointer p-0">
                                <Link href={`anime/${item.href}`}>
                                    <CardContent className="p-0">
                                        <div className="relative overflow-hidden">
                                            <Image
                                                width={1080}
                                                height={1080}
                                                src={item.poster}
                                                alt={item.title}
                                                className="w-full h-48 object-cover group-hover:brightness-75 group-hover:scale-105 transition-all duration-300"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.dubStatus === 'Dub'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-secondary text-secondary-foreground'
                                                    }`}>
                                                    {item.dubStatus}
                                                </span>
                                            </div>
                                            {item.episodes && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-background/80 text-foreground backdrop-blur-sm">
                                                        EP {item.episodes}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-semibold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h4>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                                                    {item.type}
                                                </span>
                                                {item.status && (
                                                    <span className={`px-2 py-1 text-xs rounded ${item.status === 'Completed'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredAnimeList.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                            <p className="text-muted-foreground mb-4">
                                Try adjusting your filters or search terms
                            </p>
                            <Button onClick={clearFilters} variant="outline">
                                Clear all filters
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredAnimeList.length > 0 && totalPages > 1 && (
                        <div className="flex justify-between mt-8">
                            {/* Page Info */}
                            <div className="flex justify-center">
                                <p className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </p>
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) {
                                                        setCurrentPage(currentPage - 1);
                                                    }
                                                }}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>

                                        {generatePaginationItems()}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < totalPages) {
                                                        setCurrentPage(currentPage + 1);
                                                    }
                                                }}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}