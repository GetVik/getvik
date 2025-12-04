"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueries } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import { StatCard } from "@/components/ui/cards/dashboard/StatCard";
import toast from 'react-hot-toast';
import { useAI } from "@/hooks/useAI";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import {
  Loader2,
  AlertCircle,
  BarChart2,
  Trophy,
  Users,
  Eye,
  TrendingUp,
  Download,
  ExternalLink,
} from "lucide-react";

import {
  TopProduct,
  ITrafficAnalytics,
  ICustomerAnalytics,
} from "@/types/analytics.interface";

import { fetchCustomerList, fetchProductViews, fetchTopProducts, fetchTrafficAnalytics, downloadSalesReport } from "@/services/analytics.service";
import { UpgradeToProNotice } from "@/components/dashboard/analytics/UpgradeNotice";
import { AIInsightsCard } from "@/components/dashboard/analytics/AiInsightsCard";

export default function AnalyticsPage() {
  const { data: session, status: authStatus } = useSession();
  const storeSlug = session?.user?.storeSlug;


  const { triggerInsights, isLoading: aiLoading, showUpgradeModal, setShowUpgradeModal } = useAI();
  const [aiInsights, setAiInsights] = useState<{ summary: string; actionableInsights: string[] } | null>(null);


  const topProductsQuery = useQuery<TopProduct[], Error>({
    queryKey: ["topProducts"],
    queryFn: fetchTopProducts,
    enabled: authStatus === "authenticated",
    retry: false,
  });

  const trafficQuery = useQuery<ITrafficAnalytics, Error>({
    queryKey: ["trafficAnalytics"],
    queryFn: fetchTrafficAnalytics,
    enabled: authStatus === "authenticated",
    retry: false,
  });

  const customersQuery = useQuery<ICustomerAnalytics[], Error>({
    queryKey: ["customerList"],
    queryFn: fetchCustomerList,
    enabled: authStatus === "authenticated",
    retry: false,
  });


  const productViewsQueries = useQueries({
    queries: (topProductsQuery.data ?? []).map((p) => ({
      queryKey: ["productViews", p._id],
      queryFn: () => fetchProductViews(p._id),
      enabled: authStatus === "authenticated",
    })),
  });


  const downloadMutation = useMutation({
    mutationFn: downloadSalesReport,
    onSuccess: () => toast.success('Sales report downloaded successfully!'),
    onError: (err: Error) => toast.error(`Failed to download report: ${err.message}`),
  });


  const topProducts = topProductsQuery.data ?? [];
  const traffic = trafficQuery.data;
  const customers = customersQuery.data ?? [];


  const handleGenerateInsights = async () => {
    const result = await triggerInsights();

    if (result) {
      setAiInsights(result);

      toast.success('AI insights generated successfully!');
    }
  };


  const isLoading =
    authStatus === "loading" ||
    topProductsQuery.isLoading ||
    trafficQuery.isLoading ||
    customersQuery.isLoading;

  if (isLoading) {
    return (
      <DashboardCard title="Loading Analytics...">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        </div>
      </DashboardCard>
    );
  }


  const error = topProductsQuery.error || trafficQuery.error || customersQuery.error;

  if (error) {
    const err = error as Error;
    if ('status' in err && (err as any).status === 403) {
      return <UpgradeToProNotice />;
    }
    return (
      <DashboardCard title="Error">
        <div className="flex flex-col items-center justify-center h-96 text-red-400 text-center">
          <AlertCircle className="h-10 w-10 mb-2" />
          <h3 className="text-lg font-semibold">Error Loading Analytics</h3>
          <p className="text-sm">{err.message}</p>
        </div>
      </DashboardCard>
    );
  }


  if (!traffic) return null;

  return (
    <div className="flex flex-col gap-6">

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />


      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-6 w-6 text-gray-400" />
          <h1 className="text-2xl font-light text-white">Analytics</h1>
        </div>

        <button
          onClick={() => downloadMutation.mutate()}
          disabled={downloadMutation.isPending}
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-gray-600 disabled:opacity-50"
        >
          {downloadMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {downloadMutation.isPending ? "Generating..." : "Sales Report"}
        </button>
      </div>


      <AIInsightsCard
        onGenerate={handleGenerateInsights}
        isLoading={aiLoading}
        insights={aiInsights}
      />


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Views"
          value={traffic.totalViews.toLocaleString("en-IN")}
          icon={Eye}
        />
        <StatCard
          title="Total Sales"
          value={traffic.totalSales.toLocaleString("en-IN")}
          icon={Users}
        />
        <StatCard
          title="Conversion Rate"
          value={`${traffic.conversionRate}%`}
          icon={TrendingUp}
        />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <DashboardCard title="Top Products" className="md:col-span-2">
          {topProducts.length === 0 ? (
            <p className="text-gray-500 p-6 text-center">No sales data yet.</p>
          ) : (
            topProducts.map((product, index) => {
              const viewsQuery = productViewsQueries[index];
              const views = viewsQuery?.data?.viewsLastNDays ?? 0;
              const sales = product.salesCount;

              return (
                <div
                  key={product._id}
                  className="flex flex-col gap-3 w-full py-4 border-b border-gray-700/50 last:border-b-0 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Trophy
                      size={18}
                      className={
                        index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-400" : "text-yellow-700"
                      }
                    />
                    <div className="flex flex-col min-w-0">
                      <Link
                        href={`/store/${storeSlug}/product/${product.productDetails.slug}`}
                        target="_blank"
                        className="text-sm sm:text-base font-medium text-white hover:underline truncate"
                        title={product.productDetails.title}
                      >
                        {product.productDetails.title}
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm md:justify-end">
                    <span className="text-gray-400 min-w-[90px] text-left md:text-right">
                      {viewsQuery?.isLoading ? "Loading…" : `${views.toLocaleString("en-IN")} views`}
                    </span>
                    <span className="text-gray-400 min-w-[72px] text-left md:text-right">
                      {sales.toLocaleString("en-IN")} sales
                    </span>
                    <Link
                      href={`/store/${storeSlug}/product/${product.productDetails.slug}`}
                      target="_blank"
                      className="ml-auto md:ml-0 p-1 hidden sm:block cursor-pointer text-gray-500 hover:text-white"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </DashboardCard>


        <DashboardCard title="Top Traffic Sources">
          {traffic.trafficSources.length === 0 ? (
            <p className="text-gray-500 p-6 text-center">No traffic data yet.</p>
          ) : (
            traffic.trafficSources.map((source) => (
              <div
                key={source.source}
                className="flex items-center justify-between py-4 border-b border-gray-700/50 last:border-b-0"
              >
                <span className="text-sm text-white capitalize">
                  {source.source.replace(".com", "")}
                </span>
                <span className="text-sm text-gray-400">
                  {source.views.toLocaleString("en-IN")} views
                </span>
              </div>
            ))
          )}
        </DashboardCard>
      </div>


      <DashboardCard title="Customer List" className="overflow-hidden">
        <div className="hidden md:grid md:grid-cols-4 md:gap-4 border-b border-gray-700 p-4 text-sm font-medium text-gray-400">
          <span>Name</span>
          <span>Email</span>
          <span className="text-right">Orders</span>
          <span className="text-right">Total Spent</span>
        </div>
        <div className="flex flex-col">
          {customers.length === 0 ? (
            <p className="text-gray-500 p-6 text-center">No customers found.</p>
          ) : (
            customers.map((customer) => (
              <div
                key={customer._id}
                className="flex flex-col gap-3 py-4 px-1 border-b border-gray-700/50 last:border-b-0 md:grid md:grid-cols-4 md:gap-4 md:items-center"
              >
                <div className="flex justify-between items-center md:block">
                  <span className="text-sm text-gray-500 md:hidden">Name:</span>
                  <span className="font-medium text-white truncate text-right md:text-left">
                    {customer.name}
                  </span>
                </div>
                <div className="flex justify-between items-center md:block">
                  <span className="text-sm text-gray-500 md:hidden">Email:</span>
                  <span className="text-sm text-gray-400 truncate text-right md:text-left">
                    {customer.email}
                  </span>
                </div>
                <div className="flex justify-between items-center md:block">
                  <span className="text-sm text-gray-500 md:hidden">Orders:</span>
                  <span className="text-sm text-gray-400 text-right md:block">
                    {customer.orderCount}
                  </span>
                </div>
                <div className="flex justify-between items-center md:block">
                  <span className="text-sm text-gray-500 md:hidden">Total Spent:</span>
                  <span className="text-sm text-white font-medium text-right md:block">
                    ₹{customer.totalSpent.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardCard>
    </div>
  );
}