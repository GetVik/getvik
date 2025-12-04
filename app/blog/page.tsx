import { getAllPosts, getAllCategories, getAllTags } from '@/lib/mdx';
import BlogPageContent from './BlogPageContent';
import { generateBlogMetadata } from '@/lib/metadata';

export const metadata = generateBlogMetadata();

export default function BlogHome() {
    const posts = getAllPosts();
    const categories = getAllCategories();
    const tags = getAllTags();

    return (
        <BlogPageContent
            initialPosts={posts}
            categories={categories}
            tags={tags}
        />
    );
}
