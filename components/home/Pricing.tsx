"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
// import api from "@/lib/api";
import { IPlan } from "@/types/types";
import { PlanCard } from "@/components/ui/cards/home/PlanCard";
import { Loader2, AlertCircle } from "lucide-react";
import { fetchSubscription } from "@/services/subscription.service";
import { ISubscription } from "@/types/billing";

import { mockPlans } from "@/data/mock";

const fetchPublicPlans = async (): Promise<IPlan[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPlans;
};

export function PricingSection() {
  const { status } = useSession();
  const billingCycle = "monthly";

  const { data: plans, isLoading, isError } = useQuery<IPlan[]>({
    queryKey: ["publicPlans"],
    queryFn: fetchPublicPlans,
  });

  const { data: currentSubscription } = useQuery<ISubscription | null>({
    queryKey: ["mySubscription"],
    queryFn: fetchSubscription,
    enabled: status === "authenticated",
    select: (data) => {
      // Only consider active or trial subscriptions
      // Filter out pending/incomplete subscriptions
      if (!data) return null;
      if (data.status === 'active' || data.status === 'trial') {
        return data;
      }
      return null;
    },
  });

  const hasActiveSubscription = !!currentSubscription &&
    ["active", "trial"].includes(currentSubscription.status);

  const getSubscriptionStatus = (planId: string) => {
    // Only show as "current" if subscription is active or trial
    if (currentSubscription?.planId?._id === planId && hasActiveSubscription) {
      return "current";
    }
    if (hasActiveSubscription) return "blocked";
    return "eligible";
  };

  const renderPlans = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
        </div>
      );
    }

    if (isError || !plans) {
      return (
        <div className="flex flex-col items-center py-20 text-red-500">
          <AlertCircle size={32} className="mb-2" />
          <p>Failed to load plans.</p>
        </div>
      );
    }

    // --- Filter Plans for Display ---
    //  Always find the Free plan
    const freePlan = plans.find(p => p.planCode === 'free');

    //  Find the "Plus" plan matching the current cycle
    const plusPlan = plans.find(p =>
      p.planCode.includes('plus') && p.billingCycle === billingCycle
    );

    // Find the "Pro" plan matching the current cycle
    const proPlan = plans.find(p =>
      p.planCode.includes('pro') && p.billingCycle === billingCycle
    );

    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">

        {/* Card 1: Free */}
        {freePlan && (
          <PlanCard
            plan={freePlan}
            subscriptionStatus={getSubscriptionStatus(freePlan._id)}
            isTrialEligible={!hasActiveSubscription}
          />
        )}

        {/* Card 2: Plus */}
        {plusPlan && (
          <PlanCard
            plan={plusPlan}
            subscriptionStatus={getSubscriptionStatus(plusPlan._id)}
            isTrialEligible={!hasActiveSubscription}
          />
        )}

        {/* Card 3: Pro */}
        {proPlan && (
          <PlanCard
            plan={proPlan}
            subscriptionStatus={getSubscriptionStatus(proPlan._id)}
            isTrialEligible={!hasActiveSubscription}
          />
        )}

      </div>
    );
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50/50 bg-dot-pattern">
      <div className="px-6 lg:px-8 gap-5 flex flex-col">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-2xl font-bold tracking-tighter text-[#2B281F] lg:text-[2rem] sm:text-[2rem]">
            Maximize your earnings
          </h2>
          <p className="text-2xl font-bold tracking-tighter text-[#999999] lg:text-[2rem] sm:text-[2rem]">
            Lower your platform fees as you grow.
          </p>
        </div>

        {renderPlans()}
      </div>
    </section>
  );
}