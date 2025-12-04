'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { fixR2Url } from '@/lib/image.utils';

interface AvatarWithFallbackProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
  fallbackText?: string;
}

export function AvatarWithFallback({
  src,
  alt,
  size = 40,
  className = '',
  fallbackText,
}: AvatarWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  // If no src or image failed to load, show icon fallback
  if (!src || imageError) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#2A2A2A] ${className}`}
        style={{ width: size, height: size }}
        title={alt}
      >
        {fallbackText ? (
          <span className="text-white font-medium text-sm">
            {fallbackText.charAt(0).toUpperCase()}
          </span>
        ) : (
          <User size={size * 0.6} className="text-gray-400" />
        )}
      </div>
    );
  }

  return (
    <Image
      src={fixR2Url(src)}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full bg-[#2A2A2A] ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
