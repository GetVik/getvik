'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardCard } from '@/components/ui/cards/dashboard/DashboardCard';
// import api from '@/lib/api';
import { Loader2, AlertCircle, Package, Trophy } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

interface TopProductData {
  _id: string;
  salesCount: number;
  productDetails: {
    _id: string;
    title: string;
    slug: string;
  };
}


const ProductIcon = ({
  rank,
}: {
  rank: number;
}) => {
  // Gold for 1st, Silver for 2nd, Bronze for 3rd, Gray for others
  let colorClass = 'text-gray-400';
  if (rank === 1) colorClass = 'text-yellow-400';
  else if (rank === 2) colorClass = 'text-gray-300';
  else if (rank === 3) colorClass = 'text-amber-600';

  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] ${colorClass}`}>
      {rank <= 3 ? <Trophy size={14} /> : <Package size={14} />}
    </div>
  );
};


import { mockProducts } from "@/data/mock";

const fetchTopProducts = async (): Promise<TopProductData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Map mock products to TopProductData structure
  return mockProducts.slice(0, 5).map(p => ({
    _id: p._id,
    salesCount: Math.floor(Math.random() * 100) + 10, // Random sales count for demo
    productDetails: {
      _id: p._id,
      title: p.title,
      slug: p.slug
    }
  }));
};

export function TopProductsCard() {
  const { status } = useSession();

  const {
    data: topProducts = [],
    isLoading,
    isError,
    error,
  } = useQuery<TopProductData[], Error>({
    queryKey: ['topProducts'],
    queryFn: fetchTopProducts,
    enabled: status === 'authenticated',
  });

  return (
    <DashboardCard title="Top Products (Last 30d)" className="h-full min-h-[300px] overflow-y-auto">
      <div className="flex h-full flex-col justify-between">


        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}


        {isError && (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-400">{error?.message || 'Could not load top products.'}</p>
          </div>
        )}


        {!isLoading && !isError && topProducts.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-10">
            <p className="text-gray-500">No product sales data yet.</p>
          </div>
        )}


        {!isLoading && !isError && topProducts.length > 0 && (
          <div className="flex flex-col gap-5">
            {topProducts.map((product, index) => {
              const rank = index + 1;

              return (
                <div key={product._id} className="flex items-start gap-3 group">
                  {/* Left: Icon */}
                  <ProductIcon rank={rank} />

                  {/* Middle: Title & Subtitle */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dashboard/products/edit/${product.productDetails._id}`}
                      className="block text-sm font-medium text-white truncate transition-colors duration-200 hover:text-green-700"
                      title={product.productDetails.title}
                    >
                      {product.productDetails.title}
                    </Link>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      Rank #{rank}
                    </p>
                  </div>

                  {/* Right: Stats */}
                  <div className="flex flex-col items-end text-right shrink-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      Total Sales
                    </span>
                    <span className="mt-1 flex items-center text-xs font-semibold text-green-700 tabular-nums">
                      {product.salesCount} units
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {!isLoading && !isError && (
          <div className="mt-8 border-t border-gray-700/50 pt-4 text-center">
            <Link
              href="/dashboard/analytics"
              className="text-xs text-gray-400 transition-colors duration-200 hover:text-white hover:underline"
            >
              View All Product Analytics
            </Link>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}