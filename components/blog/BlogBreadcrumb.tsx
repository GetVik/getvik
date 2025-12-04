'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BlogBreadcrumbProps {
    items: BreadcrumbItem[];
}

export function BlogBreadcrumb({ items }: BlogBreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center flex-wrap gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <li>
                    <Link
                        href="/"
                        className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        Home
                    </Link>
                </li>

                <li>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                </li>

                <li>
                    <Link
                        href="/blog"
                        className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        Blog
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-zinc-900 dark:text-white font-medium" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
