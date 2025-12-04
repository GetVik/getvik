'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  Loader2,
  IndianRupee,
  Search,
  FilterX,
} from 'lucide-react';

import { fetchSalesList } from '@/services/analytics.service';
import { ISalesData } from '@/types/analytics.interface';
import { DashboardCard } from '@/components/ui/cards/dashboard/DashboardCard';
import { LegendItem } from '@/components/ui/LegendItem';
import { formatCurrency } from '@/types/formats';

type StatusFilter = 'all' | 'Completed' | 'Pending' | 'Failed';

export default function TransactionsPage() {
  const { status } = useSession();
  const isEnabled = status === 'authenticated';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [visibleCount, setVisibleCount] = useState(8); // max shown initially

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery<ISalesData[], Error>({
    queryKey: ['salesList'],
    queryFn: fetchSalesList,
    enabled: isEnabled,
  });

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'all' ? true : order.status === statusFilter;

      if (!matchesStatus) return false;
      if (!term) return true;

      const productTitle = order.productName?.toLowerCase() ?? '';
      const buyerName = order.customerName?.toLowerCase() ?? '';
      const buyerEmail = order.customerEmail?.toLowerCase() ?? '';
      const orderId = order.orderId?.toLowerCase() ?? '';

      return (
        productTitle.includes(term) ||
        buyerName.includes(term) ||
        buyerEmail.includes(term) ||
        orderId.includes(term)
      );
    });
  }, [orders, searchTerm, statusFilter]);

  // Reset visibleCount whenever filters/search/order set changes
  useEffect(() => {
    setVisibleCount(8);
  }, [searchTerm, statusFilter, orders.length]);

  const hasAnyData = !isLoading && !isError && orders.length > 0;

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredOrders.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl px-2 font-light text-white">
            Transactions
          </h1>
          <p className="px-2 mt-1 text-sm text-gray-500">
            View all orders and payouts for your products.
          </p>
        </div>
        <div className="px-2 mt-2 sm:mt-0">
          <Link
            href="/dashboard/earnings"
            className="text-xs text-gray-400 hover:text-white hover:underline"
          >
            ← Back to Earnings
          </Link>
        </div>
      </div>

      <DashboardCard title="All Transactions" className="overflow-hidden">
        {/* Controls: search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product, customer or ID..."
              className="w-full rounded-lg bg-[#151515] border border-[#2b2b2b] px-9 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40"
            />
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusFilter === 'all'
                ? 'bg-white text-black'
                : 'bg-[#151515] text-gray-300 hover:bg-[#262626]'
                }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Completed')}
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusFilter === 'Completed'
                ? 'bg-green-700 text-black'
                : 'bg-[#151515] text-gray-300 hover:bg-[#262626]'
                }`}
            >
              Completed
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Failed')}
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusFilter === 'Failed'
                ? 'bg-red-500 text-black'
                : 'bg-[#151515] text-gray-300 hover:bg-[#262626]'
                }`}
            >
              Failed
            </button>
            {(statusFilter !== 'all' || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-gray-400 hover:text-gray-200"
              >
                <FilterX size={12} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Loading / error / empty states */}
        {isLoading && (
          <div className="w-full h-40 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}

        {isError && (
          <div className="w-full h-40 flex items-center justify-center text-red-400 gap-2 text-center p-4">
            <AlertCircle size={20} className="shrink-0" />
            {error?.message || 'Could not load transactions.'}
          </div>
        )}

        {!isLoading && !isError && !hasAnyData && (
          <div className="w-full h-40 flex items-center justify-center text-gray-500">
            No transactions found yet.
          </div>
        )}

        {!isLoading && !isError && hasAnyData && (
          <div className="w-full">
            {/* Table header (desktop) */}
            <div className="hidden md:grid md:grid-cols-8 md:gap-4 border-b border-gray-700 pb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              <div className="col-span-2">Product</div>
              <div className="col-span-2">Customer</div>
              <div>Date</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Earnings</div>
              <div className="text-right">Status</div>
            </div>

            {/* Rows */}
            <div className="mt-4 flex flex-col gap-3">
              {visibleOrders.map((tx) => (
                <div
                  key={tx.orderId}
                  className="
                    flex flex-col gap-3 rounded-lg bg-[#0D0D0D] p-4
                    md:grid md:grid-cols-8 md:items-center md:gap-4 md:p-3
                    transition-colors hover:bg-[#262626]
                  "
                >
                  {/* Product */}
                  <div className="md:col-span-2 font-medium text-white truncate text-base md:text-sm mb-1 md:mb-0" title={tx.productName}>
                    {tx.productName || 'Deleted Product'}
                  </div>

                  {/* Customer */}
                  <div className="md:col-span-2 flex justify-between items-center md:block">
                    <span className="text-xs text-gray-500 md:hidden">
                      Customer:
                    </span>
                    <div className="text-sm text-gray-300 truncate text-right md:text-left">
                      <div className="truncate" title={tx.customerName}>{tx.customerName || 'N/A'}</div>
                      <div className="text-xs text-gray-500 truncate" title={tx.customerEmail}>{tx.customerEmail}</div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex justify-between items-center md:block">
                    <span className="text-xs text-gray-500 md:hidden">
                      Date:
                    </span>
                    <div className="text-sm text-gray-300 whitespace-nowrap text-right md:text-left">
                      {tx.orderDate}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex justify-between items-center md:block">
                    <span className="text-xs text-gray-500 md:hidden">
                      Amount:
                    </span>
                    <div className="flex items-center justify-end text-sm font-medium text-gray-400 md:justify-end">
                      <IndianRupee size={13} className="mr-0.5" />
                      {formatCurrency(tx.amount)}
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="flex justify-between items-center md:block">
                    <span className="text-xs text-gray-500 md:hidden">
                      Earnings:
                    </span>
                    <div className="flex flex-col items-end md:items-end">
                      <div className="flex items-center justify-end text-sm font-medium text-white">
                        <IndianRupee size={13} className="mr-0.5" />
                        {formatCurrency(tx.creatorEarnings)}
                      </div>
                      {tx.platformFee > 0 && (
                        <div className="text-[10px] text-gray-500">
                          Fee: ₹{tx.platformFee}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-center md:block">
                    <span className="text-xs text-gray-500 md:hidden">
                      Status:
                    </span>
                    <div className="flex justify-end md:justify-end">
                      <LegendItem
                        colorClass={
                          tx.status === 'Completed'
                            ? 'bg-green-700'
                            : tx.status === 'Pending'
                              ? 'bg-yellow-400'
                              : 'bg-red-500'
                        }
                        text={tx.status}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more */}
            {canLoadMore && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((prev) => prev + 8)
                  }
                  className="rounded-full bg-[#151515] px-4 py-2 text-xs font-medium text-gray-200 hover:bg-[#262626]"
                >
                  Load more
                </button>
              </div>
            )}

            {/* Summary footer */}
            <div className="mt-6 flex flex-col items-start justify-between gap-2 border-t border-gray-800 pt-4 text-xs text-gray-500 sm:flex-row sm:items-center">
              <span>
                Showing {visibleOrders.length} of {filteredOrders.length}{' '}
                filtered transaction
                {filteredOrders.length !== 1 ? 's' : ''} (total{' '}
                {orders.length}).
              </span>
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
