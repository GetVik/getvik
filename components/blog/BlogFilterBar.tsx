'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface BlogFilterBarProps {
    filters: {
        sortBy: string;
        category: string;
        search: string;
    };
    categories: string[];
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onCategorySelect: (category: string) => void;
    onSortChange: (value: string) => void;
}

export function BlogFilterBar({
    filters,
    categories,
    onFilterChange,
    onCategorySelect,
    onSortChange,
}: BlogFilterBarProps) {

    const activeSortLabel = {
        'newest': 'Newest',
        'oldest': 'Oldest'
    }[filters.sortBy] || 'Sort';

    return (
        <div className="sticky top-0 z-30 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5 py-6 mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">

                {/* Category Tabs */}
                <div className="flex items-center gap-6 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
                    <button
                        onClick={() => onCategorySelect('All')}
                        className={`text-sm font-medium transition-colors whitespace-nowrap ${filters.category === ''
                            ? 'text-white border-b-2 border-white pb-1'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        All Articles
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onCategorySelect(cat)}
                            className={`text-sm font-medium transition-colors whitespace-nowrap ${filters.category === cat
                                ? 'text-white border-b-2 border-white pb-1'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Right Side: Search & Sort */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex lg:w-64">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <Input
                            type="text"
                            name="search"
                            placeholder="Search articles"
                            value={filters.search}
                            onChange={onFilterChange}
                            className="pl-6 pr-0 bg-transparent border-none text-white placeholder:text-gray-600 focus-visible:ring-0 h-auto py-2 text-sm"
                        />
                    </div>

                    <div className="h-4 w-[1px] bg-white/10 hidden lg:block"></div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 text-sm font-medium text-white hover:text-gray-300 transition-colors whitespace-nowrap">
                                {activeSortLabel}
                                <ChevronDown size={14} className="text-gray-500" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#1C1C1C] border-white/10 text-white p-2">
                            <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider">Sort By</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onSortChange('newest')} className="cursor-pointer text-sm hover:bg-white/5 rounded-md">Newest</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange('oldest')} className="cursor-pointer text-sm hover:bg-white/5 rounded-md">Oldest</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
