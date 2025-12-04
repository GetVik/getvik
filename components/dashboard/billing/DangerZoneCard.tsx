"use client";

import React from "react";
import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import { ShieldAlert, Loader2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { ISubscription } from "@/types/billing";

interface Props {
  subscription: ISubscription | null | undefined;
  cancelConfirm: boolean;
  setCancelConfirm: (val: boolean) => void;
  cancelMutation: UseMutationResult<void, unknown, void>;
}

export function DangerZoneCard({
  subscription,
  cancelConfirm,
  setCancelConfirm,
  cancelMutation,
}: Props) {
  const [confirmText, setConfirmText] = React.useState("");

  if (!subscription || subscription.planId.price <= 0) {
    return (
      <DashboardCard title="Manage Subscription">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="p-3 rounded-full bg-[#262626] mb-4">
            <ShieldAlert className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            No Active Subscription
          </h3>
          <p className="text-sm text-gray-400 max-w-xs">
            You are currently on the Free plan. There is nothing to cancel.
          </p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Danger Zone" className="border border-red-900/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <ShieldAlert className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-white">Cancel Subscription</h4>
            <p className="text-xs text-gray-400 mt-1">
              Your plan will remain active until the end of the billing cycle. You won&apos;t be
              charged again.
            </p>
          </div>
        </div>

        {!cancelConfirm ? (
          <button
            onClick={() => setCancelConfirm(true)}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
          >
            Cancel Subscription
          </button>
        ) : (
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <p className="text-sm text-gray-400">
              Type <span className="font-bold text-white">CONFIRM</span> to cancel.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                placeholder="CONFIRM"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full sm:w-auto rounded-lg border border-gray-700 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  setCancelConfirm(false);
                  setConfirmText("");
                }}
                className="rounded-lg bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600 whitespace-nowrap"
              >
                Keep Plan
              </button>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending || confirmText !== 'CONFIRM'}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {cancelMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Confirm Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
