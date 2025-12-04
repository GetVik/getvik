'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { fetchSubscription } from '@/services/subscription.service';
import { DashboardCard } from '@/components/ui/cards/dashboard/DashboardCard';
import { Loader2, AlertCircle, Check, CreditCard } from 'lucide-react';
import { ISubscription } from '@/types/billing';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colorClasses = 'bg-gray-600 text-gray-100';
  const text = status.charAt(0).toUpperCase() + status.slice(1);

  switch (status) {
    case 'active':
    case 'trial':
      colorClasses = 'bg-green-100 text-green-700';
      break;
    case 'cancelled':
    case 'canceled':
    case 'expired':
      colorClasses = 'bg-red-100 text-red-700';
      break;
    case 'past_due':
    case 'incomplete':
      colorClasses = 'bg-yellow-100 text-yellow-700';
      break;
  }

  return (
    <span
      className={`rounded-full px-2 py-1 w-13 text-xs font-medium ${colorClasses}`}
    >
      {text}
    </span>
  );
};

export default function SubscriptionPage() {
  const { status: authStatus } = useSession();

  const {
    data: subscription,
    isLoading,
    isError,
    error,
  } = useQuery<ISubscription | null, Error>({
    queryKey: ['mySubscription'],
    queryFn: fetchSubscription,
    enabled: authStatus === 'authenticated',
  });

  const renderContent = () => {
    if (isLoading || authStatus === 'loading') {
      return (
        <DashboardCard title="Loading...">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </DashboardCard>
      );
    }
    if (isError) {
      return (
        <DashboardCard title="Error">
          <div className="flex flex-col items-center justify-center h-64 text-red-400">
            <AlertCircle className="h-10 w-10 mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Subscription</h3>
            <p className="text-sm">{error.message}</p>
          </div>
        </DashboardCard>
      );
    }
    if (!subscription) {
      return (
        <DashboardCard title="Subscription Status">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <CreditCard className="h-10 w-10 text-gray-500 mb-2" />
            <h3 className="text-lg font-semibold text-white">
              No Active Subscription
            </h3>
            <p className="text-gray-400 mb-4">
              You are currently on the Free plan.
            </p>
            <Link
              href="/#pricing"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-gray-200"
            >
              View Plans
            </Link>
          </div>
        </DashboardCard>
      );
    }

    const { planId, status, endDate, trialEndDate } = subscription;
    const isTrial = status === 'trial';

    return (
      <DashboardCard title="Current Plan">
        <div className="py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-white">{planId.name}</h2>
              <p className="text-gray-400 text-sm pb-3">
                {isTrial
                  ? `Trial ends on ${formatDate(trialEndDate!)}`
                  : `Renews on ${formatDate(endDate)}`}
              </p>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-white mb-3">Plan Features</h4>
            <ul className="space-y-2">
              {(planId.features || []).map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-3">
                  <Check size={16} className="shrink-0 text-[#643446]" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <Link
              href="/dashboard/billing?tab=manage"
              className="text-sm text-[#643446] hover:text-pink-400"
            >
              Manage Subscription or Change Plan &rarr;
            </Link>
          </div>
        </div>
      </DashboardCard>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl px-2 font-light text-white">Subscription</h1>
      {renderContent()}
    </div>
  );
}