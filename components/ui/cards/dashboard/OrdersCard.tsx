"use client";

import React from "react";
import { DashboardCard } from "./DashboardCard";
import { TrendIndicator } from "@/components/ui/icons/TrendIndicator";
import { Loader2, AlertCircle } from "lucide-react";
// import api from "@/lib/api";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

interface OrderCountsData {
  totalOrders: number;
  ordersLast30Days: number;
  ordersPrev30Days: number;
}

import { mockOrders } from "@/data/mock";

const fetchOrderCounts = async (): Promise<OrderCountsData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const totalOrders = mockOrders.length;
  // Mock logic for 30 days
  const ordersLast30Days = mockOrders.length;
  const ordersPrev30Days = 0;

  return {
    totalOrders,
    ordersLast30Days,
    ordersPrev30Days
  };
};

export function OrdersCard() {
  const { status } = useSession();

  const {
    data: orderCounts,
    isLoading,
    isError,
    error,
  } = useQuery<OrderCountsData, Error>({
    queryKey: ["orderCounts"],
    queryFn: fetchOrderCounts,
    enabled: status === "authenticated",
  });

  // --- Calculate Trend ---
  let percentageChange = 0;
  let trend: "up" | "down" | "neutral" = "neutral";

  if (orderCounts) {
    const { ordersLast30Days, ordersPrev30Days } = orderCounts;

    if (ordersPrev30Days > 0) {
      percentageChange =
        ((ordersLast30Days - ordersPrev30Days) / ordersPrev30Days) * 100;
    } else if (ordersLast30Days > 0) {
      percentageChange = 100;
    }

    if (percentageChange > 0) trend = "up";
    else if (percentageChange < 0) trend = "down";
  }

  const cardMenu = [
    {
      label: "View All Orders",
      href: "/dashboard/orders",
    },
  ];

  return (
    <DashboardCard
      title="Orders"
      className="min-h-[200px]"
      menuItems={cardMenu}
    >
      <div className="flex h-full flex-col justify-between">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Unauthenticated */}
        {!isLoading && status === "unauthenticated" && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">Log in to view orders.</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-400">
              {error?.message || "Could not load order data."}
            </p>
          </div>
        )}

        {/* Data */}
        {!isLoading &&
          !isError &&
          status === "authenticated" &&
          (orderCounts && orderCounts.totalOrders > 0 ? (
            <>
              <div className="flex items-start justify-between gap-6">
                {/* Total orders */}
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-semibold text-white tabular-nums">
                    {orderCounts.totalOrders}
                  </span>
                  <span className="text-sm text-gray-400">Total Orders</span>
                </div>

                {/* Last 30 days + trend */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-2xl font-semibold text-white tabular-nums">
                    {orderCounts.ordersLast30Days}
                  </span>
                  <TrendIndicator
                    trend={trend}
                    percentage={percentageChange}
                    label="vs prev 30d"
                  />
                  <span className="text-sm text-gray-400">
                    Orders (30d)
                  </span>
                </div>
              </div>
            </>
          ) : (
            // No orders yet
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500">No orders yet.</p>
            </div>
          ))}

        {/* Authenticated but no data object at all */}
        {!isLoading &&
          !isError &&
          !orderCounts &&
          status === "authenticated" && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500">No orders yet.</p>
            </div>
          )}
      </div>
    </DashboardCard>
  );
}
