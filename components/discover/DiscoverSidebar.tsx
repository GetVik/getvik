'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DiscoverSidebarProps {
    filters: {
        sortBy: string;
        category: string;
        search: string;
        priceMin: string;
        priceMax: string;
    };
    categories: string[];
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onCategorySelect: (category: string) => void;
    onSortChange: (value: string) => void;
    onClearFilters: () => void;
    className?: string;
}

export function DiscoverSidebar({
    filters,
    categories,
    onFilterChange,
    onCategorySelect,
    onSortChange,
    onClearFilters,
    className = ''
}: DiscoverSidebarProps) {
    return (
        <aside className={`w-full lg:w-64 shrink-0 space-y-8 ${className}`}>
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                    type="text"
                    name="search"
                    placeholder="Search products"
                    value={filters.search}
                    onChange={onFilterChange}
                    className="pl-9 bg-[#1C1C1C] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-white/20"
                />
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Categories</h3>
                <div className="flex flex-col space-y-1">
                    <button
                        onClick={() => onCategorySelect('All')}
                        className={`text-left text-sm py-1.5 px-2 rounded-md transition-colors ${filters.category === ''
                            ? 'bg-white text-black font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onCategorySelect(cat)}
                            className={`text-left text-sm py-1.5 px-2 rounded-md transition-colors ${filters.category === cat
                                ? 'bg-white text-black font-medium'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Price</h3>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        name="priceMin"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={onFilterChange}
                        className="bg-[#1C1C1C] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-white/20"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                        type="number"
                        name="priceMax"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={onFilterChange}
                        className="bg-[#1C1C1C] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-white/20"
                    />
                </div>
            </div>

            {/* Sort */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Sort By</h3>
                <select
                    value={filters.sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-white/10 text-white text-sm rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                    <option value="newest">Newest</option>
                    <option value="popular">Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>

            {/* Clear Filters */}
            {(filters.category || filters.search || filters.priceMin || filters.priceMax || filters.sortBy !== 'newest') && (
                <Button
                    variant="ghost"
                    onClick={onClearFilters}
                    className="w-full text-gray-400 hover:text-white hover:bg-white/5"
                >
                    Clear all filters
                </Button>
            )}
        </aside>
    );
}
