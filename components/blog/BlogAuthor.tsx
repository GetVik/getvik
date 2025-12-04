import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Twitter, Linkedin, Globe } from 'lucide-react';

interface Author {
    name: string;
    picture?: string;
    bio?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
}

interface BlogAuthorProps {
    author: Author;
}

export function BlogAuthor({ author }: BlogAuthorProps) {
    if (!author) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 my-12">
            <div className="shrink-0">
                {author.picture ? (
                    <Image
                        src={author.picture}
                        alt={author.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-500">
                        {author.name.charAt(0)}
                    </div>
                )}
            </div>
            <div className="text-center sm:text-left space-y-3">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {author.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Author
                    </p>
                </div>

                {author.bio && (
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                        {author.bio}
                    </p>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-4 pt-1">
                    {author.twitter && (
                        <Link
                            href={author.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-[#1DA1F2] transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </Link>
                    )}
                    {author.linkedin && (
                        <Link
                            href={author.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-[#0A66C2] transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    )}
                    {author.website && (
                        <Link
                            href={author.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            <Globe className="w-5 h-5" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
