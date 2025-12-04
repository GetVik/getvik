"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { IconProps, DropdownButtonProps } from '@/types';

type SidebarButtonProps = {
  icon: React.ElementType;
  href: string;
  active?: boolean;
};

export function SidebarButton({ icon: Icon, href, active = false }: SidebarButtonProps) {
  return (
    <Link
      href={href}
      className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ease-out
      ${active
          ? 'bg-white text-black shadow-lg shadow-white/20'
          : 'bg-[#262626] text-gray-400 hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-md hover:shadow-black/30'
        }`}
    >
      <Icon size={24} />
    </Link>
  );
}

export function HeaderButton({ icon: Icon, children }: IconProps) {
  return (
    <button className="flex items-center gap-2 rounded-lg bg-[#262626] px-4 py-2 text-sm text-gray-300 transition-all duration-300 ease-out hover:bg-gray-700 hover:text-white hover:scale-105">
      <Icon size={16} />
      {children}
    </button>
  );
}

export function DropdownButton({ children }: DropdownButtonProps) {
  return (
    <button className="flex items-center gap-2 rounded-lg bg-[#262626] px-4 py-2 text-sm text-gray-400 transition-all duration-300 ease-out hover:bg-gray-700 hover:text-white hover:scale-105">
      {children}
      <ChevronDown size={16} />
    </button>
  );
}

export function IconButton({ icon: Icon, className }: IconProps) {
  return (
    <button
      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-[#262626] text-gray-400 transition-all duration-300 ease-out hover:bg-gray-700 hover:text-white hover:scale-105 ${className}`}
    >
      <Icon size={18} />
    </button>
  );
}