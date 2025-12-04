"use client";

import React from "react";
import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import {
  Loader2,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  Zap,
  CreditCard,
  Check,
} from "lucide-react";
import { ISubscription } from "@/types/billing";

interface Props {
  subscription: ISubscription | null | undefined;
  isLoading: boolean;
  onSwitchToPlans?: () => void;
}

const formatDate = (iso: string | undefined): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function CurrentSubscriptionCard({
  subscription,
  isLoading,
  onSwitchToPlans,
}: Props) {
  if (isLoading) {
    return (
      <DashboardCard title="Current Subscription">
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardCard>
    );
  }

  // Only show subscription if it's active or trial
  // Don't show incomplete/pending subscriptions as "current"
  if (!subscription || (subscription.status !== 'active' && subscription.status !== 'trial')) {
    return (
      <DashboardCard title="Current Subscription">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="p-3 rounded-full bg-[#262626] mb-4">
            <CreditCard className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            No Active Subscription
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            You are currently on the Free plan. Upgrade to unlock more features.
          </p>
          <button
            onClick={onSwitchToPlans}
            className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-black transition-all hover:bg-gray-200"
          >
            View Plans
          </button>
        </div>
      </DashboardCard>
    );
  }

  const planDetails = subscription.planId;
  const planName = planDetails?.name || "Unknown Plan";
  const price = planDetails?.price || 0;
  const features = planDetails?.features || [];
  const status = subscription.status;

  const isTrial = status === "trial";
  const isPaid = price > 0;

  const displayDate = isTrial ? subscription.trialEndDate : subscription.endDate;
  const dateLabel = isTrial ? "Trial Ends On" : "Renews On";

  // Since we only show active or trial subscriptions, we only need these two cases
  const statusConfig = isTrial
    ? {
      text: "Free in Beta",
      classes: "text-green-400 border-green-500/20",
      icon: <Zap size={12} className="mr-1" />,
    }
    : {
      text: "Active",
      classes: "bg-green-500/10 text-green-400 border-green-500/20",
      icon: <CheckCircle2 size={12} className="mr-1" />,
    };

  return (
    <DashboardCard title="Current Subscription">
      <div className="py-3 sm:py-2 sm:px-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-xl font-light text-white">
                {planName}
              </h3>

              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.classes}`}
              >
                {statusConfig.icon}
                {statusConfig.text}
              </span>
            </div>
          </div>

          {displayDate && (
            <div className="flex items-center gap-3 rounded-lg bg-[#1a1a1a] border border-gray-800 px-4 py-3">
              <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">{dateLabel}</span>
                <span className="text-sm font-medium text-white">
                  {formatDate(displayDate)}
                </span>
              </div>
            </div>
          )}
        </div>

        {features.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Plan Features</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#643446]">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(isPaid || isTrial) && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-[#262626] border border-gray-800 px-4 py-3">
            <ShieldAlert className="h-4 w-4 text-gray-400 shrink-0" />
            <p className="text-xs sm:text-sm text-gray-400">
              {isTrial
                ? `You will not be charged, your trial will end on ${formatDate(displayDate)}. You can cancel anytime.`
                : "You can cancel anytime."
              }
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}