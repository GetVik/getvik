"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/home/Navbar";
import { Footer } from "@/components/layout/home/Footer";
import { IPlan } from "@/types/types";
import { PlanCard } from "@/components/ui/cards/home/PlanCard";
import { fetchSubscription } from "@/services/subscription.service";
import { ISubscription } from "@/types/billing";
import { Loader2, AlertCircle, Check } from "lucide-react";

import { mockPlans } from "@/data/mock";

const fetchPublicPlans = async (): Promise<IPlan[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPlans;
};

export default function PricingPage() {
    const { status } = useSession();
    const billingCycle = "monthly";

    const {
        data: plans,
        isLoading,
        isError,
    } = useQuery<IPlan[]>({
        queryKey: ["publicPlans"],
        queryFn: fetchPublicPlans,
    });

    const { data: currentSubscription } = useQuery<ISubscription | null>({
        queryKey: ["mySubscription"],
        queryFn: fetchSubscription,
        enabled: status === "authenticated",
        select: (data) => {
            if (!data) return null;
            if (data.status === "active" || data.status === "trial") return data;
            return null;
        },
    });

    const hasActiveSubscription =
        !!currentSubscription &&
        ["active", "trial"].includes(currentSubscription.status);

    const getSubscriptionStatus = (planId: string) => {
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
                    <p>Failed to load pricing. Please try again.</p>
                </div>
            );
        }

        const freePlan = plans.find((p) => p.planCode === "free");
        const starterPlan = plans.find(
            (p) => p.planCode.includes("plus") && p.billingCycle === billingCycle
        );
        const proPlan = plans.find(
            (p) => p.planCode.includes("pro") && p.billingCycle === billingCycle
        );

        return (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-7xl mx-auto items-stretch">
                {freePlan && (
                    <PlanCard
                        plan={freePlan}
                        subscriptionStatus={getSubscriptionStatus(freePlan._id)}
                        isTrialEligible={!hasActiveSubscription}
                    />
                )}

                {starterPlan && (
                    <PlanCard
                        plan={starterPlan}
                        subscriptionStatus={getSubscriptionStatus(starterPlan._id)}
                        isTrialEligible={!hasActiveSubscription}
                    />
                )}

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
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-24 bg-gray-50/50 bg-dot-pattern">
                {/* Hero / Intro */}
                <section className="px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h1 className="text-4xl font-bold tracking-tighter text-[#2B281F] sm:text-5xl mb-6">
                            Simple, transparent pricing.
                        </h1>
                        <p className="text-xl text-[#999999] tracking-tight max-w-2xl mx-auto">
                            Start free with a 10% platform fee. As you grow, upgrade to reduce
                            your fee and keep more from every sale.
                        </p>
                    </div>

                    {/* “How it works” strip */}
                    <div className="max-w-5xl mx-auto mb-20 grid gap-8 md:grid-cols-3">
                        <div className="relative p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl font-bold text-gray-100 absolute top-4 right-6 select-none">
                                01
                            </div>
                            <h3 className="text-lg font-bold text-[#2B281F] mb-2 relative z-10">
                                Start free
                            </h3>
                            <p className="text-gray-500 relative z-10">
                                Create your store, upload products, connect UPI. Default fee is{" "}
                                <span className="font-semibold text-gray-900">10% per sale</span>.
                            </p>
                        </div>
                        <div className="relative p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl font-bold text-gray-100 absolute top-4 right-6 select-none">
                                02
                            </div>
                            <h3 className="text-lg font-bold text-[#2B281F] mb-2 relative z-10">
                                Sell and earn
                            </h3>
                            <p className="text-gray-500 relative z-10">
                                We handle payments, file delivery, receipts, and payouts so you
                                can focus on shipping.
                            </p>
                        </div>
                        <div className="relative p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl font-bold text-gray-100 absolute top-4 right-6 select-none">
                                03
                            </div>
                            <h3 className="text-lg font-bold text-[#2B281F] mb-2 relative z-10">
                                Reduce your fee
                            </h3>
                            <p className="text-gray-500 relative z-10">
                                When you&apos;re ready, upgrade to lower platform fees like{" "}
                                <span className="font-semibold text-gray-900">7%</span> or{" "}
                                <span className="font-semibold text-gray-900">2.5%</span>.
                            </p>
                        </div>
                    </div>

                    {/* Plan cards from API */}
                    {renderPlans()}

                    {/* What’s included */}
                    <div className="max-w-4xl mx-auto mt-24">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold tracking-tighter text-[#2B281F]">
                                Everything you need to sell
                            </h2>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 md:p-10">
                            <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                                <ul className="space-y-4 text-sm text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>Unlimited products and sales</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>Instant file delivery after payment</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>UPI & card payments via Indian gateways</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>Creator dashboard with basic analytics</span>
                                    </li>
                                </ul>
                                <ul className="space-y-4 text-sm text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>Hosted checkout and receipts</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>Buyer email collection and exports</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>Fraud checks & basic dispute handling</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span>No setup fees, no lock-in, cancel anytime</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Philosophy / Motive */}
                    <div className="max-w-3xl mx-auto mt-24 text-center">
                        <h2 className="text-2xl font-bold tracking-tighter text-[#2B281F] mb-6">
                            Why this pricing model?
                        </h2>
                        <div className="space-y-6 text-gray-600 leading-relaxed">
                            <p>
                                Most tools either charge a heavy subscription even when you&apos;re
                                not selling, or hide fees behind complex terms. GetVik is built
                                for Indian creators who want something simple:{" "}
                                <span className="font-semibold text-gray-900">
                                    pay only when money actually hits your account.
                                </span>
                            </p>
                            <p>
                                The 10% default fee lets you start with zero risk. As your sales
                                grow, the Starter and Pro plans reduce your platform fees so you
                                keep more of every payout. It&apos;s the same product, same
                                features – just a lower fee as you scale.
                            </p>
                            <p>
                                This model keeps the platform sustainable (servers, storage,
                                payment infra, support) without punishing small creators or
                                forcing you into subscriptions you don&apos;t need.
                            </p>
                        </div>
                    </div>

                    {/* FAQ-ish strip */}
                    <div className="max-w-3xl mx-auto mt-16 pt-10 border-t border-gray-200">
                        <div className="grid gap-8 md:grid-cols-2 text-sm">
                            <div>
                                <h4 className="font-bold text-[#2B281F] mb-2">Do I pay if I make no sales?</h4>
                                <p className="text-gray-500">
                                    No. If you don&apos;t sell, we don&apos;t earn. There are no setup fees.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#2B281F] mb-2">Are there any hidden charges?</h4>
                                <p className="text-gray-500">
                                    Our fee is applied on top of the base payment gateway charges
                                    charged by banks/payment processors. We don&apos;t add extra
                                    surprise platform charges beyond the fee you see here.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
