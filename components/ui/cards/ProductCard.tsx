'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Video, Star, ChevronsUpDown } from 'lucide-react';
import { fixR2Url } from '@/lib/image.utils';
import { IStoreProduct } from '@/types/types';
import { AvatarWithFallback } from '@/components/ui/avatar/AvatarWithFallback';
import { cn } from '@/lib/utils'; 

interface ProductCardProps {
    product: IStoreProduct;
    storeSlug?: string;
}

export function ProductCard({ product, storeSlug: propStoreSlug }: ProductCardProps) {
    const firstMediaItem = product.media?.[0];
    const firstImageItem = product.media?.find((item) => item.type === 'image');
    const initialUrl = firstImageItem?.url;
    const isVideoCover = firstMediaItem?.type === 'video';
    const [imageError, setImageError] = useState(false);

    useEffect(() => { setImageError(false); }, [product._id]);

    const creatorSlug = propStoreSlug || product.creatorId?.storeSlug || 'store';
    const productSlug = product.slug || product._id;
    const creatorName = product.creatorId?.storeName || 'Verified Creator';
    const creatorImage = product.creatorId?.profileImageUrl;

    return (
        <Link
            href={`/store/${creatorSlug}/product/${productSlug}`}
            // CONTAINER CLASSES
            // 1. h-fit: Crucial for Masonry. Lets card shrink/grow based on content.
            // 2. z-0 hover:z-10: Ensures expanded card renders "above" visual glitches if they occur.
            // 3. break-inside-avoid: Keeps the card in one piece within a column.
            className="group relative flex flex-col w-full h-fit break-inside-avoid bg-[#141414] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-black/50 z-0 hover:z-10"
        >
            {/* =========================================
                IMAGE EXPANSION AREA
               ========================================= */}
            <div className={cn(
                "relative w-full overflow-hidden bg-[#1C1C1C] border-b border-white/10 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                // MOBILE (Default):
                // Allow tall images up to 500px. No expansion interaction needed on touch.
                "max-h-[500px]",
                
                // DESKTOP (md): 
                // 1. Start with a 5rem (80px) teaser strip.
                // 2. On Hover, open up to 500px (or image height, whichever is smaller).
                "md:max-h-20 md:group-hover:max-h-[500px]"
            )}>
                {!imageError && initialUrl ? (
                    <>
                        {/* DYNAMIC HEIGHT IMAGE
                           - width={0} height={0} sizes="100vw" + "w-full h-auto": 
                             This tells Next.js to respect the image's NATURAL aspect ratio.
                             If it's tall, it renders tall. If wide, it renders short.
                        */}
                        <Image
                            src={fixR2Url(initialUrl)}
                            alt={product.title}
                            onError={() => setImageError(true)}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-auto object-cover opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity duration-500"
                        />
                        
                        {/* "PREVIEW" BADGE (Desktop Only)
                           - Shows when collapsed to indicate interactivity.
                           - Fades out immediately on hover.
                        */}
                        <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none z-10">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-sm">
                                <ChevronsUpDown size={14} className="text-white/70" />
                                <span className="text-[10px] font-medium text-white/90 tracking-wide uppercase">Preview</span>
                            </div>
                        </div>
                    </>
                ) : (
                    // Fallback for missing image
                    <div className="h-20 flex items-center justify-center text-neutral-600 bg-neutral-900">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">
                            {product.title.slice(0, 2)}
                        </span>
                    </div>
                )}

                {/* Video Indicator (Always visible if video) */}
                {isVideoCover && !imageError && (
                    <div className="absolute top-2 right-2 z-10 flex items-center justify-center w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full text-white border border-white/10">
                        <Video size={10} />
                    </div>
                )}
            </div>

            {/* =========================================
                CARD FOOTER (Info)
               ========================================= */}
            <div className="flex flex-col flex-1 p-4 gap-3 bg-[#141414] relative z-20">
                {/* Title */}
                <h3 className="text-[15px] font-medium text-white leading-snug line-clamp-2 group-hover:text-blue-100 transition-colors">
                    {product.title}
                </h3>

                <div className="h-px w-full bg-white/10" />

                <div className="mt-auto flex items-center justify-between">
                    {/* Creator Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <AvatarWithFallback
                            src={creatorImage}
                            alt={creatorName}
                            size={18}
                            fallbackText={creatorName}
                            className="shrink-0 opacity-80 ring-1 ring-white/10"
                        />
                        <span className="truncate max-w-[100px] hover:text-white transition-colors text-xs font-medium text-gray-500">
                            {creatorName}
                        </span>
                    </div>

                    {/* Price & Rating */}
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-bold text-white">
                            {product.price === 0 ? "Free" : `₹${product.price.toLocaleString('en-IN')}`}
                        </span>
                        {product.averageRating ? (
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                <Star size={8} className="fill-white text-white" />
                                <span>{product.averageRating.toFixed(1)}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </Link>
    );
}