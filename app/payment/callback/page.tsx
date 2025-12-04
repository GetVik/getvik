"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const verify = async () => {
      if (!orderId) {
        router.replace("/");
        return;
      }

      try {
        // Import dynamically to avoid circular deps if any, though not strictly needed here
        const { verifyPayment } = await import("@/services/order.service");
        const result = await verifyPayment(orderId);

        if (result.success && result.order) {
          router.replace(`/order-complete?order_id=${result.order._id}`);
        } else {
          // Payment failed or cancelled
          const storeSlug = result.order?.creatorId?.storeSlug;
          const productSlug = result.order?.productId?.slug;

          if (storeSlug && productSlug) {
            router.replace(`/store/${storeSlug}/product/${productSlug}`);
          } else {
            // Fallback if we can't determine where to go
            router.replace("/");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        router.replace("/");
      }
    };

    verify();
  }, [orderId, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <Loader2 className="h-10 w-10 animate-spin text-gray-400 mb-4" />
      <h2 className="text-lg font-medium">Verifying Payment...</h2>
      <p className="text-sm text-gray-500 mt-2">Please wait while we confirm your order.</p>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
