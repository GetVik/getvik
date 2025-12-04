'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StarRating } from '@/components/reviews/StarRating';
import { IStoreProduct } from '@/types/types';
import { Video } from 'lucide-react';
import { AvatarWithFallback } from '@/components/ui/avatar/AvatarWithFallback';
import { fixR2Url } from '@/lib/image.utils';

export function FeaturedProductCard({ product }: { product: IStoreProduct }) {
  const placeholderImage = `https://placehold.co/600x400/1C1C1C/FFF?text=${encodeURIComponent(
    product.title
  )}`;

  const firstMediaItem = product.media?.[0];
  const firstImageItem = product.media?.find((item) => item.type === 'image');

  const displayImageUrl = firstImageItem?.url || placeholderImage;
  const isVideoCover = firstMediaItem?.type === 'video';

  const creatorSlug = product.creatorId?.storeSlug || 'store';
  const productSlug = product.slug;

  return (
    <Link
      href={`/store/${creatorSlug}/product/${productSlug}`}
      // **CHANGE**: Stack vertically on mobile, row on 'sm' and up.
      // Removed h-[300px] default, applied 'sm:h-[300px]'
      className="group flex flex-col sm:flex-row sm:h-[300px] overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#111] hover:border-[#3A3A3A] transition-all duration-300"
    >
      {/* **CHANGE**: Set explicit mobile height, responsive width/height */}
      <div className="w-full h-[200px] sm:w-[55%] sm:h-full relative overflow-hidden">
        <Image
          src={fixR2Url(displayImageUrl)}
          alt={product.title}
          onError={(e) => (e.currentTarget.src = placeholderImage)}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {isVideoCover && (
          <div className="absolute top-3 left-3 z-10 p-1.5 bg-black/60 rounded-full">
            <Video size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* **CHANGE**: Responsive width, 'justify-between' to 'flex-1' for mobile */}
      <div className="flex flex-col flex-1 w-full sm:w-[45%] p-4">
        <div>
          <h3 className="text-[15px] font-semibold text-white line-clamp-2 group-hover:text-gray-100">
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-gray-400 line-clamp-2">
            {product.summary || product.description || 'A short description...'}
          </p>
        </div>

        {/* **CHANGE**: Added 'mt-4 sm:mt-2' for mobile spacing */}
        <div className="mt-4 sm:mt-2 flex items-center gap-2">
          <AvatarWithFallback
            src={product.creatorId?.profileImageUrl}
            alt={product.creatorId?.storeName || 'Creator'}
            size={20}
            fallbackText={product.creatorId?.storeName}
            className="shrink-0"
          />
          <span className="text-sm text-gray-300 truncate">
            {product.creatorId?.storeName || 'Anonymous'}
          </span>
        </div>

        {/* **CHANGE**: Added 'flex-1' to push content to bottom on mobile */}
        <div className="flex-1" />

        {/* **CHANGE**: Added 'mt-4 sm:mt-3' for mobile spacing */}
        <div className="flex items-center justify-between mt-4 sm:mt-3">
          <span className="text-sm font-semibold text-white bg-[#643446] px-2 py-0.5 rounded-md">
            ₹{product.price?.toLocaleString('en-IN') || 0}
            {product.allowPayWhatYouWant && '+'}
          </span>
          {product.reviewCount && product.reviewCount > 0 ? (
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <StarRating
                rating={product.averageRating || 0}
                size={16}
                readOnly
              />
              <span className="text-gray-500">({product.reviewCount})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span className="text-gray-500 text-xs">No reviews</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}