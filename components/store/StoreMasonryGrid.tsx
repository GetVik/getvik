'use client';

import { useState, useEffect, useMemo } from 'react';
import { IStoreProduct } from '@/types/types';
import { ProductCard } from '@/components/ui/cards/ProductCard';

interface StoreMasonryGridProps {
  products: IStoreProduct[];
  storeSlug: string;
}

export function StoreMasonryGrid({ products, storeSlug }: StoreMasonryGridProps) {
  // Start with 1 column to match server-side render (mobile first) or 3 for desktop
  // Using 1 prevents hydration mismatch flicker usually, but 3 looks better if desktop.
  // We will adjust immediately in useEffect.
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumnCount(3); // Desktop
      else if (window.innerWidth >= 640) setColumnCount(2); // Tablet
      else setColumnCount(1); // Mobile
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const distributedProducts = useMemo(() => {
    const columns: IStoreProduct[][] = Array.from({ length: columnCount }, () => []);
    products.forEach((product, index) => {
      columns[index % columnCount].push(product);
    });
    return columns;
  }, [products, columnCount]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-48 md:h-64 bg-[#0A0A0A] rounded-2xl border border-dashed border-white/10">
        <p className="text-gray-400 font-medium text-sm">No products available</p>
      </div>
    );
  }

  return (
    /* FLEX MASONRY LAYOUT 
       - Flex row container
       - items-start (Prevents column stretching)
       - gap-6 (Horizontal spacing)
    */
    <div className="flex flex-row gap-4 md:gap-6 items-start w-full transition-opacity duration-500 ease-in-out">
      {distributedProducts.map((colProducts, colIndex) => (
        <div key={colIndex} className="flex flex-col flex-1 gap-6 w-full min-w-0">
          {colProducts.map((product) => (
            <ProductCard 
                key={String(product._id)} 
                product={product} 
                storeSlug={storeSlug} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}