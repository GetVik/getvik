'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink, Home, LogOut, Search, UserPen } from 'lucide-react';
import { AvatarWithFallback } from '@/components/ui/avatar/AvatarWithFallback';
import { signOut, useSession } from 'next-auth/react';

export function Header() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const creatorName = session?.user?.name ?? 'User';
  const storeSlug = session?.user?.storeSlug;
  const isCreator = session?.user?.role === 'Creator';

  return (
    <header className="flex items-center justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8 z-100">
      {/* Left: breadcrumb-style navigation */}
      <nav className="flex items-center gap-2 shrink-0 text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-lg bg-[#262626] px-3 py-1.5 text-gray-300 transition-all duration-300 ease-out hover:bg-gray-700 hover:text-white hover:scale-105"
        >
          <Home size={14} />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {isCreator && storeSlug && (
          <>
            <span className="text-xs text-gray-500">/</span>
            <Link
              href={`/store/${storeSlug}`}
              className="inline-flex items-center gap-1 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-gray-300 transition-all duration-300 ease-out hover:bg-gray-700 hover:text-white hover:scale-105"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Store</span>
            </Link>
          </>
        )}
      </nav>

      {/* Right: Avatar / dropdown */}
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative" ref={dropdownRef}>
          {/* Desktop button with name + avatar */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hidden cursor-pointer items-center gap-3 rounded-lg p-1 px-2 transition-all duration-300 ease-out hover:bg-[#262626] sm:flex"
          >
            <div className="text-right">
              <div className="text-sm font-medium text-white">{creatorName}</div>
            </div>
            <div className="relative">
              <AvatarWithFallback
                src={session?.user?.image}
                alt={creatorName}
                size={40}
                fallbackText={creatorName}
                className="h-10 w-10 ring-2 ring-white/10 transition-all duration-300 ease-out hover:ring-white/20"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#0D0D0D] bg-red-500" />
              </span>
            </div>
          </button>

          {/* Mobile avatar-only trigger */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative flex items-center justify-center sm:hidden h-10 w-10 rounded-full cursor-pointer hover:bg-[#262626] transition-all duration-300 ease-out"
          >
            <AvatarWithFallback
              src={session?.user?.image}
              alt={creatorName}
              size={32}
              fallbackText={creatorName}
              className="h-8 w-8 cursor-pointer ring-2 ring-white/10"
            />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#0D0D0D] bg-red-500" />
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl bg-[#262626]/95 backdrop-blur-xl shadow-2xl shadow-black/50 ring-1 ring-white/10 focus:outline-none">
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex w-full items-center px-4 py-2.5 text-sm text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserPen size={16} className="mr-3" />
                  Profile
                </Link>
                <Link
                  href="/discover"
                  className="flex w-full items-center px-4 py-2.5 text-sm text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Search size={16} className="mr-3" />
                  Discover
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    setIsDropdownOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center px-4 py-2.5 text-sm text-red-400 transition-colors duration-200 hover:bg-white/10 hover:text-red-300"
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
