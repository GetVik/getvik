'use client';

import React, { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogFilterBar } from '@/components/blog/BlogFilterBar';
import { BlogCard } from '@/components/blog/BlogCard';

import { BlogBreadcrumb } from '@/components/blog/BlogBreadcrumb';

interface BlogPageContentProps {
    initialPosts: BlogPost[];
    categories: string[];
    tags: string[];
}

type Filters = {
    sortBy: string;
    category: string;
    search: string;
};

export default function BlogPageContent({ initialPosts, categories }: BlogPageContentProps) {
    const [posts] = useState<BlogPost[]>(initialPosts);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
    const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

    const [filters, setFilters] = useState<Filters>({
        sortBy: 'newest',
        category: '',
        search: '',
    });

    // Initialize featured posts (take first 3)
    useEffect(() => {
        if (initialPosts.length > 0) {
            setFeaturedPosts(initialPosts.slice(0, 3));
        }
    }, [initialPosts]);

    // Filter and Sort Logic
    useEffect(() => {
        let result = [...posts];

        // Filter by Category
        if (filters.category) {
            result = result.filter(post => post.category === filters.category);
        }

        // Filter by Search
        if (filters.search) {
            const query = filters.search.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query)
            );
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            if (filters.sortBy === 'newest') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });

        setFilteredPosts(result);
    }, [posts, filters]);

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategorySelect = (category: string) => {
        setFilters((prev) => ({
            ...prev,
            category: category === 'All' ? '' : category,
        }));
    };

    const handleSortChange = (value: string) => {
        setFilters((prev) => ({ ...prev, sortBy: value }));
    };

    return (
        <main className="min-h-screen bg-[#0D0D0D] text-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
                <BlogBreadcrumb items={[]} />
                <BlogHero posts={featuredPosts} />

                <BlogFilterBar
                    filters={filters}
                    categories={categories}
                    onFilterChange={handleFilterChange}
                    onCategorySelect={handleCategorySelect}
                    onSortChange={handleSortChange}
                />

                <section className="min-h-[400px]">
                    {filteredPosts.length === 0 ? (
                        <div className="flex flex-col h-64 items-center justify-center rounded-xl border border-white/5 bg-[#141414] p-8 text-center">
                            <p className="text-lg font-medium text-white mb-2">No articles found</p>
                            <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
                            <button
                                onClick={() => setFilters({ sortBy: 'newest', category: '', search: '' })}
                                className="mt-4 text-sm text-white hover:text-gray-300 underline underline-offset-4"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <BlogCard key={post.slug} post={post} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
