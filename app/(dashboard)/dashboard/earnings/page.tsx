"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
  IndianRupee,
  Banknote,
} from "lucide-react";
import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import { LegendItem } from "@/components/ui/LegendItem";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/types/formats";
import { fetchKPIs, fetchMonthlyRevenue, fetchSalesList } from "@/services/analytics.service";
import { requestPayout, getMyPayouts } from "@/services/payout.service";
import { KpiData, MonthlyRevenue, ISalesData } from "@/types/analytics.interface";
import { IPayout, PayoutStatus } from "@/types/payout.interface";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function EarningsPage() {
  const { status } = useSession();
  const isEnabled = status === "authenticated";
  const queryClient = useQueryClient();
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  const {
    data: kpiData,
    isLoading: isLoadingKPIs,
    isError: isErrorKPIs,
    error: errorKPIs,
  } = useQuery<KpiData, Error>({
    queryKey: ["earningsKPIs"],
    queryFn: fetchKPIs,
    enabled: isEnabled,
  });

  const {
    data: revenueData = [],
    isLoading: isLoadingRevenue,
    isError: isErrorRevenue,
    error: errorRevenue,
  } = useQuery<MonthlyRevenue[], Error>({
    queryKey: ["monthlyRevenue"],
    queryFn: fetchMonthlyRevenue,
    enabled: isEnabled,
  });

  const {
    data: transactionsData = [],
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions,
  } = useQuery<ISalesData[], Error>({
    queryKey: ["salesList"],
    queryFn: fetchSalesList,
    enabled: isEnabled,
  });

  const {
    data: payoutsData = [],
    isLoading: isLoadingPayouts,
    isError: isErrorPayouts,
    error: errorPayouts,
  } = useQuery<IPayout[], Error>({
    queryKey: ["myPayouts"],
    queryFn: getMyPayouts,
    enabled: isEnabled,
  });

  const requestPayoutMutation = useMutation({
    mutationFn: requestPayout,
    onSuccess: () => {
      toast.success("Payout requested successfully!");
      queryClient.invalidateQueries({ queryKey: ["myPayouts"] });
      queryClient.invalidateQueries({ queryKey: ["earningsKPIs"] });
      setIsRequestingPayout(false);
    },
    onError: (error: Error & { response?: { data?: string | { message?: string; error?: string } } }) => {
      console.log("Payout Request Error:", error);
      // Try to get the specific error message from the backend response
      let errorMessage = "Failed to request payout.";

      if (error?.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setIsRequestingPayout(false);
    },
  });

  const handleRequestPayout = () => {
    if (!kpiData || kpiData.availableBalance < 100) {
      toast.error("Minimum payout amount is ₹100.");
      return;
    }
    setIsRequestingPayout(true);
    // Defaulting to BANK for now, can be enhanced to select mode
    requestPayoutMutation.mutate({ amount: kpiData.availableBalance, mode: "BANK" });
  };

  // Calculate max revenue for chart bars, ensuring it's not zero
  const maxRevenueChartValue =
    revenueData.length > 0
      ? Math.max(...revenueData.map((d) => d.amount), 0)
      : 0;
  // Use a minimum value for the chart scale if all amounts are 0, to avoid division by zero
  const chartScaleMax =
    maxRevenueChartValue > 0 ? maxRevenueChartValue * 1.1 : 1; // Add 10% headroom or default to 1

  // Take only the first 5 transactions for the preview
  const recentTransactions = transactionsData.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-light text-white">
          Earnings & Payouts
        </h1>
        <div className="flex flex-col items-end gap-1">
          <Button
            onClick={handleRequestPayout}
            disabled={isRequestingPayout || !kpiData || kpiData.availableBalance < 100}
            className="bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title={!kpiData || kpiData.availableBalance < 100 ? "Minimum payout amount is ₹100" : "Request a payout"}
          >
            {isRequestingPayout ? <Loader2 className="animate-spin mr-2" size={16} /> : <Banknote className="mr-2" size={16} />}
            Request Payout
          </Button>
          <div className="text-[10px] text-gray-400 text-right">
            <p>Min. payout: ₹100</p>
            <p>Processed (5 - 7 days)</p>
          </div>
        </div>
      </div>

      {/*  KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {isLoadingKPIs && (
          // Simple loading skeleton for KPIs
          <>
            <div className="h-24 rounded-2xl bg-[#1A1A1A] p-5 flex items-center justify-center">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
            <div className="h-24 rounded-2xl bg-[#1A1A1A] p-5 flex items-center justify-center">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
            <div className="h-24 rounded-2xl bg-[#1A1A1A] p-5 flex items-center justify-center">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          </>
        )}
        {isErrorKPIs && (
          <div className="md:col-span-3 text-red-400 p-5 bg-[#1A1A1A] rounded-2xl flex items-center justify-center gap-2">
            <AlertCircle size={20} />{" "}
            {errorKPIs?.message || "Could not load KPIs."}
          </div>
        )}
        {!isLoadingKPIs && !isErrorKPIs && kpiData && (
          <>
            {/* Total Revenue */}
            <div className="flex flex-col gap-2 rounded-2xl bg-[#1A1A1A] p-5">
              <span className="text-sm font-medium text-gray-400">
                Total Revenue
              </span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-semibold text-white">
                  {formatCurrency(kpiData.totalRevenue)}
                </span>
                <span
                  className={`flex items-center text-xs font-medium ${kpiData.totalRevenueChange >= 0
                    ? "text-green-700"
                    : "text-red-400"
                    }`}
                >
                  {kpiData.totalRevenueChange >= 0 ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {Math.abs(kpiData.totalRevenueChange).toFixed(1)}%
                </span>
              </div>
            </div>
            {/* Available Balance */}
            <div className="flex flex-col gap-2 rounded-2xl bg-[#1A1A1A] p-5">
              <span className="text-sm font-medium text-gray-400">
                Available for Payout
              </span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-semibold text-white">
                  {formatCurrency(kpiData.availableBalance)}
                </span>
                {/* No trend indicator */}
              </div>
            </div>
          </>
        )}
        {!isLoadingKPIs &&
          !isErrorKPIs &&
          !kpiData && ( // Case where data might be null/empty after successful fetch
            <div className="md:col-span-3 text-gray-500 p-5 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
              No KPI data available.
            </div>
          )}
      </div>

      {/* Revenue Chart */}
      <DashboardCard title="Revenue (Last 6 Months)">
        {isLoadingRevenue && (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}
        {isErrorRevenue && (
          <div className="h-64 flex items-center justify-center text-red-400 gap-2">
            <AlertCircle size={20} />{" "}
            {errorRevenue?.message || "Could not load revenue chart."}
          </div>
        )}
        {!isLoadingRevenue && !isErrorRevenue && revenueData.length > 0 && (
          <div className="h-64 w-full">
            <div className="flex h-full items-end justify-between gap-4">
              {revenueData.map((item) => {
                const barHeight =
                  Math.max((item.amount / chartScaleMax) * 100, item.amount > 0 ? 1 : 0);

                return (
                  <div
                    key={item.month + item.year}
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >
                    {/* Amount label */}
                    <div className="mb-1 text-[11px] text-gray-400">
                      {item.amount > 0 ? formatCurrency(item.amount) : '—'}
                    </div>

                    {/* Bar */}
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className="w-4/5 rounded-t-lg bg-green-600 transition-all hover:bg-green-700"
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>

                    {/* Month label */}
                    <span className="mt-2 text-xs text-gray-400">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isLoadingRevenue && !isErrorRevenue && revenueData.length === 0 && (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No revenue data for this period.
          </div>
        )}
      </DashboardCard>

      {/* Payout History */}
      <DashboardCard title="Payout History">
        {isLoadingPayouts && (
          <div className="w-full h-40 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}
        {isErrorPayouts && (
          <div className="w-full h-40 flex items-center justify-center text-red-400 gap-2 text-center p-4">
            <AlertCircle size={20} className="shrink-0" />
            {errorPayouts?.message || "Could not load payouts."}
          </div>
        )}
        {!isLoadingPayouts && !isErrorPayouts && payoutsData.length === 0 && (
          <div className="w-full h-40 flex items-center justify-center text-gray-500">
            No payout history found.
          </div>
        )}
        {!isLoadingPayouts && !isErrorPayouts && payoutsData.length > 0 && (
          <div className="w-full">
            <div className="hidden md:grid md:grid-cols-5 md:gap-4 border-b border-gray-700 pb-3 text-sm font-medium uppercase text-gray-400">
              <div>Date</div>
              <div>Amount</div>
              <div>Mode</div>
              <div>Status</div>
              <div className="text-right">Failure Reason</div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {payoutsData.map((payout) => (
                <div key={payout._id} className="flex flex-col gap-3 rounded-lg bg-[#0D0D0D] p-4 md:grid md:grid-cols-5 md:items-center md:gap-4 md:p-3 transition-colors hover:bg-[#262626]">
                  <div className="text-sm text-gray-300">
                    {new Date(payout.requestedAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium text-white">
                    {formatCurrency(payout.amount)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {payout.mode}
                  </div>
                  <div>
                    <LegendItem
                      colorClass={
                        payout.status === PayoutStatus.PROCESSED
                          ? "bg-green-700"
                          : payout.status === PayoutStatus.PENDING
                            ? "bg-yellow-400"
                            : "bg-red-500"
                      }
                      text={payout.status}
                    />
                  </div>
                  <div className="text-sm text-red-400 text-right">
                    {payout.failureReason || "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DashboardCard>


      {/*  Transaction History Table */}
      <DashboardCard title="Transaction History" className="overflow-hidden">
        {isLoadingTransactions && (
          <div className="w-full h-40 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}
        {isErrorTransactions && (
          <div className="w-full h-40 flex items-center justify-center text-red-400 gap-2 text-center p-4">
            <AlertCircle size={20} className="shrink-0" />
            {errorTransactions?.message || "Could not load transactions."}
          </div>
        )}
        {!isLoadingTransactions &&
          !isErrorTransactions &&
          transactionsData.length === 0 && (
            <div className="w-full h-40 flex items-center justify-center text-gray-500">
              No transactions found.
            </div>
          )}
        {!isLoadingTransactions &&
          !isErrorTransactions &&
          transactionsData.length > 0 && (
            <div className="w-full">
              {/* Table Header - Hidden on Mobile (md:grid) */}
              <div className="hidden md:grid md:grid-cols-7 md:gap-4 border-b border-gray-700 pb-3 text-sm font-medium uppercase text-gray-400">
                <div className="col-span-2">Product</div>
                <div className="col-span-2">Customer</div>
                <div>Date</div>
                <div className="text-right">Earnings</div>
                <div className="text-right">Status</div>
              </div>

              {/* Table Body */}
              <div className="mt-4 flex flex-col gap-4">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.orderId}
                    className="
                    flex flex-col gap-3 rounded-lg bg-[#0D0D0D] p-4
                    md:grid md:grid-cols-7 md:items-center md:gap-4 md:p-3
                    transition-colors hover:bg-[#262626]
                  "
                  >
                    {/* Product */}
                    <div className="md:col-span-2 font-medium text-white truncate text-base md:text-sm mb-1 md:mb-0" title={tx.productName}>
                      {tx.productName || "Deleted Product"}
                    </div>

                    {/* Customer */}
                    <div className="md:col-span-2 flex justify-between items-center md:block">
                      <span className="text-sm text-gray-500 md:hidden">
                        Customer:
                      </span>
                      <div className="text-sm text-gray-300 truncate text-right md:text-left">
                        <div className="truncate" title={tx.customerName}>{tx.customerName || "N/A"}</div>
                        <div className="text-xs text-gray-500 truncate" title={tx.customerEmail}>{tx.customerEmail}</div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex justify-between items-center md:block">
                      <span className="text-sm text-gray-500 md:hidden">
                        Date:
                      </span>
                      <div className="text-sm text-gray-300 whitespace-nowrap text-right md:text-left">
                        {tx.orderDate}
                      </div>
                    </div>

                    {/* Earnings */}
                    <div className="flex justify-between items-center md:block">
                      <span className="text-sm text-gray-500 md:hidden">
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
                      <span className="text-sm text-gray-500 md:hidden">
                        Status:
                      </span>
                      <div className="flex justify-end">
                        <LegendItem
                          colorClass={
                            tx.status === "Completed"
                              ? "bg-green-700"
                              : tx.status === "Pending"
                                ? "bg-yellow-400"
                                : "bg-red-500"
                          }
                          text={tx.status}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Link */}
              <div className="mt-6 text-center">
                <Link
                  href="/dashboard/transactions"
                  className="text-xs text-gray-400 hover:text-white hover:underline"
                >
                  View All Transactions &rarr;
                </Link>
              </div>
            </div>
          )}
      </DashboardCard>
    </div>
  );
}
