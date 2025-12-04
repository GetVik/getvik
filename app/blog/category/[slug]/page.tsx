import { getPostsByCategory, getAllCategories } from '@/lib/mdx';
import { BlogCard } from '@/components/blog/BlogCard';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const categories = getAllCategories();
    return categories.map((category) => ({
        slug: category.toLowerCase().replace(/ /g, '-'),
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
        title: `${categoryName} - GetVik Blog`,
        description: `Read the latest articles about ${categoryName} on GetVik.`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const categoryName = slug.replace(/-/g, ' ');
    const posts = getPostsByCategory(categoryName);

    if (posts.length === 0) {
        // Try case-insensitive matching if direct match fails (though getPostsByCategory handles it)
        // If still empty, it might be a true 404 or just empty category
        // For now, we'll show the empty state rather than 404ing immediately unless we're strict
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider">Category</div>
                <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-6 capitalize">
                    {categoryName}
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
                        <p className="text-zinc-500">No posts found in this category.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
