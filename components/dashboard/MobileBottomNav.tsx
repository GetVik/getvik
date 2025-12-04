"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  IndianRupee,
  Settings,
  ChartColumnBig,
  MoreHorizontal,
  CreditCard,
} from "lucide-react";

const navItems = [
  { icon: LayoutGrid, href: "/dashboard", label: "Home" },
  { icon: Package, href: "/dashboard/products", label: "Products" },
  { icon: IndianRupee, href: "/dashboard/earnings", label: "Earnings" },
  { icon: CreditCard, href: '/dashboard/billing', label: "Billing" },
  { icon: ChartColumnBig, href: "/dashboard/analytics", label: "Analytics" },
  { icon: Settings, href: "/dashboard/settings", label: "Settings" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryItems = navItems.slice(0, 3); // visible in bar
  const moreItems = navItems.slice(3);       // inside "More"

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0D0D0D]/95 backdrop-blur-xl md:hidden">
      <div className="relative flex items-center justify-around px-3 py-2">
        {primaryItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className="flex flex-col items-center gap-1 text-[11px] transition-all duration-300 ease-out"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ease-out ${active ? "bg-white text-black shadow-lg shadow-white/20" : "bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105"
                  }`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <span className={active ? "text-white font-medium" : "text-white/60"}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 3 dots / More */}
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          className="flex flex-col items-center gap-1 text-[11px] text-white/70 transition-all duration-300 ease-out hover:text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 ease-out hover:bg-white/20 hover:scale-105">
            <MoreHorizontal className="h-4 w-4" />
          </div>
          <span>More</span>
        </button>

        {/* More menu */}
        {moreOpen && (
          <div className="absolute bottom-14 inset-x-4 rounded-2xl bg-[#161616]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 px-3 py-2 flex justify-around">
            {moreItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-1 text-[11px] transition-all duration-300 ease-out"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ease-out ${active
                        ? "bg-white text-black shadow-lg shadow-white/20"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105"
                      }`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className={active ? "text-white font-medium" : "text-white/60"}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
