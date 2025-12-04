import React from 'react';
import { LegendItemProps } from '@/types'; // Adjust path if needed

export function LegendItem({ colorClass, text }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${colorClass}`}></span>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
}