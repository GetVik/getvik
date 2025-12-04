'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { IMedia } from '@/types/types';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ArrowLeft,
  ArrowRight,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { fixR2Url } from '@/lib/image.utils';

type PrevNextButtonProps = {
  enabled: boolean;
  onClick: () => void;
};

const PrevButton: React.FC<PrevNextButtonProps> = ({ enabled, onClick }) => (
  <button
    type="button"
    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white shadow-md ring-1 ring-white/10 transition hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Previous media"
  >
    <ArrowLeft size={18} />
  </button>
);

const NextButton: React.FC<PrevNextButtonProps> = ({ enabled, onClick }) => (
  <button
    type="button"
    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white shadow-md ring-1 ring-white/10 transition hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Next media"
  >
    <ArrowRight size={18} />
  </button>
);

interface ProductMediaGalleryProps {
  media: IMedia[];
  productTitle: string;
}

export const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({
  media,
  productTitle,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!media || media.length === 0) {
    return (
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-2xl border border-[#262626] bg-linear-to-b from-[#141414] to-black">
        <ImageIcon className="h-14 w-14 text-gray-700" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* MAIN SLIDER (framed style) */}
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]"
        ref={emblaRef}
      >
        <div className="flex">
          {media.map((item, index) => (
            <div
              className="relative flex-[0_0_100%] aspect-4/3 sm:aspect-video flex items-center justify-center"
              key={index}
            >
              {item.type === 'image' ? (
                <div className="relative h-full w-full p-8 sm:p-12">
                  <div className="relative h-full w-full shadow-2xl shadow-black/50">
                    <Image
                      src={item.isNew ? item.url : fixR2Url(item.url)}
                      alt={`${productTitle} - media ${index + 1}`}
                      fill
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full w-full p-8 sm:p-12">
                  <video
                    controls
                    loop
                    playsInline
                    className="h-full w-full object-contain rounded-lg shadow-2xl shadow-black/50"
                  >
                    <source src={item.isNew ? item.url : fixR2Url(item.url)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))}
        </div>

        {media.length > 1 && (
          <>
            <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
            <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
          </>
        )}
      </div>

      {/* THUMBNAILS (cleaner style) */}
      {media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {media.map((item, index) => {
            const isActive = selectedIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                className={[
                  'relative shrink-0 rounded-xl border transition-all duration-200 overflow-hidden',
                  'h-16 w-16 sm:h-20 sm:w-20',
                  isActive
                    ? 'border-white ring-2 ring-white/20 opacity-100'
                    : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30',
                ].join(' ')}
                aria-label={`Go to media ${index + 1}`}
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.isNew ? item.url : fixR2Url(item.url)}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a]">
                    <Video className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
