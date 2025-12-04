"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { verifySubscriptionPayment } from "@/services/subscription.service";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "failed">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyPayment = async () => {
      const subscriptionId = searchParams.get('subscription_id');
      
      if (!subscriptionId) {
        setStatus("failed");
        setErrorMessage("No subscription ID found");
        return;
      }

      try {
        const result = await verifySubscriptionPayment(subscriptionId);
        
        if (result.subscription && result.subscription.status === 'active') {
          setStatus("success");
          setTimeout(() => {
            router.push("/dashboard/billing");
          }, 2000);
        } else {
          setStatus("failed");
          setErrorMessage(result.message || "Subscription activation failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setErrorMessage("An error occurred during verification");
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center"
    >
      {status === "processing" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-black" />
          <h2 className="text-xl font-bold text-gray-900">Processing Payment...</h2>
          <p className="text-gray-500">Please wait while we confirm your subscription.</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="text-gray-500">Your subscription is now active. Redirecting you to your billing dashboard...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-red-100 p-3">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Payment Failed</h2>
          <p className="text-gray-500">{errorMessage || "Something went wrong. Please try again."}</p>
          <button 
            onClick={() => router.push("/dashboard/billing")}
            className="mt-2 rounded-full bg-black px-6 py-2 text-sm font-bold text-white hover:bg-gray-800"
          >
            Return to Billing
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function SubscriptionCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-black" />}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
