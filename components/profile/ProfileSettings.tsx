'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Mail, CheckCircle, User, Shield, Settings, Menu } from 'lucide-react';
import { validatePhoneNumber, formatPhoneNumber } from '@/lib/phone.utils';
import { updateUserPhone, fetchUserProfile } from '@/services/settings.service';
import toast from 'react-hot-toast';
import { PhoneInput } from '@/components/ui/PhoneInput';

type Tab = 'account' | 'security' | 'preferences';

export function ProfileSettings() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<Tab>('account');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState(session?.user?.name || '');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingProfile, setIsFetchingProfile] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {

        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            console.log('ProfileSettings: User unauthenticated, stopping load');
            setIsFetchingProfile(false);
            return;
        }

        const loadProfile = async () => {
            setIsFetchingProfile(true);
            try {
                const userData = await fetchUserProfile();

                if (userData.user) {
                    setName(userData.user.name);
                    setIsVerified(userData.user.isVerified);
                    if (userData.user.phone) {
                        setPhone(userData.user.phone);
                    }
                }
            } catch (error) {
                console.error('ProfileSettings: Failed to fetch user profile:', error);
            } finally {
                setIsFetchingProfile(false);
            }
        };

        loadProfile();
    }, [status, session?.user?.email]);

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        setError(null);
        setHasChanges(true);
    };

    const handleSavePhone = async (e: React.FormEvent) => {
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
            // No longer updating session as phone is not in session
            // await update({ ... });

            toast.success('Phone number updated successfully!');
            setHasChanges(false);
        } catch (err: unknown) {
            console.error('Failed to update phone:', err);
            setError('Failed to update phone number. Please try again.');
            toast.error('Failed to update phone number');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'account' as Tab, label: 'Account', icon: User, description: 'Manage your account details' },
        { id: 'security' as Tab, label: 'Security', icon: Shield, description: 'Password and security settings', disabled: true },
        { id: 'preferences' as Tab, label: 'Preferences', icon: Settings, description: 'App preferences and notifications', disabled: true },
    ];

    if (isFetchingProfile) {
        return (
            <div className="flex items-center justify-center h-64 rounded-2xl border border-[#262626] bg-[#101010]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="rounded-2xl border border-[#262626] bg-[#101010] overflow-hidden">
                    <div className="p-5 border-b border-[#262626] md:hidden flex items-center justify-between">
                        <span className="font-semibold text-white text-base">Settings Menu</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-400 hover:text-white transition-colors p-2 -mr-2"
                            aria-label="Toggle menu"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block p-3 space-y-1.5`}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (!tab.disabled) {
                                            setActiveTab(tab.id);
                                            setIsMobileMenuOpen(false);
                                        }
                                    }}
                                    disabled={tab.disabled}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-lg transition-all text-left ${activeTab === tab.id
                                        ? 'bg-[#1a1a1a] text-white border border-[#333]'
                                        : tab.disabled
                                            ? 'text-gray-600 cursor-not-allowed'
                                            : 'text-gray-400 hover:text-gray-200 hover:bg-[#141414]'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <div className="flex flex-col">
                                        <span>{tab.label}</span>
                                        {tab.disabled && <span className="text-[10px] text-gray-600">Coming Soon</span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                <div className="rounded-2xl border border-[#262626] bg-[#101010] p-5 md:p-6 min-h-[400px]">
                    {activeTab === 'account' && (
                        <div className="space-y-8 max-w-2xl">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-white mb-1.5">Account Information</h2>
                                <p className="text-sm text-gray-400">
                                    Manage your personal information and contact details.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            readOnly
                                            className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 pl-11 text-sm md:text-base text-gray-400 cursor-not-allowed focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={session?.user?.email || ''}
                                            readOnly
                                            className="w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 pl-11 pr-24 text-sm md:text-base text-gray-400 cursor-not-allowed focus:outline-none"
                                        />
                                        {isVerified && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full text-xs font-medium">
                                                <CheckCircle size={12} />
                                                <span className="hidden sm:inline">Verified</span>
                                                <span className="sm:hidden">✓</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Phone Number Field */}
                                <form onSubmit={handleSavePhone}>
                                    <div>
                                        <label htmlFor="phone-settings" className="block text-sm font-medium text-gray-300 mb-2.5">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <PhoneInput
                                                id="phone-settings"
                                                value={phone}
                                                onChange={handlePhoneChange}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        {error && (
                                            <p className="mt-2 text-sm text-red-400">{error}</p>
                                        )}
                                        {!error && phone && (
                                            <p className="mt-2 text-xs text-gray-500">
                                                Preview: {formatPhoneNumber(phone)}
                                            </p>
                                        )}
                                    </div>

                                    {hasChanges && (
                                        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <button
                                                type="submit"
                                                disabled={isLoading || !phone}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    'Save Changes'
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPhone(session?.user?.phone || '');
                                                    setHasChanges(false);
                                                    setError(null);
                                                }}
                                                disabled={isLoading}
                                                className="px-4 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50 rounded-lg border border-[#262626] hover:border-[#333]"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
                                <Shield className="h-8 w-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Security Settings</h3>
                            <p className="text-gray-400 max-w-sm">
                                Advanced security features like Two-Factor Authentication and Login History are coming soon.
                            </p>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
                                <Settings className="h-8 w-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Preferences</h3>
                            <p className="text-gray-400 max-w-sm">
                                Customization options for notifications, theme, and language will be available shortly.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
