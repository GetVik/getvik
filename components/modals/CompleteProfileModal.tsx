'use client';

import { useState, useEffect } from 'react';
import { X, Phone, Loader2 } from 'lucide-react';
import { validatePhoneNumber } from '@/lib/phone.utils';
import { updateUserPhone, fetchUserProfile } from '@/services/settings.service';
import toast from 'react-hot-toast';
// import { useSession } from 'next-auth/react';
import { PhoneInput } from '@/components/ui/PhoneInput';

interface CompleteProfileModalProps {
    onClose: () => void;
}

export function CompleteProfileModal({ onClose }: CompleteProfileModalProps) {
    // const { data: session } = useSession(); // Removed unused session
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadPhone = async () => {
            try {
                const data = await fetchUserProfile();
                console.log(data);
                if (data.user.phone) {
                    setPhone(data.user.phone);
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };
        loadPhone();
    }, []);

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        setError(null);
    };

    const handleSkip = () => {
        // Mark as seen in localStorage
        localStorage.setItem('profileModalSeen', 'true');
        onClose();
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
            localStorage.setItem('profileModalSeen', 'true');
            onClose();
        } catch (err: unknown) {
            console.error('Failed to update phone:', err);
            setError('Failed to update phone number. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl border border-[#262626] bg-[#0D0D0D] p-6 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={handleSkip}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                        <Phone className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Add your phone number to complete your profile. This will be required for purchases.
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
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={isLoading}
                            className="flex-1 rounded-lg border border-[#262626] bg-transparent px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-[#1a1a1a] disabled:opacity-50"
                        >
                            Skip for now
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !phone}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Add Phone Number'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
