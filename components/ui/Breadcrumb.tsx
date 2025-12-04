'use client';

import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center text-sm text-gray-400 mb-8">
            <Link href="/discover" className="hover:text-white transition-colors">
                Discover
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <span className="mx-2 text-gray-600">/</span>
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-white transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-white font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
