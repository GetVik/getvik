'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface BlogHeroProps {
    posts: BlogPost[];
}

export function BlogHero({ posts }: BlogHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (posts.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % posts.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [posts.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    };

    if (!posts || posts.length === 0) return null;

    const post = posts[currentIndex];

    return (
        <section className="w-full mb-20 pt-8 relative group">
            <AnimatePresence mode="wait">
                <div key={post.slug} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-400 uppercase tracking-widest">
                                <span className="w-8 h-[1px] bg-white/30"></span>
                                <span>Featured Article</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight line-clamp-3">
                                {post.title}
                            </h1>

                            <p className="text-lg text-gray-400 max-w-md leading-relaxed line-clamp-3">
                                {post.excerpt}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <time dateTime={post.date}>{format(new Date(post.date), 'MMM d, yyyy')}</time>
                            </div>
                            {post.author && (
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>{post.author.name}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                            <Link href={`/blog/${post.slug}`}>
                                <Button
                                    size="lg"
                                    className="rounded-full px-10 h-14 bg-white text-black hover:bg-gray-200 font-medium text-lg transition-all"
                                >
                                    Read Article <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Image - Framed with padding */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        className="relative aspect-[4/3] lg:aspect-square rounded-2xl border border-white/10 bg-[#141414] p-4"
                    >
                        <div className="relative w-full h-full overflow-hidden rounded-xl bg-[#1C1C1C]">
                            {post.coverImage ? (
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
                                    📝
                                </div>
                            )}

                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {posts.length > 1 && (
                <div className="absolute bottom-0 right-0 lg:right-auto lg:left-0 flex gap-2 z-20">
                    <button
                        onClick={prevSlide}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Indicators */}
            {posts.length > 1 && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                    {posts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/20 w-4 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
