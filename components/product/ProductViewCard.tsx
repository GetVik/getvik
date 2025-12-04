'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Loader2, AlertCircle } from 'lucide-react';
// import api from '@/lib/api';
import { DashboardCard } from '../ui/cards/dashboard/DashboardCard';
import type { ProductViewSummary } from '@/types/analytics.interface';
import { useSession } from 'next-auth/react';
import { fetchProductViews } from "@/services/analytics.service";

interface ProductViewsCardProps {
  productId: string;
  days?: number; // default 30
}

export function ProductViewsCard({ productId, days = 30 }: ProductViewsCardProps) {
  const { status } = useSession();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<ProductViewSummary, Error>({
    queryKey: ['productViews', productId, days],
    queryFn: () => fetchProductViews(productId),
    enabled: status === 'authenticated' && !!productId,
  });

  const totalViews = data?.totalViews ?? 0;
  const lastPeriodViews = data?.viewsLastNDays ?? 0;

  // Quick trend vs previous window (very rough: compare lastNDays vs total - lastNDays)
  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  let percentageChange = 0;

  if (data) {
    const previousWindow = Math.max(data.totalViews - data.viewsLastNDays, 0);
    if (previousWindow > 0) {
      percentageChange =
        ((data.viewsLastNDays - previousWindow) / previousWindow) * 100;
    } else if (data.viewsLastNDays > 0) {
      percentageChange = 100;
    }

    if (percentageChange > 0) trend = 'up';
    else if (percentageChange < 0) trend = 'down';
  }

  const trendColor =
    trend === 'up'
      ? 'text-green-700'
      : trend === 'down'
        ? 'text-red-400'
        : 'text-gray-400';

  const menuItems = [
    {
      label: 'View traffic details',
      href: '#', // later you can add a dedicated analytics page
    },
  ];

  return (
    <DashboardCard title="Views" menuItems={menuItems} className="min-h-[220px]">
      <div className="flex h-full flex-col justify-between">
        {/* states */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {!isLoading && status === 'unauthenticated' && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">Log in to view analytics.</p>
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-400">
              {error?.message || 'Could not load view analytics.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && status === 'authenticated' && data && (
          <>
            {/* Top: stats */}
            <div className="flex items-start justify-between gap-4">
              {/* Total views */}
              <div className="flex flex-col">
                <span className="flex items-center text-3xl font-semibold text-white">
                  <Eye className="h-5 w-5 mr-1 text-gray-300" />
                  {totalViews.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-gray-400">Total views</span>
              </div>

              {/* Last N days */}
              <div className="flex flex-col items-end">
                <span className="text-3xl font-semibold text-white">
                  {lastPeriodViews.toLocaleString('en-IN')}
                </span>
                <span
                  className={`mt-1 flex items-center text-sm ${trendColor}`}
                >
                  {trend !== 'neutral' && (
                    <span className="mr-1">
                      {trend === 'up' ? '▲' : '▼'}
                    </span>
                  )}
                  {Math.abs(percentageChange).toFixed(1)}% vs prev {days}d
                </span>
                <span className="mt-1 text-sm text-gray-400">
                  Views (last {days} days)
                </span>
              </div>
            </div>

            {/* Middle: mini traffic source legend */}
            {Object.keys(data.viewsBySource).length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                  Top sources
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(data.viewsBySource)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([source, count]) => (
                      <span
                        key={source}
                        className="inline-flex items-center rounded-full bg-[#1a1a1a] px-2.5 py-1 text-gray-300 border border-[#2a2a2a]"
                      >
                        <span className="mr-1 text-[10px] uppercase text-gray-500">
                          {source}
                        </span>
                        <span className="text-xs font-medium">
                          {count.toLocaleString('en-IN')}
                        </span>
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Bottom: tiny sparkline-style bars from daily data */}
            {data.daily.length > 0 && (
              <div className="mt-4 border-t border-gray-800 pt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Last {days} days</span>
                  <span>{data.daily.length} active days</span>
                </div>
                <div className="flex h-16 items-end gap-0.5">
                  {data.daily.map((d) => (
                    <div
                      key={d.date}
                      className="flex-1 rounded-full bg-gray-700/40"
                    >
                      <div
                        className="w-full rounded-full bg-gray-100"
                        style={{
                          height: `${Math.min(
                            100,
                            (d.views /
                              Math.max(
                                ...data.daily.map((x) => x.views),
                                1,
                              )) * 100,
                          )}%`,
                        }}
                        title={`${d.date}: ${d.views} views`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading &&
          !isError &&
          status === 'authenticated' &&
          !data && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500">No view data yet.</p>
            </div>
          )}
      </div>
    </DashboardCard>
  );
}
