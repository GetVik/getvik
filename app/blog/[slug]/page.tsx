import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/blog/MDXComponents';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BlogBreadcrumb } from '@/components/blog/BlogBreadcrumb';
import { BlogAuthor } from '@/components/blog/BlogAuthor';
import { BlogShare } from '@/components/blog/BlogShare';
import { RelatedPosts } from '@/components/blog/RelatedPosts';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    try {
        const post = getPostBySlug(slug);
        return {
            title: `${post.title} - GetVik Blog`,
            description: post.excerpt,
            openGraph: {
                title: post.title,
                description: post.excerpt,
                type: 'article',
                publishedTime: post.date,
                authors: [post.author?.name || 'GetVik Team'],
                images: post.coverImage ? [{ url: post.coverImage }] : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt,
                images: post.coverImage ? [post.coverImage] : [],
            },
        };
    } catch {
        return {
            title: 'Blog Post Not Found',
        };
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    let post;
    try {
        post = getPostBySlug(slug);
    } catch {
        notFound();
    }

    // Get related posts
    const allPosts = getAllPosts();
    const relatedPosts = allPosts
        .filter(p => p.slug !== post.slug && (
            p.category === post.category ||
            p.tags?.some(tag => post.tags?.includes(tag))
        ))
        .slice(0, 3);

    const breadcrumbItems = [];
    if (post.category) {
        breadcrumbItems.push({
            label: post.category,
            href: `/blog/category/${post.category.toLowerCase().replace(/ /g, '-')}`
        });
    }
    breadcrumbItems.push({
        label: post.title,
    });

    return (
        <article className="min-h-screen bg-white dark:bg-black selection:bg-zinc-200 dark:selection:bg-zinc-800">
            {/* Header */}
            <header className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
                <div className="flex justify-center mb-10">
                    <BlogBreadcrumb items={breadcrumbItems} />
                </div>

                <div className="flex items-center justify-center gap-4 text-sm font-medium text-zinc-500 mb-8">
                    <time dateTime={post.date} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        {format(new Date(post.date), 'MMMM d, yyyy')}
                    </time>
                    <span className="text-zinc-300 dark:text-zinc-700">|</span>
                    <span className="flex items-center gap-2">
                        {post.readingTime || '5 min read'}
                    </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-10 leading-[1.1] tracking-tight text-balance">
                    {post.title}
                </h1>

                {post.author && (
                    <div className="flex items-center justify-center gap-4">
                        {post.author.picture ? (
                            <Image
                                src={post.author.picture}
                                alt={post.author.name}
                                width={56}
                                height={56}
                                className="rounded-full object-cover border-2 border-white dark:border-zinc-900 shadow-md ring-1 ring-zinc-100 dark:ring-zinc-800"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-500 ring-1 ring-zinc-100 dark:ring-zinc-800">
                                {post.author.name.charAt(0)}
                            </div>
                        )}
                        <div className="text-left">
                            <p className="text-lg font-semibold text-zinc-900 dark:text-white leading-none mb-1">
                                {post.author.name}
                            </p>
                            <p className="text-sm text-zinc-500 font-medium">
                                Content Creator
                            </p>
                        </div>
                    </div>
                )}
            </header>

            {/* Cover Image */}
            {post.coverImage && (
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
                    <div className="aspect-[21/9] relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-zinc-900/5 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-900">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            )}

            {/* Main Content Layout */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
                    {/* Share Sidebar (Left) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-32">
                            <BlogShare title={post.title} slug={post.slug} />
                        </div>
                    </div>

                    {/* Content (Center) */}
                    <div className="lg:col-span-8 lg:col-start-3">
                        <div className="prose prose-lg dark:prose-invert prose-zinc max-w-none prose-headings:scroll-mt-24 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                            <MDXRemote source={post.content} components={MDXComponents} />
                        </div>

                        {/* Mobile Share */}
                        <div className="lg:hidden mt-16 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex justify-center">
                                <BlogShare title={post.title} slug={post.slug} />
                            </div>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">
                                    Related Topics
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {post.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/blog/tags/${tag.toLowerCase().replace(/ /g, '-')}`}
                                            className="px-5 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium border border-zinc-100 dark:border-zinc-800"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author Bio */}
                        {post.author && (
                            <div className="mt-16 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                                <BlogAuthor author={post.author} />
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Right) - Empty for now */}
                    <div className="hidden lg:block lg:col-span-2">
                        {/* Placeholder for future widgets */}
                    </div>
                </div>

                {/* Related Posts */}
                <div className="mt-32 border-t border-zinc-100 dark:border-zinc-800 pt-20">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-12 text-center">
                        Read Next
                    </h2>
                    <RelatedPosts posts={relatedPosts} />
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.title,
                        description: post.excerpt,
                        image: post.coverImage ? [post.coverImage] : [],
                        datePublished: post.date,
                        author: {
                            '@type': 'Person',
                            name: post.author?.name || 'GetVik Team',
                        },
                    }),
                }}
            />
        </article>
    );
}
