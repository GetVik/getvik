import { notFound } from "next/navigation";
import Link from "next/link";
import { IFullProduct } from "@/types/types";
import { formatCurrency } from "@/types/formats";
import { File, CheckCircle, ShieldCheck, Sparkles, ArrowRight, Lock } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { DownloadButton } from "@/components/product/DownloadButton";
import { StarRating } from "@/components/reviews/StarRating";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";
import { ProductMediaGallery } from "@/components/product/ProductMediaGallery";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { AvatarWithFallback } from "@/components/ui/avatar/AvatarWithFallback";
import { Metadata } from "next";
import { generateOGMetadata, generateTwitterMetadata, getCanonicalUrl, generateProductSchema, generateJsonLd, generateBreadcrumbSchema } from "@/lib/seo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ReportButton from "@/components/report/ReportButton";
import { ReportTargetType } from "@/types/report.interface";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type ProductPageParams = {
  storeSlug: string;
  productSlug: string;
};

type ProductPageProps = {
  params: Promise<ProductPageParams>;
};

const normalizeDescription = (desc: string | undefined) => desc ?? "";

import { mockProducts } from "@/data/mock";

async function getProductData(slug: string): Promise<IFullProduct | null> {
  const product = mockProducts.find(p => p.slug === slug);
  return product ? (product as unknown as IFullProduct) : null;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productSlug, storeSlug } = await params;
  const product = await getProductData(productSlug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const title = product.title;
  const description = product.description?.substring(0, 160) || `${product.title} - Digital product available on getvik`;
  const url = getCanonicalUrl(`/store/${storeSlug}/product/${productSlug}`);
  const image = product.media?.[0]?.url || '/og-image.png';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...generateOGMetadata({ title, description, image, url }),
      type: 'article',
    },
    twitter: {
      ...generateTwitterMetadata({ title, description, image }),
      card: 'summary_large_image',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug, storeSlug } = await params;
  const product = await getProductData(productSlug);
  const session = await getServerSession(authOptions);

  if (!product) {
    notFound();
  }

  let isOwned = false;
  if (session?.user) {
    isOwned = true;
  }

  const { creatorId: creator } = product;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 selection:bg-white/20 relative font-sans">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(
          generateProductSchema({
            name: product.title,
            description: normalizeDescription(product.description),
            image: product.media?.[0]?.url || '',
            price: product.price,
            url: getCanonicalUrl(`/store/${storeSlug}/product/${productSlug}`),
            brand: creator.storeName,
            ratingValue: product.averageRating,
            reviewCount: product.reviewCount,
          })
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(
          generateBreadcrumbSchema([
            { name: 'Home', url: getCanonicalUrl('/') },
            { name: creator.storeName, url: getCanonicalUrl(`/store/${storeSlug}`) },
            { name: product.title, url: getCanonicalUrl(`/store/${storeSlug}/product/${productSlug}`) },
          ])
        )}
      />
      <ProductViewTracker productId={product._id} />

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-12">

        {/* Navigation */}
        <div className="mb-6 md:mb-8">
          <Breadcrumb
            items={[
              { label: creator.storeName, href: `/store/${storeSlug}` },
              { label: product.title },
            ]}
          />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-12 xl:gap-x-16 items-start">

          {/* LEFT COLUMN: Media & Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">

            {/* 1. Media Gallery */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl shadow-black/50">
              <ProductMediaGallery
                media={product.media || []}
                productTitle={product.title}
              />
            </div>

            {/* Mobile-Only Divider */}
            <div className="lg:hidden w-full h-px bg-white/5" />

            {/* Desktop-Only: Description & Reviews 
               (Hidden on mobile to ensure Purchase Card comes first) 
            */}
            <div className="hidden lg:block space-y-16">
              <DescriptionSection description={product.description} />
              <ReviewSectionWrapper product={product} />
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar (Purchase Card) */}
          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">

            {/* Main Purchase Card */}
            <div className="rounded-3xl border border-white/10 bg-[#0F0F0F]/90 backdrop-blur-xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

              {/* Header */}
              <div className="space-y-5 mb-8">
                <Link
                  href={`/store/${creator.storeSlug}`}
                  className="inline-flex items-center gap-2.5 px-3 py-1.5 -ml-3 rounded-full hover:bg-white/5 transition-colors group"
                >
                  <AvatarWithFallback
                    src={creator.profileImageUrl}
                    alt={creator.storeName}
                    size={24}
                    fallbackText={creator.storeName}
                    className="rounded-full ring-1 ring-white/10"
                  />
                  <span className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">
                    {creator.storeName}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </Link>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-[1.1]">
                  {product.title}
                </h1>

                <div className="flex items-center gap-4">
                  {product.reviewCount ? (
                    <div className="flex items-center gap-2">
                      <StarRating rating={product.averageRating || 0} size={16} readOnly />
                      <span className="text-sm text-neutral-400">
                        ({product.reviewCount})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-neutral-500 bg-white/5 px-2.5 py-1 rounded-md">
                      New Release
                    </span>
                  )}
                  {product.category && (
                    <span className="text-xs text-neutral-500 border border-white/10 px-2 py-1 rounded-md">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="py-6 border-t border-white/10">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      {formatCurrency(product.price)}
                    </span>
                    {product.allowPayWhatYouWant && (
                      <span className="text-xs text-neutral-300 font-medium bg-white/10 px-2 py-1 rounded-full">
                        + Pay what you want
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {isOwned ? (
                  <DownloadButton files={product.files} productId={product._id} />
                ) : (
                  <AddToCartButton product={product} />
                )}

                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-3 h-3 text-neutral-500" />
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {isOwned ? "Securely stored in your library" : "Secure encrypted transaction"}
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Card: Files & Utility */}
            <div className="rounded-2xl border border-white/10 bg-[#0F0F0F]/50 p-6 space-y-6">

              {/* Files */}
              <div>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <File className="w-3.5 h-3.5" />
                  Included Assets
                </h3>

                {product.files?.length ? (
                  <ul className="space-y-3">
                    {product.files.map((file, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-900 border border-white/5 group-hover:border-white/20 transition-colors">
                          <CheckCircle className="h-3 w-3 text-neutral-500 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm text-neutral-300 font-medium truncate group-hover:text-white transition-colors">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            Digital Download
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 rounded bg-neutral-900 border border-white/5 text-xs text-neutral-500 text-center">
                    Files available immediately after purchase
                  </div>
                )}
              </div>

              {/* Utility Buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-center">
                <ReportButton
                  targetType={ReportTargetType.PRODUCT}
                  targetId={product._id}
                  variant="ghost"
                  className="w-full h-9 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                />
              </div>
            </div>

            {/* Creator Card */}
            <Link
              href={`/store/${creator.storeSlug}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0F0F0F]/50 p-5 hover:bg-white/5 transition-all group"
            >
              <AvatarWithFallback
                src={creator.profileImageUrl}
                alt={creator.storeName}
                size={48}
                fallbackText={creator.storeName}
                className="rounded-full ring-1 ring-white/10 group-hover:ring-white/20"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Created by</span>
                <div className="flex items-center gap-1">
                  <h4 className="text-base font-semibold text-white truncate group-hover:underline decoration-white/30 underline-offset-4">
                    {creator.storeName}
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>

          </aside>

          {/* Mobile-Only: Description & Reviews 
             Rendered here so it visually appears AFTER the purchase card on mobile
          */}
          <div className="lg:hidden col-span-1 space-y-12 pt-4">
            <DescriptionSection description={product.description} />
            <ReviewSectionWrapper product={product} />
          </div>

        </div>
      </main>
    </div>
  );
}



function DescriptionSection({ description }: { description?: string }) {
  return (
    <div className="max-w-none">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <Sparkles className="w-5 h-5 text-neutral-400" />
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Product Details
        </h2>
      </div>

      <div className="prose prose-invert prose-neutral max-w-none 
        prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
        prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:text-[16px] md:prose-p:text-[17px]
        prose-li:text-neutral-300 prose-li:marker:text-neutral-600
        prose-strong:text-white prose-strong:font-semibold
        prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white
        prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:shadow-lg
        prose-blockquote:border-l-white/20 prose-blockquote:text-neutral-400 prose-blockquote:italic">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
        >
          {normalizeDescription(description)}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function ReviewSectionWrapper({ product }: { product: IFullProduct }) {
  return (
    <div className="pt-8 border-t border-white/5">
      <ReviewSection
        productId={product._id}
        productTitle={product.title}
        averageRating={product.averageRating || 0}
        reviewCount={product.reviewCount || 0}
      />
    </div>
  );
}