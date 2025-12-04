import { getPostsByTag, getAllTags } from '@/lib/mdx';
import { BlogCard } from '@/components/blog/BlogCard';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const tags = getAllTags();
    return tags.map((tag) => ({
        slug: tag.toLowerCase().replace(/ /g, '-'),
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    return {
        title: `#${slug} - GetVik Blog`,
        description: `Read articles tagged with #${slug} on GetVik.`,
    };
}

export default async function TagPage({ params }: Props) {
    const { slug } = await params;
    const posts = getPostsByTag(slug);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider">Tag</div>
                <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
                    #{slug}
                </h1>
                <div className="flex justify-center">
                    <Link href="/blog" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        ← Back to all posts
                    </Link>
                </div>
            </section>

            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-zinc-500">No posts found with this tag.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
