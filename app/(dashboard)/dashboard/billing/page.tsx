"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { IPlan } from "@/types/types";
import { ISubscription, IInvoice, ICreatorSettings } from "@/types/billing";
import { CreateSubscriptionResponse, isPaidSubscriptionResponse } from "@/types/subscription.interface";

import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import {
  BillingNav,
  BillingTab,
} from "@/components/dashboard/billing/BillingNav";
import { CurrentSubscriptionCard } from "@/components/dashboard/billing/CurrentSubscriptionCard";
import { ChangePlanSection } from "@/components/dashboard/billing/ChangePlanSection";
import { InvoiceHistoryCard } from "@/components/dashboard/billing/InvoiceHistoryCard";
import { DangerZoneCard } from "@/components/dashboard/billing/DangerZoneCard";

import {
  fetchPlans,
  fetchCreatorSettings,
  fetchInvoices,
  fetchSubscription,
  createSubscription,
  switchSubscription,
  cancelSubscription,
} from "@/services/subscription.service";


export default function BillingPage() {
  const queryClient = useQueryClient();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialTab = (searchParams.get("tab") as BillingTab) || "overview";
  const [activeTab, setActiveTab] = useState<BillingTab>(initialTab);

  // Sync tab with URL
  const handleTabChange = (tab: BillingTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const tab = searchParams.get("tab") as BillingTab;
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const { data: plans, isLoading: loadingPlans } = useQuery<IPlan[]>({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const { data: subscription, isLoading: loadingSub } =
    useQuery<ISubscription | null>({
      queryKey: ["subscription"],
      queryFn: fetchSubscription,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 20,
      refetchOnWindowFocus: false,
      retry: false, // Do not retry on 404
      select: (data) => {
        // Only show active or trial subscriptions
        // Filter out incomplete/pending subscriptions
        if (!data) return null;
        if (data.status === 'active' || data.status === 'trial') {
          return data;
        }
        return null;
      },
    });

  const { data: invoices, isLoading: loadingInvoices } = useQuery<IInvoice[]>({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  useQuery<ICreatorSettings>({
    queryKey: ["creatorSettings"],
    queryFn: fetchCreatorSettings,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const checkoutMutation = useMutation<
    CreateSubscriptionResponse,
    unknown,
    string
  >({
    mutationFn: async (planId: string) => {
      // Check if we are switching or creating
      const hasActiveSub =
        subscription?.status === "active" || subscription?.status === "trial";

      if (hasActiveSub) {
        return switchSubscription(planId);
      } else {
        return createSubscription(planId);
      }
    },
    onSuccess: async (data) => {
      if (isPaidSubscriptionResponse(data)) {

        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          toast.success("Payment successful!");
        } catch (error) {
          console.error('Payment initialization error:', error);
          toast.error('Failed to initialize payment. Please try again.');
        }
      } else {
        // Free or Trial plan - Instant activation
        toast.success(
          data.status === 'trial'
            ? "Trial started successfully!"
            : "Plan updated successfully."
        );
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
      }
    },
    onError: (error: unknown) => {
      const maybeErr = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage = maybeErr.response?.data?.message ?? "Failed to update plan";

      // Show error with longer duration for important messages (like trial cancellation)
      toast.error(errorMessage, {
        duration: 5000,
      });
    },
  });

  const cancelMutation = useMutation<void>({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast.success("Subscription canceled.");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      setCancelConfirm(false);
    },
    onError: (error: unknown) => {
      const maybeErr = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        maybeErr.response?.data?.message ?? "Failed to cancel subscription"
      );
    },
  });

  // const billingDetailsMutation = useMutation<
  //   ICreatorSettings,
  //   unknown,
  //   ICreatorSettings
  // >({
  //   mutationFn: updateCreatorSettings,
  //   onSuccess: (data) => {
  //     toast.success("Billing details updated.");
  //     queryClient.setQueryData(["creatorSettings"], data);
  //   },
  //   onError: () => {
  //     toast.error("Failed to update billing details");
  //   },
  // });
  const isGlobalLoading = loadingSub && loadingPlans;

  if (isGlobalLoading) {
    return (
      <DashboardCard title="Loading Billing...">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-1">
        <div className="flex flex-row  items-center gap-3">
          <CreditCard className="h-6 w-6 text-gray-400" />
          <div>
            <h1 className="text-2xl font-light text-white">Billing</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage your subscription, invoices, billing and payout details.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <BillingNav activeTab={activeTab} onChange={handleTabChange} />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <>
          <CurrentSubscriptionCard
            subscription={subscription}
            isLoading={loadingSub}
            onSwitchToPlans={() => handleTabChange("plans")}
          />
        </>
      )}

      {activeTab === "plans" && (
        <>
          <ChangePlanSection
            plans={plans}
            subscription={subscription}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            isLoadingPlans={loadingPlans}
            checkoutMutation={checkoutMutation}
          />
        </>
      )}

      {activeTab === "invoices" && (
        <InvoiceHistoryCard invoices={invoices} isLoading={loadingInvoices} />
      )}

      {activeTab === "manage" && (
        <DangerZoneCard
          subscription={subscription}
          cancelConfirm={cancelConfirm}
          setCancelConfirm={setCancelConfirm}
          cancelMutation={cancelMutation}
        />
      )}
    </div>
  );
}
