'use client';

import React, { useState } from 'react';
import { Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

interface BlogShareProps {
    title: string;
    slug: string;
}

export function BlogShare({ title, slug }: BlogShareProps) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';

    const shareLinks = [
        {
            name: 'Twitter',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            color: 'hover:text-[#1DA1F2]',
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            color: 'hover:text-[#0A66C2]',
        },
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex flex-col gap-6 items-center sticky top-32">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden lg:block rotate-180" style={{ writingMode: 'vertical-rl' }}>
                Share Article
            </p>
            <div className="flex lg:flex-col gap-4 items-center">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all ${link.color} hover:scale-110`}
                        aria-label={`Share on ${link.name}`}
                    >
                        <link.icon className="w-5 h-5" />
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all hover:text-zinc-900 dark:hover:text-white hover:scale-110"
                    aria-label="Copy link"
                >
                    {copied ? (
                        <Check className="w-5 h-5 text-green-500" />
                    ) : (
                        <LinkIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
}
