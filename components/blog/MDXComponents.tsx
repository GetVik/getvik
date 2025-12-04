import Link from 'next/link';
import Image from 'next/image';

const CustomLink = (props: React.ComponentPropsWithoutRef<'a'>) => {
    const href = props.href;
    const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'));

    if (isInternalLink) {
        return (
            <Link href={href} {...props} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline decoration-2 underline-offset-2 transition-colors">
                {props.children}
            </Link>
        );
    }

    return <a target="_blank" rel="noopener noreferrer" {...props} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline decoration-2 underline-offset-2 transition-colors" />;
};

const CustomImage = (props: React.ComponentPropsWithoutRef<'img'>) => {
    const { src, alt, width, height, ...rest } = props;
    return (
        <figure className="my-12 group">
            <div className="rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-sm transition-shadow hover:shadow-md">
                {src && (
                    <Image
                        src={src as string}
                        alt={alt || ''}
                        width={width ? (typeof width === 'string' ? parseInt(width) : width) : 800}
                        height={height ? (typeof height === 'string' ? parseInt(height) : height) : 400}
                        className="w-full h-auto object-cover"
                        {...rest}
                    />
                )}
            </div>
            {alt && (
                <figcaption className="text-center text-sm text-zinc-500 mt-4 italic">
                    {alt}
                </figcaption>
            )}
        </figure>
    );
};

const Callout = ({ children, type = 'default' }: { children: React.ReactNode; type?: 'default' | 'warning' | 'danger' }) => {
    const styles = {
        default: 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100',
        warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
        danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    };

    return (
        <div className={`p-6 my-8 rounded-xl border ${styles[type]} shadow-sm`}>
            {children}
        </div>
    );
};

const H2 = (props: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2 {...props} className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-6 leading-tight tracking-tight scroll-mt-24" />
);

const H3 = (props: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3 {...props} className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white mt-10 mb-4 leading-tight scroll-mt-24" />
);

const P = (props: React.ComponentPropsWithoutRef<'p'>) => (
    <p {...props} className="text-lg text-zinc-700 dark:text-zinc-300 leading-8 mb-8" />
);

const Blockquote = (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote {...props} className="border-l-4 border-zinc-900 dark:border-white pl-6 py-2 my-10 italic text-xl text-zinc-800 dark:text-zinc-200" />
);

const List = (props: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul {...props} className="list-disc list-outside ml-6 mb-8 space-y-3 text-lg text-zinc-700 dark:text-zinc-300 marker:text-zinc-400" />
);

const ListItem = (props: React.ComponentPropsWithoutRef<'li'>) => (
    <li {...props} className="pl-2 leading-8" />
);

export const MDXComponents = {
    a: CustomLink,
    img: CustomImage,
    h2: H2,
    h3: H3,
    p: P,
    blockquote: Blockquote,
    ul: List,
    li: ListItem,
    Callout,
};
