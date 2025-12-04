'use client';

import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/types/formats';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { createCheckoutSession } from '@/services/transaction.service';
import { load } from '@cashfreepayments/cashfree-js';
import { PhoneRequiredModal } from '@/components/modals/PhoneRequiredModal';
import Image from 'next/image';
import { fetchUserProfile } from '@/services/settings.service';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function CheckoutPage() {
    const { items, total } = useCart();
    const { status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPhoneModal, setShowPhoneModal] = useState(false);

    useEffect(() => {                                                                       
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [items, router]);

    const handlePayment = async () => {
        if (status === 'loading') {
            return;
        }

        if (status === 'unauthenticated') {
            router.push('/signin?callbackUrl=/checkout');
            return;
        }

        // Always check backend for phone number
        try {
            const userProfile = await fetchUserProfile();
            if (!userProfile.user?.phone) {
                setShowPhoneModal(true);
                return;
            }
            // Phone exists, proceed
        } catch (error) {
            console.error('Failed to fetch user profile', error);
            setShowPhoneModal(true);
            return;
        }

        setIsLoading(true);

        try {
            // For now, we only support single item checkout as per the backend service
            // We will take the first item for now, or loop if backend supports multiple
            // Assuming backend currently supports one product per transaction based on previous code
            // TODO: Update backend to support cart checkout. For now, we'll process the first item.

            if (items.length > 1) {
                toast.error("Currently only single item checkout is supported. Please purchase items individually.");
                setIsLoading(false);
                return;
            }

            const product = items[0].product;

            const { payment_session_id, environment } = await createCheckoutSession(product._id);

            if (!payment_session_id) {
                throw new Error('Failed to create payment session');
            }

            const cashfree = await load({
                mode: environment,
            });

            if (!cashfree) {
                throw new Error('Cashfree SDK failed to load');
            }

            await cashfree.checkout({
                paymentSessionId: payment_session_id,
                redirectTarget: '_self',
            });

            // Note: Cart clearing should ideally happen after successful payment webhook/callback
            // But for now, we rely on the redirect.

        } catch (err) {
            console.error('Checkout failed', err);
            toast.error((err as Error).message || 'Checkout failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneAdded = async () => {
        setShowPhoneModal(false);
        await handlePayment();
    };

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
                {/* Left Column: Order Details */}
                <div>
                    <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <div className="space-y-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-200">Order Details</h2>
                        <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
                            {items.map((item) => (
                                <div key={item.product._id} className="flex gap-4 p-4 border-b border-[#222] last:border-0">
                                    <div className="relative w-16 h-16 bg-[#1a1a1a] rounded-md overflow-hidden shrink-0">
                                        <Image
                                            src={item.product.media?.[0]?.url || 'https://placehold.co/400x400/1C1C1C/FFF?text=Product'}
                                            alt={item.product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-200">{item.product.title}</h3>
                                        <p className="text-sm text-gray-500">{item.product.creatorId?.storeName}</p>
                                    </div>
                                    <div className="font-medium">
                                        {formatCurrency(item.product.price)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-400 bg-[#111] p-4 rounded-lg border border-[#222]">
                        <ShieldCheck className="text-emerald-500" size={20} />
                        <p>Your payment information is encrypted and secure.</p>
                    </div>
                </div>

                {/* Right Column: Payment Summary */}
                <div className="lg:pt-16">
                    <div className="bg-[#111] rounded-2xl border border-[#222] p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24">
                        <h2 className="text-xl font-semibold mb-6">Payment Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            {/* <div className="flex justify-between text-gray-400">
                                <span>Platform Fee</span>
                                <span>{formatCurrency(0)}</span>
                            </div> */}
                            <div className="h-px bg-[#222] my-4" />
                            <div className="flex justify-between text-2xl font-bold text-white">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        {showPhoneModal && (
                            <PhoneRequiredModal onPhoneAdded={handlePhoneAdded} />
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Lock size={20} />
                            )}
                            {isLoading ? 'Processing...' : `Pay ${formatCurrency(total)}`}
                        </button>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            By clicking Pay, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
