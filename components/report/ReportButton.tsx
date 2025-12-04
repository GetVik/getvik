'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import ReportModal from './ReportModal';
import { ReportTargetType } from '@/types/report.interface';

interface ReportButtonProps {
    targetType: ReportTargetType;
    targetId: string;
    className?: string;
    variant?: 'text' | 'icon' | 'button' | 'ghost';
}

export default function ReportButton({
    targetType,
    targetId,
    className = '',
    variant = 'text',
}: ReportButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-2 transition-colors ${variant === 'text'
                    ? 'text-xs text-zinc-500 hover:text-red-500'
                    : variant === 'icon'
                        ? 'p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800/50 rounded-full'
                        : variant === 'ghost'
                            ? 'px-3 py-1.5 text-xs font-medium rounded-lg'
                            : 'px-3 py-1.5 text-xs font-medium text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg'
                    } ${className}`}
                title={`Report ${targetType}`}
            >
                <Flag className={variant === 'icon' ? 'w-4 h-4' : 'w-3 h-3'} />
                {variant !== 'icon' && <span>Report {targetType}</span>}
            </button>

            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                targetType={targetType}
                targetId={targetId}
            />
        </>
    );
}
