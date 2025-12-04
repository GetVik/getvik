'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

import {
    ReportTargetType,
    ProductReportReason,
    CreatorReportReason,
} from '@/types/report.interface';
import { submitReport } from '@/services/report.service';
import toast from 'react-hot-toast';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: ReportTargetType;
    targetId: string;
}

export default function ReportModal({
    isOpen,
    onClose,
    targetType,
    targetId,
}: ReportModalProps) {
    const [reason, setReason] = useState<ProductReportReason | CreatorReportReason | ''>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    if (!isOpen) return null;

    const reasons =
        targetType === ReportTargetType.PRODUCT
            ? Object.values(ProductReportReason)
            : Object.values(CreatorReportReason);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            toast.error('Please select a reason');
            return;
        }

        setLoading(true);
        try {
            await submitReport({
                targetType,
                targetId,
                reason: reason as ProductReportReason | CreatorReportReason,
                description,
            });
            toast.success('Report submitted successfully');
            onClose();
            setReason('');
            setDescription('');
        } catch (error) {
            const err = error as Error;
            toast.error(err.message || 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        <h2 className="font-semibold text-lg">Report {targetType}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Reason
                        </label>
                        <select
                            value={reason}
                            onChange={(e) =>
                                setReason(
                                    e.target.value as
                                    | ProductReportReason
                                    | CreatorReportReason
                                )
                            }
                            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            required
                        >
                            <option value="">Select a reason</option>
                            {reasons.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Please provide more details..."
                            maxLength={1000}
                        />
                        <p className="text-xs text-zinc-500 mt-1 text-right">
                            {description.length}/1000
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
