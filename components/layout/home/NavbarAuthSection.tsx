'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompleteProfileModal } from '@/components/modals/CompleteProfileModal';

export function NavbarAuthSection() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [isOpen, setIsOpen] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check for fresh signup flag
  useEffect(() => {
    if (session?.user && !session.user.phone) {
      const shouldShow = localStorage.getItem('showCompleteProfile');
      const modalSeen = localStorage.getItem('profileModalSeen');

      if (shouldShow === 'true' && modalSeen !== 'true') {
        setShowCompleteProfile(true);
        localStorage.removeItem('showCompleteProfile');
      }
    }
  }, [session]);

  if (isLoading) {
    return <div className="h-9 w-28 animate-pulse rounded-full bg-gray-200" />;
  }

  if (!session) {
    return (
      <>
        <Link
          href="/signin"
          className="px-3 py-1 text-sm font-bold text-[#2B281F] rounded-full hover:bg-gray-100 transition"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="bg-black px-4 py-1.5 text-sm font-bold text-white rounded-full shadow-lg hover:scale-[1.03] hover:bg-gray-800 transition"
        >
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <>
      {showCompleteProfile && (
        <CompleteProfileModal onClose={() => setShowCompleteProfile(false)} />
      )}

      <div className="relative bg-white/80 rounded-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center cursor-pointer gap-2 rounded-full px-2 py-1.5 transition-all duration-200 ${isOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
        >
          {session.user?.image ? (
            <Image src={session.user.image} alt="User" width={32} height={32} className="h-8 w-8 rounded-full object-cover ring-2 ring-white" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-white">
              <User size={16} className="text-gray-500" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-900 max-w-[100px] truncate hidden md:block">
            {session.user?.name || 'User'}
          </span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-gray-200/60 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5 focus:outline-none overflow-hidden z-50"
            >
              <div className="p-1">
                <div className="px-3 py-2.5 mb-1">
                  <div className="flex items-center gap-3">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="User"
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-100"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center ring-1 ring-gray-100">
                        <User size={16} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">
                        {session.user?.name || 'User'}
                      </p>
                      <p className="text-[11px] font-medium text-gray-500 truncate leading-tight">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 mx-1 mb-1" />

                <div className="space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                  >
                    <User size={15} className="text-gray-400 group-hover:text-gray-600" />
                    Profile
                  </Link>

                  {session.user.role === 'Creator' && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    >
                      <LayoutDashboard size={15} className="text-gray-400 group-hover:text-gray-600" />
                      Dashboard
                    </Link>
                  )}
                </div>

                <div className="h-px bg-gray-100 mx-1 my-1" />

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut size={15} className="text-gray-400 group-hover:text-red-500" />
                  Log Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
