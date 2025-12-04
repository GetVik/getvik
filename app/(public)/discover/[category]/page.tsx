import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DiscoverPageContent from '../DiscoverPageContent';
import { generateBaseMetadata } from '@/lib/metadata';

// Map URL slugs to Category Names (as stored in DB/used in filters)
const categoryMap: Record<string, string> = {
  'notion-templates': 'Notion Templates',
  'pdfs-ebooks': 'PDFs & eBooks',
  'coding-tools': 'Coding Tools',
};

// Map URL slugs to SEO Metadata
const seoMap: Record<string, { title: string; description: string }> = {
  'notion-templates': {
    title: 'Buy Notion Templates India | Productivity & Business Templates',
    description: 'Download premium Notion templates built by creators in India. Planners, dashboards, student templates, workflows, and more.',
  },
  'pdfs-ebooks': {
    title: 'Buy Digital PDFs & Guides | Instant Download India',
    description: 'Explore eBooks and PDF guides across coding, fitness, finance, and productivity. Instant download.',
  },
  'coding-tools': {
    title: 'Developer Tools & Scripts Marketplace | Buy Digital Dev Assets',
    description: 'Download Next.js starters, Tailwind components, Python scripts, AI tools, and more. Instant access.',
  },
};

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const seo = seoMap[category];

  if (!seo) {
    return generateBaseMetadata({
      title: 'Discover Products',
      description: 'Browse our collection of digital products.',
      path: `/discover/${category}`,
    });
  }

  return generateBaseMetadata({
    title: seo.title,
    description: seo.description,
    path: `/discover/${category}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryName = categoryMap[category];

  if (!categoryName) {
    // If the category slug isn't one of our SEO targets, 
    // we could either 404 or just pass the slug as is if we supported dynamic slugs.
    // For this specific SEO task, we only target the 3 categories.
    // However, to be safe, if it's not in the map, we might want to 404 
    // OR just try to use it as is if we want to support others.
    // Given the strict blueprint, let's 404 for now to avoid duplicate content issues 
    // or just redirect to discover.
    // But let's be flexible: if not in map, maybe it's a valid category we don't have specific SEO for?
    // For now, I'll assume we only want these 3 pages to exist as "Landing Pages".
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="bg-[#0D0D0D] min-h-screen w-full flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        </div>
      }
    >
      <DiscoverPageContent initialCategory={categoryName} />
    </Suspense>
  );
}
