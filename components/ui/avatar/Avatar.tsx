"use client"; // Needs to be a client component for onError handler

import Image from 'next/image';
import React from 'react';
import { AvatarProps } from '@/types'; // Adjust path if needed

export function Avatar({ src, alt, className = 'h-6 w-6' }: AvatarProps) {
  return (
        <Image
      src={src}
      alt={alt}
      width={24}
      height={24}
      className={`rounded-full border-2 border-gray-800 ${className}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          'https://placehold.co/24x24/E0E0E0/000000?text=?';
      }}
    />
  );
}

export function AvatarStack({ avatars }: { avatars: string[] }) {
  return (
    <div className="flex -space-x-2">
      {avatars.map((src, i) => (
        <Avatar
          key={i}
          src={src}
          alt={`Avatar ${i + 1}`}
          className="h-6 w-6"
        />
      ))}
    </div>
  );
}