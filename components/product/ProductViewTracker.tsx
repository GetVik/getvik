'use client';

import { useEffect } from 'react';
import api from '@/lib/api';

interface ProductViewTrackerProps {
  productId: string;
}

export const ProductViewTracker: React.FC<ProductViewTrackerProps> = ({
  productId,
}) => {
useEffect(() => {
  const logView = async () => {
    try {
      const key = `viewed_${productId}`;

      // optional: only log once per sessionStorage
      if (typeof window !== 'undefined' && sessionStorage.getItem(key)) {
        return;
      }

      const externalReferrer =
        typeof document !== 'undefined' ? document.referrer || undefined : undefined;

      api.post(`/views/${productId}`, { externalReferrer });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, '1');
      }
    } catch (error) {
      console.error('Failed to log product view:', error);
    }
  };

  logView();
}, [productId]);


    return null;
};
