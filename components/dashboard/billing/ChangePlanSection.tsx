"use client";

import React, { useMemo, useState } from "react";
import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import { Loader2, CheckCircle2, Zap, Lock, Check, Settings } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IPlan } from "@/types/types";
import { ISubscription } from "@/types/billing";
import { CreateSubscriptionResponse } from "@/types/subscription.interface";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { PhoneRequiredModal } from "@/components/modals/PhoneRequiredModal";
import { fetchUserProfile } from "@/services/settings.service";

interface ChangePlanSectionProps {
  plans: IPlan[] | undefined;
  subscription: ISubscription | null | undefined;
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
  isLoadingPlans: boolean;
  checkoutMutation: UseMutationResult<
    CreateSubscriptionResponse,
    unknown,
    string
  >;
}

interface MappedPlan extends IPlan {
  features: string[];
  description?: string;
}

const mapPlan = (plan: IPlan): MappedPlan => ({
  ...(plan as MappedPlan),
  features: (plan.features || []) as string[],
  description: plan.description,
});

export function ChangePlanSection({
  plans,
  subscription,
  billingCycle,
  setBillingCycle,
  isLoadingPlans,
  checkoutMutation,
}: ChangePlanSectionProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  // 1. Filter and Sort Plans
  const displayPlans: MappedPlan[] = useMemo(() => {
    if (!plans) return [];
    return plans
      .filter((p) => {
        // Show Free, Beta, or plans matching the selected cycle
        if (p.planCode === "free" || p.planCode === "beta") return true;
        return p.billingCycle === billingCycle;
      })
      .sort((a, b) => (a.price || 0) - (b.price || 0))
      .map(mapPlan);
  }, [plans, billingCycle]);

  // 2. Determine User's Subscription Status
  const isCurrentPlan = (planId: string): boolean =>
    subscription?.planId?._id === planId;

  const hasActiveSubscription =
    subscription?.status === "active" || subscription?.status === "trial";

  const handleCheckout = async (planId: string) => {
    if (!session?.user?.phone) {
      try {
        const userProfile = await fetchUserProfile();
        if (userProfile.user?.phone) {
          await update({
            ...session,
            user: {
              ...session?.user,
              phone: userProfile.user.phone,
            },
          });
          checkoutMutation.mutate(planId);
        } else {
          setPendingPlanId(planId);
          setShowPhoneModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        setPendingPlanId(planId);
        setShowPhoneModal(true);
      }
      return;
    }
    checkoutMutation.mutate(planId);
  };

  const handlePhoneAdded = async () => {
    setShowPhoneModal(false);
    if (pendingPlanId) {
      await handleCheckout(pendingPlanId);
      setPendingPlanId(null);
    }
  };

  return (
    <DashboardCard title="Change Plan">
      <div className="flex flex-col gap-6 py-2 px-1 sm:py-3 sm:px-4">
        {/* Billing Cycle Toggle */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-300">Billing cycle</p>
            <p className="text-xs text-gray-500">
              Switch between monthly and yearly pricing. Changes apply on your
              next billing date.
            </p>
          </div>
          <div className="flex justify-start sm:justify-end">
            <div className="inline-flex rounded-lg bg-[#1a1a1a] border border-gray-800 p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 text-xs sm:text-sm font-medium rounded-full transition-all ${billingCycle === "monthly"
                  ? "bg-gray-200 text-black shadow-sm"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 text-xs sm:text-sm font-medium rounded-full transition-all flex items-center gap-2 ${billingCycle === "yearly"
                  ? "bg-gray-200 text-black shadow-sm"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                Yearly

              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoadingPlans
            ? [...Array(4)].map((_, i: number) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-lg bg-[#262626] border border-gray-800"
              />
            ))
            : displayPlans.map((plan) => {
              const current = isCurrentPlan(plan._id);
              const isPlus = plan.planCode.includes("plus");
              const isPro = plan.planCode.includes("pro");
              const isYearly = plan.billingCycle === "yearly";

              // Logic 2: Determine Pricing Display (Trial vs Normal)
              const hasTrialOffer = (plan.trialDays || 0) > 0;
              const isTrialEligible = !hasActiveSubscription; // User can take trial if no active sub
              const showTrialPrice = hasTrialOffer && isTrialEligible && !current;

              const displayPrice = showTrialPrice ? 0 : plan.price;
              const originalPrice = plan.price;
              const isFree = plan.price === 0;

              // --- Button State Logic ---
              let buttonText = "Change to this plan";
              let isDisabled = false;
              let ButtonIcon = null;
              let buttonClasses = "bg-white text-black hover:bg-gray-200";
              let isTextOnly = false; // Flag to render as text instead of button

              if (plan.isDisabled) {
                // Priority 1: Plan is disabled in DB
                buttonText = "Unavailable";
                isDisabled = true;
                ButtonIcon = Lock;
                buttonClasses = "text-gray-500 cursor-not-allowed";
              } else if (isFree) {
                // Priority 2: Free Plan - Always show as "Default Plan" text
                buttonText = "Default Plan";
                isDisabled = true;
                buttonClasses = "bg-gray-800 text-gray-400 cursor-default border border-gray-700";
                isTextOnly = true; // Render as text, not clickable button
              } else if (current) {
                // Priority 3: Current Plan
                buttonText = "Current Plan";
                isDisabled = true;
                buttonClasses = "cursor-default  border border-green-500/20";
                ButtonIcon = CheckCircle2;
              } else if (hasActiveSubscription && !isFree) {
                // Priority 4: Has another active paid/trial subscription
                // Backend prevents creating new sub if active exists.
                buttonText = "Manage Subscription";
                isDisabled = false;
                ButtonIcon = Settings;
                buttonClasses = "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
              } else if (showTrialPrice) {
                // Priority 5: Trial Offer
                buttonText = `Start ${plan.trialDays}-Day Free Trial`;
                ButtonIcon = Zap;
                buttonClasses = "bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg";
              }

              // --- Styling ---
              // Dark mode "Ring" equivalent is border color
              const cardClasses = current
                ? "border-none bg-[#262626] shadow-sm"
                : isPlus
                  ? "border-[#643446] border-2 bg-[#262626] shadow-lg scale-[1.01] z-10" // Highlighted Plus
                  : isPro
                    ? "border-none bg-[#262626]"
                    : "border-gray-800 bg-[#262626] opacity-90";

              return (
                <div
                  key={plan._id}
                  className={`flex flex-col rounded-3xl border p-4 sm:p-5 transition-all relative ${cardClasses}`}
                >
                  {/* Badge for High Tier (Plus + Yearly) */}
                  {isPlus && isYearly && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#643446] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md whitespace-nowrap z-20">
                      Best Value
                    </div>
                  )}

                  {/* Badge for Trial (Free in Beta) */}
                  {!isPlus && showTrialPrice && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-0.5 text-[10px] font-bold text-black shadow-md whitespace-nowrap z-20">
                      Free in Beta
                    </div>
                  )}

                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-white">
                        {plan.name}
                      </h3>
                      {plan.planCode === "free" && (
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">
                          Starter
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {current && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-300">
                          <CheckCircle2 size={12} />
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 flex items-baseline gap-1 min-h-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={displayPrice}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-baseline gap-1"
                      >
                        {/* Strikethrough Price for Trial */}
                        {showTrialPrice && (
                          <span className="text-sm text-gray-500 line-through decoration-gray-500/50 mr-1">
                            ₹{originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}

                        <span className="text-2xl font-bold text-white">
                          {displayPrice === 0
                            ? "Free"
                            : `₹${displayPrice.toLocaleString("en-IN")}`}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-xs text-gray-500">
                            /{billingCycle === "yearly" ? "yr" : "mo"}
                          </span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <p className="mt-2 text-xs text-gray-400 line-clamp-2 min-h-8">
                    {plan.description ||
                      "All the essentials for selling digital products."}
                  </p>

                  <ul className="mb-6 mt-4 flex-1 space-y-2.5">
                    {plan.features.map((feature: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-gray-300"
                      >
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0 text-[#643446]" // Keeping the brand color for checkmarks
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button or Text */}
                  {isTextOnly ? (
                    <div className={`w-full rounded-lg py-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 ${buttonClasses}`}>
                      {buttonText}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (buttonText === "Manage Subscription") {
                          router.push("/dashboard/billing?tab=manage");
                        } else {
                          handleCheckout(plan._id);
                        }
                      }}
                      disabled={isDisabled || checkoutMutation.isPending}
                      className={`w-full rounded-lg py-2 text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 ${buttonClasses}`}
                    >
                      {checkoutMutation.isPending && !isDisabled && !current ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          {ButtonIcon && <ButtonIcon size={14} />}
                          {buttonText}
                        </>
                      )}
                    </button>
                  )}

                  <p className="mt-2 text-[10px] text-gray-500 text-right">
                    Billed in INR. Taxes may apply.
                  </p>
                </div>
              );
            })}
        </div>
        {showPhoneModal && (
          <PhoneRequiredModal onPhoneAdded={handlePhoneAdded} />
        )}
      </div>
    </DashboardCard>
  );
}