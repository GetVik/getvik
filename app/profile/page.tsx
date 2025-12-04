'use client';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { OrderHistory } from '@/components/profile/OrderHistory';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/discover/NavbarSearch';

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <ProfileHeader />
          <ProfileSettings />
          <OrderHistory />
          <div className="flex justify-center">
            <a href="/cart" className="text-gray-400 hover:text-white underline">Go to Cart</a>
          </div>
        </div>
      </div>
    </div>
  );
}
