"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** Simple class name merger (like clsx) */
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DashboardMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  menuItems?: DashboardMenuItem[];
}

export function DashboardCard({
  title,
  children,
  className,
  menuItems = [],
}: DashboardCardProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border border-white/5 bg-gradient-to-b from-[#1C1C1C] to-[#141414] p-5 md:p-6 shadow-lg shadow-black/30 transition-all duration-300 ease-out hover:border-white/10 hover:shadow-2xl hover:shadow-black/40 hover:scale-[1.02]",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-400">
          {title}
        </h2>

        {menuItems.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex cursor-pointer h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all duration-300 ease-out hover:bg-white/10 hover:text-white hover:scale-110"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-10 z-20 w-44 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#181818]/95 backdrop-blur-xl shadow-2xl shadow-black/50"
                >
                  {menuItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        if (item.href) router.push(item.href);
                        else if (item.onClick) item.onClick();
                      }}
                      className="block cursor-pointer w-full px-4 py-2.5 text-left text-sm text-gray-200 transition-all duration-200 ease-out hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
