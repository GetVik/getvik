"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Zap,
  Receipt,
  ChevronDown,
  Settings,
} from "lucide-react";

export type BillingTab = "overview" | "plans" | "invoices" | "billing" | "manage";

interface BillingNavProps {
  activeTab: BillingTab;
  onChange: (tab: BillingTab) => void;
}

const TABS: { id: BillingTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "plans", label: "Plans", icon: Zap },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "manage", label: "Manage Subscription", icon: Settings },
  // { id: "billing", label: "Billing Details", icon: CreditCard },
];

export function BillingNav({ activeTab, onChange }: BillingNavProps) {
  // Find current active label/icon for the mobile state
  const activeItem = TABS.find((t) => t.id === activeTab);

  return (
    <div className="w-full border-b border-gray-800 backdrop-blur-sm sticky top-0 z-20 pt-2">

      {/* --- MOBILE VIEW: Professional Dropdown --- */}
      <div className="md:hidden px-4 pb-3">
        <label className="sr-only" htmlFor="billing-tabs">Select a tab</label>
        <div className="relative group">
          {/* Custom Icon for the selected state */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {activeItem && <activeItem.icon size={16} className="text-gray-400 group-focus-within:text-white transition-colors" />}
          </div>

          <select
            id="billing-tabs"
            value={activeTab}
            onChange={(e) => onChange(e.target.value as BillingTab)}
            className="w-full appearance-none rounded-lg border border-gray-800 bg-[#1a1a1a] py-2.5 pl-10 pr-10 text-sm font-medium text-gray-200 shadow-sm transition-all focus:border-gray-600 focus:bg-[#262626] focus:text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
          >
            {TABS.map((tab) => (
              <option key={tab.id} value={tab.id} className="bg-[#1a1a1a] text-gray-300">
                {tab.label}
              </option>
            ))}
          </select>

          {/* Custom Chevron */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 group-focus-within:text-white transition-colors">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW: Animated Tabs --- */}
      <div className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar pb-0 px-1 md:gap-6">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 outline-none select-none whitespace-nowrap ${isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {/* Background Hover/Active Animation */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 rounded-t-lg bg-[#262626]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Bottom Border Highlight */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-border"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}

              {/* Content (Relative to sit on top of motion div) */}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={16} className={isActive ? "text-white" : "text-gray-500"} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}