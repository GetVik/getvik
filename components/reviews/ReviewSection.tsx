"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { IReview } from "@/types/types";
import { Loader2, AlertCircle, Pencil, Trash2, X, Check } from "lucide-react";
import { ReviewForm } from "../forms/ReviewForm";
import { StarRating } from "./StarRating";
import { AvatarWithFallback } from "@/components/ui/avatar/AvatarWithFallback";
import { formatDistanceToNow } from "date-fns";

import toast from "react-hot-toast";


const ReviewCard: React.FC<{ review: IReview; productId: string }> = ({
  review,
  productId,
}) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment || "");

  const isOwner = session?.user?.id === review.userId._id;

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/products/${productId}/reviews/${review._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Review deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/products/${productId}/reviews/${review._id}`, {
        rating,
        comment,
      });
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Review updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update review");
    },
  });

  const handleUpdate = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    updateMutation.mutate();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate();
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setRating(review.rating);
    setComment(review.comment || "");
  };

  return (
    <div className="flex items-start gap-4 py-4 group">
      <AvatarWithFallback
        src={review.userId.profileImageUrl}
        alt={review.userId.name}
        size={40}
        fallbackText={review.userId.name}
        className="h-10 w-10 shrink-0"
      />
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-white">{review.userId.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </span>
            {isOwner && !isEditing && (
              <div className="flex items-center gap-1 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Edit review"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete review"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-3">
            <StarRating rating={rating} setRating={setRating} readOnly={false} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-20 p-2 bg-[#0D0D0D] text-gray-300 rounded-md border border-gray-700 focus:border-[#643446] focus:ring-[#643446] outline-none resize-none text-sm"
              placeholder="Update your review..."
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex items-center gap-1 px-3 py-1.5 bg-white text-black text-xs font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={updateMutation.isPending}
                className="flex items-center gap-1 px-3 py-1.5 bg-transparent border border-gray-700 text-gray-300 text-xs font-medium rounded hover:bg-gray-800 transition-colors"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <StarRating rating={review.rating} size={16} readOnly />
            {review.comment && (
              <p className="text-gray-400 mt-2 text-sm">{review.comment}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};


interface ReviewSectionProps {
  productId: string;
  productTitle: string;
  averageRating: number;
  reviewCount: number;
}


import { mockReviews } from "@/data/mock";

const fetchReviews = async (): Promise<IReview[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockReviews;
};

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  productTitle,
  averageRating,
  reviewCount,
}) => {
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery<IReview[], Error>({

    queryKey: ["reviews", productId],
    queryFn: fetchReviews,
  });

  return (
    <div className="mt-16 pt-12 border-t border-[#262626]">
      <h2 className="text-2xl font-light text-white mb-2">Customer Reviews</h2>

      {reviewCount > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <StarRating rating={averageRating} readOnly />
          <span className="text-gray-400 text-sm">
            {averageRating.toFixed(1)} stars ({reviewCount} reviews)
          </span>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-light text-white mb-4">
          Leave a review for {productTitle}
        </h3>
        <ReviewForm productId={productId} />
      </div>

      <div className="divide-y divide-gray-800">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-400">

              {error?.message || "Failed to load reviews."}
            </p>
          </div>
        )}
        {!isLoading && !isError && reviews && (
          <>
            {reviews.length === 0 ? (
              <p className="py-10 text-center text-gray-500">
                Be the first to review this product.
              </p>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  productId={productId}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
