'use client';

import React from 'react';
import Link from 'next/link';
import { X, Sparkles, CheckCircle2, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal = ({ isOpen, onClose }: UpgradeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#1C1C1C] border border-gray-800 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header with Gradient */}
        <div className="bg-linear-to-b from-purple-900/20 to-transparent p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 ring-1 ring-purple-500/50">
            <Sparkles size={32} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Unlock AI Superpowers</h2>
          <p className="mt-2 text-sm text-gray-400">
            You&apos;ve reached the limit of your current plan. Upgrade to <b>Pro</b> to automate your workflow.
          </p>
        </div>

        {/* Features List */}
        <div className="px-8 pb-8">
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">AI Product Auto-fill</p>
                <p className="text-xs text-gray-500">Generate descriptions & SEO tags instantly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Advanced Sales Insights</p>
                <p className="text-xs text-gray-500">Get weekly AI summaries of your revenue.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">0% Platform Fees</p>
                <p className="text-xs text-gray-500">Keep more of what you earn.</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href="/dashboard/settings/billing" // Update this to your actual billing route
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-semibold text-black hover:bg-gray-200 transition-all"
          >
            <Zap size={16} className="fill-black group-hover:scale-110 transition-transform" />
            Upgrade Plan
          </Link>
          
          <button 
            onClick={onClose}
            className="mt-4 w-full text-xs text-gray-500 hover:text-gray-300"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};