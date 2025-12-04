'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Lock, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { IPlan } from '@/types/types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { createSubscription, switchSubscription } from '@/services/subscription.service';
import { isPaidSubscriptionResponse } from '@/types/subscription.interface';

import { PhoneRequiredModal } from '@/components/modals/PhoneRequiredModal';
import { fetchUserProfile } from '@/services/settings.service';
import CountUp from 'react-countup';


interface PlanCardProps {
  plan: IPlan;
  subscriptionStatus: "current" | "blocked" | "eligible";
  isTrialEligible: boolean;
}

export function PlanCard({ plan, subscriptionStatus, isTrialEligible }: PlanCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Identify plan type and benefits
  const isFree = plan.price === 0;
  const isPro = plan.planCode.includes('pro'); // Best value
  const isPlus = plan.planCode.includes('plus');

  // Extract fee percentage from name or description if possible, otherwise hardcode based on known types

  // Default fee percentage or from plan details if available
  const feePercentage = 5;

  const hasTrialOffer = (plan.trialDays || 0) > 0;
  const showTrialPrice = hasTrialOffer && isTrialEligible;

  const displayPrice = showTrialPrice ? 0 : plan.price;
  const originalPrice = plan.price;


  const handleCheckout = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    // Check if user has phone in backend
    try {
      const userProfile = await fetchUserProfile();
      if (!userProfile.user?.phone) {
        setShowPhoneModal(true);
        return;
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      setShowPhoneModal(true);
      return;
    }

    try {
      setIsLoading(true);

      let response;
      if (subscriptionStatus === 'blocked') {
        // If blocked (meaning they have another active plan), we switch
        response = await switchSubscription(plan._id);
      } else {
        // Otherwise create new
        response = await createSubscription(plan._id);
      }

      // Check if it's a paid subscription requiring payment
      if (isPaidSubscriptionResponse(response)) {

        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Payment successful!");
        router.push('/dashboard/billing');
      } else {
        // Free or Trial plan - Instant activation
        toast.success(
          response.status === 'trial'
            ? `${plan.trialDays}-day trial started successfully!`
            : "Plan activated successfully!"
        );
        router.push('/dashboard/billing');
      }
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const message =
        (error &&
          typeof error === 'object' &&
          'response' in error &&
          (error as { response?: { data?: { message?: string } } }).response?.data?.message) ||
        "Failed to start checkout";

      // Show the error message from backend (handles trial cancellation case)
      toast.error(typeof message === "string" ? message : "Failed to start checkout", {
        duration: 5000, // Show for 5 seconds for important messages
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAdded = async () => {
    setShowPhoneModal(false);
    await handleCheckout();
  };


  const getButtonConfig = () => {
    // For Free plan: Always show "Default Plan" text, never a button
    if (isFree) {
      return {
        text: "Default",
        disabled: true,
        classes: "bg-gray-100 text-gray-600 cursor-default font-medium border border-gray-200",
        icon: null,
        isTextOnly: true, // Flag to render as text instead of button
      };
    }

    if (plan.isDisabled) {
      return {
        text: "Unavailable",
        disabled: true,
        classes: "bg-gray-100 text-gray-400 cursor-not-allowed",
        icon: <Lock size={14} />,
        isTextOnly: false,
      };
    }

    if (subscriptionStatus === "current") {
      return {
        text: "Active Plan",
        disabled: true,
        classes: "bg-gray-100 text-gray-600 cursor-default font-medium border border-gray-200",
        // icon: <Check size={16} />,
        isTextOnly: false,
      };
    }

    if (subscriptionStatus === "blocked") {
      return {
        text: `Switch to ${feePercentage}% Fee`,
        disabled: false,
        onClick: () => router.push("/dashboard/billing"), // Or handleCheckout if we want direct switch
        classes: "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400",
        icon: null,
        isTextOnly: false,
      };
    }

    if (showTrialPrice) {
      return {
        text: `Start ${plan.trialDays}-Day Free Trial`,
        disabled: false,
        onClick: handleCheckout,
        classes: "bg-black text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        icon: <Zap size={14} className="fill-current" />,
        isTextOnly: false,
      };
    }

    return {
      text: isPro ? "Unlock Lowest Fee" : "Reduce Platform Fee",
      disabled: false,
      onClick: handleCheckout,
      classes: isPlus
        ? "bg-[#643446] text-white shadow-xl hover:bg-[#7a4157] hover:scale-[1.02] active:scale-[0.98]"
        : "bg-black text-white shadow-lg hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98]",
      icon: <ArrowRight size={16} />,
      isTextOnly: false,
    };
  };

  const btn = getButtonConfig();

  // Card Styles
  const containerClasses = isPlus
    ? "ring-1 ring-[#643446] shadow-2xl scale-[1.02] z-10 bg-white " // Highlighted style (Pro)
    : "ring-1 ring-gray-200 shadow-lg hover:shadow-xl bg-white hover:bg-gray-50/50"; // Standard style

  return (
    <div className={`relative flex flex-col h-full rounded-3xl p-6 sm:p-8 transition-all duration-300 ${containerClasses}`}>

      {/* Badge for Best Value (Pro) */}
      {/* Badge for Best Value (Pro) */}
      {isPlus && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#643446] to-[#8a4b63] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg ring-4 ring-white">
          <Sparkles className="w-3 h-3 fill-current animate-pulse" />
          Best Value
        </div>
      )}

      {/* Header: Fee Percentage (The Benefit) */}
      <div className="mb-4 text-center sm:text-left">
        <div className="flex items-baseline justify-center sm:justify-start gap-1">
          <h3 className="text-4xl font-black tracking-tighter text-gray-900">
            <CountUp end={feePercentage} decimals={feePercentage % 1 !== 0 ? 1 : 0} duration={2} suffix="%" />
          </h3>
          <span className="text-lg font-semibold text-gray-500">
            platform fee
          </span>
        </div>
        <p className="mt-3 text-sm font-medium text-gray-500 min-h-[40px] leading-relaxed">
          {plan.description}
        </p>
      </div>

      <div className="my-6 h-px w-full bg-gray-100" />

      {/* Pricing Section */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Subscription Cost
        </div>
        <div className="flex items-baseline gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayPrice}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline"
            >
              {/* Original Price (Trial) */}
              {showTrialPrice && (
                <span className="mr-2 text-lg font-medium text-gray-400 line-through decoration-gray-400/50">
                  ₹{originalPrice}
                </span>
              )}

              {/* Main Price */}
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                {displayPrice === 0 ? "Free" : `₹${displayPrice}`}
              </span>

              {/* Cycle */}
              {plan.price > 0 && (
                <span className="ml-1 text-sm font-medium text-gray-500">
                  /{plan.billingCycle === "yearly" ? "year" : "mo"}
                </span>
              )}
              {plan.price === 0 && (
                <span className="ml-1 text-sm font-medium text-gray-500">
                  forever
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPro ? 'bg-[#643446]/10 text-[#643446]' : 'bg-gray-100 text-gray-600'}`}>
              <Check className="h-3 w-3" />
            </div>
            <span className="text-sm text-gray-600 leading-tight">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <div className="mt-auto pt-6">
        {btn.isTextOnly ? (
          <div className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold ${btn.classes}`}>
            {btn.text}
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={btn.onClick}
            disabled={btn.disabled || isLoading}
            className={`relative overflow-hidden flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all duration-200 disabled:opacity-70 shadow-lg hover:shadow-xl ${btn.classes}`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span className="relative z-10 flex items-center gap-2">
                  {btn.text}
                  {btn.icon}
                </span>
                {/* Shine effect */}
                {!btn.disabled && (
                  <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                )}
              </>
            )}
          </motion.button>
        )}
      </div>

      {showPhoneModal && (
        <PhoneRequiredModal onPhoneAdded={handlePhoneAdded} />
      )}

    </div>
  );
}