import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <div className="group flex flex-col h-full bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
            <Link href={`/blog/${post.slug}`} className="block aspect-video relative overflow-hidden bg-[#1C1C1C]">
                {post.coverImage ? (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <span className="text-4xl">📝</span>
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <div className="flex flex-col flex-grow p-6">
                <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">
                    <time dateTime={post.date}>{format(new Date(post.date), 'MMM d, yyyy')}</time>
                    {post.category && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span className="text-zinc-400">
                                {post.category}
                            </span>
                        </>
                    )}
                </div>

                <Link href={`/blog/${post.slug}`} className="block mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {post.excerpt}
                </p>

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/5"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
