'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  IndianRupee,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { DashboardCard } from './DashboardCard';
// import { fetchRecentOrders } from '@/services/analytics.service';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { ICreatorOrder } from '@/types/types';
import { useQuery } from '@tanstack/react-query'; // Import useQuery

const ActivityIcon = ({
  icon: Icon,
  color,
}: {
  icon: React.ElementType;
  color: string;
}) => (
  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] ${color}`}>
    <Icon size={16} />
  </div>
);

// Helper to format time
const formatTimeAgo = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

// --- API Fetch Function ---


// --- Main Component ---
import { mockOrders } from "@/data/mock";

const fetchRecentOrders = async (): Promise<ICreatorOrder[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders;
}

export function ActivityCard() {
  const { status } = useSession();

  // --- Refactored to useQuery ---
  const {
    data: orders = [], // Default to empty array
    isLoading,
    isError,
    error,
  } = useQuery<ICreatorOrder[], Error>({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentOrders,
    enabled: status === 'authenticated',
  });

  return (
    <DashboardCard title="Recent Activity" className="h-full max-h-[500px] overflow-y-auto">
      {isLoading && (
        <div className="flex flex-1 items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {isError && (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-red-400">{error?.message || 'Could not load recent activity.'}</p>
        </div>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-gray-500">No recent activity yet.</p>
        </div>
      )}

      {/* --- Activity Feed List --- */}
      {!isLoading && !isError && orders.length > 0 && (
        <div className="flex flex-col gap-5">
          {orders.map((order) => {
            const activityType = 'Sale';
            const icon = ShoppingBag;
            const color = 'text-green-700';
            const productTitle = order.productId?.title || 'Deleted Product';
            const customerName = order.buyerId?.name || order.buyerId?.email || 'Unknown Customer';

            return (
              <div key={order._id} className="flex items-start gap-3 group">
                <ActivityIcon icon={icon} color={color} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {activityType}: {productTitle}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    Customer: {customerName}
                  </p>
                </div>

                <div className="flex flex-col items-end text-right shrink-0">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatTimeAgo(order.createdAt)}
                  </span>
                  {activityType === 'Sale' && order.amount != null && (
                    <span className="mt-1 flex items-center text-xs font-semibold text-green-700 tabular-nums">
                      +<IndianRupee size={12} className="mx-0.5" />
                      {order.amount.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- Footer Link (Show even if no data) --- */}
      {!isLoading && !isError && (
        <div className="mt-8 border-t border-gray-700/50 pt-4 text-center">
          <Link
            href="/dashboard/orders" // Link to a full orders/activity page
            className="text-xs text-gray-400 transition-colors duration-200 hover:text-white hover:underline"
          >
            View All Activity
          </Link>
        </div>
      )}
    </DashboardCard>
  );
}
