'use client';

import { IFullProduct } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';


import { PhoneRequiredModal } from '@/components/modals/PhoneRequiredModal';
import { fetchUserProfile } from '@/services/settings.service';

interface CheckoutButtonProps {
  product: IFullProduct;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CheckoutButton({ product: _product }: CheckoutButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const proceedToCheckout = async () => {
    setIsLoading(true);

    try {

      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Payment successful!");
      // Redirect to order complete or dashboard
      router.push('/dashboard/orders');

    } catch (err) {
      console.error('Checkout failed', err);
      toast.error((err as Error).message || 'Checkout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    // Check if user has phone number
    // Check if user has phone number
    try {
      const userProfile = await fetchUserProfile();
      if (!userProfile.user?.phone) {
        setShowPhoneModal(true);
        return;
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      setShowPhoneModal(true);
      return;
    }

    await proceedToCheckout();
  };

  const handlePhoneAdded = async () => {
    setShowPhoneModal(false);
    // Proceed to checkout after phone is added
    await proceedToCheckout();
  };

  if (status === 'loading') {
    return (
      <button
        disabled
        className="flex w-full items-center justify-center rounded-lg bg-[#191919] px-6 py-3 text-lg font-semibold text-gray-500"
      >
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      </button>
    );
  }

  return (
    <>
      {showPhoneModal && (
        <PhoneRequiredModal onPhoneAdded={handlePhoneAdded} />
      )}

      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-lg bg-[#262626] px-6 py-2 text-lg font-semibold text-gray-300 transition-all hover:bg-gray-700 hover:text-white disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Lock className="mr-2 h-5 w-5" />
        )}
        Buy Now
      </button>
    </>
  );
}