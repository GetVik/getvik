"use client";

import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { TrendIndicator } from "@/components/ui/icons/TrendIndicator";

import { formatCurrency } from "@/types/formats";

interface RevenueData {
  totalRevenue: number;
  revenueLast30Days: number;
  revenuePrev30Days: number;
  availableBalance: number;
}

import { mockRevenueData } from "@/data/mock";

const fetchRevenueData = async (): Promise<RevenueData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockRevenueData;
};

export function EarningsCard() {
  const { status } = useSession();

  const {
    data: revenueData,
    isLoading,
    isError,
    error,
  } = useQuery<RevenueData, Error>({
    queryKey: ["revenueCardData"],
    queryFn: fetchRevenueData,
    enabled: status === "authenticated",
  });

  // --- Calculate Trend ---
  let percentageChange = 0;
  let trend: "up" | "down" | "neutral" = "neutral";

  if (revenueData) {
    const { revenueLast30Days, revenuePrev30Days } = revenueData;

    if (revenuePrev30Days > 0) {
      percentageChange =
        ((revenueLast30Days - revenuePrev30Days) / revenuePrev30Days) * 100;
    } else if (revenueLast30Days > 0) {
      percentageChange = 100;
    }

    if (percentageChange > 0) trend = "up";
    else if (percentageChange < 0) trend = "down";
  }

  const cardMenu = [
    {
      label: "View details",
      href: "/dashboard/earnings",
    },
  ];

  return (
    <DashboardCard title="Earnings" menuItems={cardMenu} className="min-h-[200px]">
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
            <p className="text-gray-500">Log in to view earnings.</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-400">
              {error?.message || "Could not load earnings data."}
            </p>
          </div>
        )}

        {/* Data */}
        {!isLoading &&
          !isError &&
          status === "authenticated" &&
          (revenueData && revenueData.totalRevenue > 0 ? (
            <>
              <div className="flex items-start justify-between gap-6">
                {/* Total revenue */}
                <div className="flex flex-col gap-1">
                  <span className="flex items-center text-2xl font-semibold text-white tabular-nums">
                    {formatCurrency(revenueData.totalRevenue)}
                  </span>
                  <span className="text-sm text-gray-400">Total Revenue</span>
                </div>

                {/* Last 30 days + trend */}
                <div className="flex flex-col items-end gap-1">
                  <span className="flex items-center text-2xl font-semibold text-white tabular-nums">
                    {formatCurrency(revenueData.revenueLast30Days)}
                  </span>
                  <TrendIndicator
                    trend={trend}
                    percentage={percentageChange}
                    label="vs prev 30d"
                  />
                  <span className="text-sm text-gray-400">
                    Earnings (30d)
                  </span>
                </div>
              </div>

              {/* Footer: available balance */}
              <div className="mt-6 border-t border-gray-700/50 pt-4 text-center px-2">
                <span className="text-sm text-gray-400">Available: </span>
                <span className="font-semibold text-white tabular-nums">
                  {formatCurrency(revenueData.availableBalance)}
                </span>
              </div>
            </>
          ) : (
            // No earnings yet
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500">No earnings data yet.</p>
            </div>
          ))}

        {/* Authenticated but no data object at all */}
        {!isLoading &&
          !isError &&
          !revenueData &&
          status === "authenticated" && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500">No earnings data yet.</p>
            </div>
          )}
      </div>
    </DashboardCard>
  );
}
