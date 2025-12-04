'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareStoreButtonProps {
    storeName: string;
    storeSlug: string;
    variant?: 'pill' | 'icon'; // 'pill' for desktop, 'icon' for mobile/header
}

export function ShareStoreButton({ storeName, storeSlug, variant = 'pill' }: ShareStoreButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}/store/${storeSlug}`;
        const shareData = {
            title: `${storeName} on GetVik`,
            text: `Check out ${storeName}'s store!`,
            url: url,
        };

        // 1. Try Native Mobile Share
        if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                console.log('Share canceled', err);
            }
        }

        // 2. Fallback to Clipboard Copy
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleShare}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                aria-label="Share store"
            >
                {copied ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
            </button>
        );
    }

    // Default 'pill' variant
    return (
        <button
            onClick={handleShare}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200",
                copied 
                    ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                    : "bg-white text-black hover:bg-gray-200"
            )}
        >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? 'Copied Link' : 'Share'}</span>
        </button>
    );
}