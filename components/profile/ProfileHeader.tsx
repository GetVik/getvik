'use client';

import { useSession } from 'next-auth/react';
import { AvatarWithFallback } from '@/components/ui/avatar/AvatarWithFallback';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function ProfileHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#262626] bg-[#101010] p-6 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20">
          <AvatarWithFallback
            src={user.image}
            alt={user.name || 'User'}
            size={80}
            fallbackText={user.name || 'U'}
            className="rounded-full border-2 border-[#262626]"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[#262626] bg-[#1a1a1a] px-2.5 py-0.5 text-xs font-medium text-gray-300">
              Member
            </span>
            {user.role === 'Creator' && (
              <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                Creator
              </span>
            )}
          </div>
        </div>
      </div>

      {user.role === 'Creator' ? (
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black transition-all hover:bg-gray-200"
        >
          <Sparkles className="h-4 w-4" />
          Dashboard
        </Link>
      ) : (
        <Link
          href="/onboarding"
          className="group flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black transition-all hover:bg-[#262626] hover:text-white"
        >
          <Sparkles className="h-4 w-4" />
          Become a Creator
        </Link>
      )}
    </div>
  );
}
