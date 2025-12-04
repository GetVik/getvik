'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { StarRating } from '../reviews/StarRating';
import { Loader2 } from 'lucide-react';
import { AvatarWithFallback } from '@/components/ui/avatar/AvatarWithFallback';

import toast from 'react-hot-toast';

interface ReviewFormProps {
  productId: string;
}

interface ReviewPayload {
  rating: number;
  comment?: string;
}

const postReview = async ({
  productId,
  payload,
}: {
  productId: string;
  payload: ReviewPayload;
}) => {
  const response = await api.post(
    `/products/${productId}/reviews`,
    payload,
  );
  return response.data;
};

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Mutation hook for submitting the review
  const mutation = useMutation<
    unknown,
    Error,
    ReviewPayload
  >({
    mutationFn: (payload: ReviewPayload) => postReview({ productId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setRating(0);
      setComment('');
      toast.success('Review submitted successfully!');
    },
    onError: (err) => {
      const errorMsg = err.message || 'Failed to submit review.';
      toast.error(errorMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.reset();

    if (rating === 0) {
      toast.error('Please select a rating.');
      return;
    }

    mutation.mutate({ rating, comment });
  };

  if (status === 'unauthenticated') {
    return (
      <div className="text-sm text-gray-500">
        You must be logged in to leave a review.
      </div>
    );
  }

  if (status === 'loading') {
    return <Loader2 className="animate-spin text-gray-400" />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4">
      <AvatarWithFallback
        src={session?.user?.image}
        alt={session?.user?.name || 'User'}
        size={40}
        fallbackText={session?.user?.name || undefined}
        className="h-10 w-10 shrink-0"
      />
      <div className="w-full">
        <div className="p-4 rounded-lg bg-[#191919] border border-[#262626]">
          <StarRating
            rating={rating}
            setRating={setRating}
            readOnly={mutation.isPending}
            className="mb-2"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full h-24 p-2 bg-[#0D0D0D] text-gray-300 rounded-md border border-gray-700 focus:border-[#643446] focus:ring-[#643446] outline-none resize-none text-sm"
            disabled={mutation.isPending}
          />
        </div>
        <div className="flex items-center justify-end mt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-gray-200 disabled:opacity-50"
          >
            {mutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {mutation.isPending ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </form>
  );
};