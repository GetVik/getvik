import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';

interface RelatedPostsProps {
    posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-16 mt-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">
                Read Next
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block"
                    >
                        <div className="aspect-video relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-4">
                            {post.coverImage && (
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <time dateTime={post.date}>
                                    {format(new Date(post.date), 'MMM d, yyyy')}
                                </time>
                                {post.category && (
                                    <>
                                        <span>•</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                            {post.category}
                                        </span>
                                    </>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                {post.excerpt}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
