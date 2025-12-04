"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Package,
  IndianRupee,
  Settings,
  Plus,
  ChartColumnBig,
  CreditCard
} from 'lucide-react';
import { SidebarButton } from '../ui/buttons/buttons';
import Link from 'next/link';

const sidebarLinks = [
  { icon: LayoutGrid, href: '/dashboard' },
  { icon: Package, href: '/dashboard/products' },
  { icon: IndianRupee, href: '/dashboard/earnings' },
  { icon: Settings, href: '/dashboard/settings' },
  { icon: ChartColumnBig, href: '/dashboard/analytics' },
  // { icon: Star, href: '/dashboard/subscription' },
  { icon: CreditCard, href: '/dashboard/billing' },
];

const Logo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 108 108"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.25 87.75V20.25H47.25V87.75H20.25Z" fill="black" />
    <path d="M54 20.25L87.75 87.75H54V20.25Z" fill="black" />
  </svg>
);


export function Sidebar() {
  const pathname = usePathname(); // Get the current page path

  return (
    <div className="flex w-24 min-h-screen flex-col items-center justify-between bg-[#1A1A1A]/50 py-8">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl font-bold text-black shadow-lg shadow-black/30 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-black/50 hover:scale-105">
          <Link href="/"><Logo /></Link>
        </div>

        <div>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            {sidebarLinks.map((link) => (
              <SidebarButton
                key={link.href}
                icon={link.icon}
                href={link.href}
                // Set active state dynamically based on the current path
                active={pathname === link.href}
              />
            ))}
          </nav>
        </div>

        {/* Add New Product Button - now also a link */}
      </div>
        <SidebarButton
          icon={Plus}
          href="/dashboard/products/new"
          // This button will be active when you are on the "new product" page
          active={pathname === '/dashboard/products/new'}
        />
    </div>
  );
}