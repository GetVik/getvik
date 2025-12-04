'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileAuthSectionProps {
  onLinkClick: () => void;
}

export function MobileAuthSection({ onLinkClick }: MobileAuthSectionProps) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />;
  }

  if (!session) {
    return (
      <div className="flex flex-col space-y-3">
        <Link
          href="/signin"
          onClick={onLinkClick}
          className="rounded-full w-full text-center px-4 py-2.5 text-black font-bold bg-gray-200 hover:bg-gray-200"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          onClick={onLinkClick}
          className="rounded-full w-full text-center bg-black px-4 py-2.5 text-base font-bold text-white shadow-lg hover:bg-gray-800 hover:scale-[1.03] transition"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-2 py-2 text-left"
      >
        <div className="flex items-center gap-3">
          {session.user?.image ? (
            <Image src={session.user.image} alt="User" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={16} className="text-gray-500" />
            </div>
          )}
          <span className="font-semibold text-gray-900">{session.user?.name || 'Account'}</span>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1 px-2 pb-2">
              <Link
                href="/profile"
                onClick={onLinkClick}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
              >
                <User size={18} />
                Profile
              </Link>
              {session.user.role === 'Creator' && (
                <Link
                  href="/dashboard"
                  onClick={onLinkClick}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  onLinkClick();
                  signOut({ callbackUrl: '/' });
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
