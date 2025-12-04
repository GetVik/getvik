'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Phone, Loader2, AlertCircle } from 'lucide-react';
import { validatePhoneNumber } from '@/lib/phone.utils';
import { updateUserPhone } from '@/services/settings.service';
import toast from 'react-hot-toast';
// import { useSession } from 'next-auth/react';
import { PhoneInput } from '@/components/ui/PhoneInput';

interface PhoneRequiredModalProps {
    onPhoneAdded: () => void;
}

export function PhoneRequiredModal({ onPhoneAdded }: PhoneRequiredModalProps) {
    // const { data: session } = useSession(); // Removed unused session
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validation = validatePhoneNumber(phone);
        if (!validation.isValid) {
            setError(validation.error || 'Invalid phone number');
            return;
        }

        setIsLoading(true);

        try {
            await updateUserPhone(phone);

            await updateUserPhone(phone);
            // No longer updating session as phone is not in session
            // await update({ ... });

            toast.success('Phone number added successfully!');
            onPhoneAdded();
        } catch (err: unknown) {
            console.error('Failed to update phone:', err);
            setError('Failed to update phone number. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl border border-[#262626] bg-[#0D0D0D] p-6 shadow-2xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                        <AlertCircle className="h-6 w-6 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Phone Number Required</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Please add your phone number to complete the purchase. This is required for order confirmation and delivery.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <PhoneInput
                                id="phone"
                                value={phone}
                                onChange={handlePhoneChange}
                                disabled={isLoading}
                            />
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-400">{error}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                            Enter a valid 10-digit Indian mobile number or international number starting with +
                        </p>
                    </div>

                    {/* Action */}
                    <button
                        type="submit"
                        disabled={isLoading || !phone}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Phone className="h-4 w-4" />
                                Continue to Checkout
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
