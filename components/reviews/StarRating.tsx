'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  size?: number;
  className?: string;
  readOnly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  size = 20,
  className,
  readOnly = true,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const currentRating = hoverRating || rating;
        
        // Build the class string manually
        const starClasses = [
          'transition-colors',
          readOnly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-400',
          currentRating >= star
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-600',
        ];

        return (
          <label key={star}>
            <input
              type="radio"
              name="rating"
              value={star}
              className="hidden"
              onClick={() => !readOnly && setRating?.(star)}
              disabled={readOnly}
            />
            <Star
              size={size}
              className={starClasses.join(' ')} // Join the classes
              onMouseEnter={() => !readOnly && setHoverRating(star)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
            />
          </label>
        );
      })}
    </div>
  );
};