import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Globe, Instagram, Twitter, BadgeCheck } from "lucide-react";
import { AvatarWithFallback } from "@/components/ui/avatar/AvatarWithFallback";
import { Metadata } from "next";
import { generateOGMetadata, generateTwitterMetadata, getCanonicalUrl, generateProfilePageSchema, generateJsonLd } from "@/lib/seo";
import ReportButton from "@/components/report/ReportButton";
import { ReportTargetType } from "@/types/report.interface";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { fixR2Url } from "@/lib/image.utils";
import { IStoreCreator, IStoreProduct } from "@/types/types";
import { StoreMasonryGrid } from "@/components/store/StoreMasonryGrid";
import { ShareStoreButton } from "@/components/store/ShareStoreButton";

type StorePageProps = {
  params: Promise<{ storeSlug: string }>;
};

interface StoreData {
  creator: IStoreCreator;
  products: IStoreProduct[];
}

import { mockCreator, mockCreator2, mockProducts } from "@/data/mock";

async function getStoreData(slug: string): Promise<StoreData | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const creators = [mockCreator, mockCreator2];
  const creator = creators.find(c => c.storeSlug === slug);

  if (creator) {
    const products = mockProducts.filter(p => p.creatorId._id === creator._id);
    return {
      creator,
      products
    };
  }

  return null;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const data = await getStoreData(storeSlug);

  if (!data) return { title: 'Store Not Found' };

  const { creator } = data;
  const title = `${creator.storeName} - Creator Store`;
  const description = creator.bio || `Discover digital products from ${creator.storeName}`;
  const url = getCanonicalUrl(`/store/${storeSlug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: generateOGMetadata({
      title,
      description,
      image: creator.coverImageUrl || creator.profileImageUrl,
      url,
    }),
    twitter: generateTwitterMetadata({
      title,
      description,
      image: creator.coverImageUrl || creator.profileImageUrl,
    }),
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeSlug } = await params;
  const data = await getStoreData(storeSlug);

  if (!data) notFound();

  const { creator, products } = data;
  const socials = creator.socials || {};

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(
          generateProfilePageSchema({
            name: creator.storeName,
            url: getCanonicalUrl(`/store/${storeSlug}`),
            image: creator.profileImageUrl,
            description: creator.bio,
          })
        )}
      />

      {/* =========================================
          STORE HEADER
      ========================================= */}
      <header className="relative w-full bg-[#050505]">

        {/* 1. COVER IMAGE AREA
           - Uses 'blur-xl' background for ambience
           - Uses 'object-contain' foreground for the actual image (no cropping)
        */}
        <div className="relative w-full h-48 md:h-80 lg:h-96 overflow-hidden bg-[#0a0a0a] group border-b border-white/5">
          {creator.coverImageUrl ? (
            <>
              {/* Layer 1: Blurred Ambience */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-700">
                <Image
                  src={fixR2Url(creator.coverImageUrl)}
                  alt="Ambience"
                  fill
                  className="object-cover blur-3xl scale-110"
                />
              </div>

              {/* Layer 2: Actual Image */}
              <div className="relative h-full w-full">
                <Image
                  src={fixR2Url(creator.coverImageUrl)}
                  alt={`${creator.storeName} cover`}
                  fill
                  priority
                  className="object-contain object-center z-10"
                  sizes="100vw"
                />
              </div>
            </>
          ) : (
            // Fallback Gradient
            <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#050505]" />
          )}

          {/* Gradient Fade at bottom to blend into profile section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none" />
        </div>

        {/* 2. PROFILE & ACTIONS BAR */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-30">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 md:-mt-16 mb-8">

            {/* AVATAR: Left Aligned, overlaps banner */}
            <div className="relative shrink-0">
              <div className="rounded-full p-1.5 bg-[#050505] ring-1 ring-white/10 shadow-2xl">
                <AvatarWithFallback
                  src={creator.profileImageUrl}
                  alt={creator.storeName}
                  size={128}
                  fallbackText={creator.storeName}
                  // Responsive sizing: 96px on mobile, 128px on desktop
                  className="rounded-full object-cover w-[96px] h-[96px] md:w-[128px] md:h-[128px]"
                />
              </div>
            </div>

            {/* INFO & ACTIONS: Flex container */}
            <div className="flex-1 flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-4 pt-1">

              {/* LEFT: Name & Bio */}
              <div className="flex flex-col gap-1 max-w-2xl">
                <div className="flex items-center gap-2 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {creator.storeName}
                  </h1>
                  {/* Blue Verified Badge */}
                  <BadgeCheck className="text-blue-500 w-6 h-6 shrink-0 fill-current" />
                </div>

                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {creator.bio || `Welcome to the official store of ${creator.storeName}.`}
                </p>
              </div>

              {/* RIGHT: Actions Toolbar (Desktop) 
                  Matches the reference image: Report Flag -> Share Button -> Socials
              */}
              <div className="hidden md:flex items-center gap-3 pb-1">
                {/* Report Flag (Subtle) */}
                <ReportButton
                  targetType={ReportTargetType.CREATOR}
                  targetId={creator._id}
                  variant="icon"
                  className="text-gray-500 hover:text-white transition-colors p-2"
                />

                {/* Share Button (Primary White Pill) */}
                <ShareStoreButton
                  storeName={creator.storeName}
                  storeSlug={storeSlug}
                  variant="pill"
                />

                {/* Social Divider */}
                {(socials.x || socials.instagram || socials.website) && (
                  <div className="w-px h-5 bg-white/10 mx-1" />
                )}

                {/* Social Icons */}
                <div className="flex items-center gap-3 text-gray-500">
                  {socials.website && <Link href={socials.website} target="_blank" className="hover:text-white transition-colors"><Globe size={20} /></Link>}
                  {socials.x && <Link href={socials.x} target="_blank" className="hover:text-white transition-colors"><Twitter size={20} /></Link>}
                  {socials.instagram && <Link href={socials.instagram} target="_blank" className="hover:text-white transition-colors"><Instagram size={20} /></Link>}
                </div>
              </div>

              {/* MOBILE ACTIONS ROW (Visible only on phone) */}
              <div className="flex md:hidden items-center justify-between w-full mt-2 pt-4 border-t border-white/10">
                <div className="flex gap-5 text-gray-500">
                  {socials.website && <Link href={socials.website}><Globe size={20} /></Link>}
                  {socials.x && <Link href={socials.x}><Twitter size={20} /></Link>}
                  {socials.instagram && <Link href={socials.instagram}><Instagram size={20} /></Link>}
                  <ReportButton targetType={ReportTargetType.CREATOR} targetId={creator._id} variant="icon" className="text-gray-500" />
                </div>
                <ShareStoreButton
                  storeName={creator.storeName}
                  storeSlug={storeSlug}
                  variant="pill" // Using pill on mobile too for better tappability
                />
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* =========================================
          MAIN CONTENT AREA
      ========================================= */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 mt-8">

        {/* Breadcrumb / Count Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <Breadcrumb items={[{ label: creator.storeName }]} />
          <span className="text-xs font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {products.length} Products
          </span>
        </div>

        {/* MASONRY GRID */}
        <section className="min-h-[50vh]">
          <StoreMasonryGrid products={products} storeSlug={storeSlug} />
        </section>

      </main>
    </div>
  );
}