"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

function OrderCompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl bg-[#1a1a1a] border border-[#333] p-8 text-center shadow-2xl"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-500/20 p-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-white">Order Successful!</h1>
        <p className="mb-6 text-gray-400">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {orderId && (
          <div className="mb-8 rounded-lg bg-[#262626] p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
            <p className="text-sm font-mono text-white break-all">{orderId}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => router.push("/profile")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag size={16} />
            View My Orders
          </button>
          
          <button 
            onClick={() => router.push("/")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#333] bg-transparent py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#262626] hover:text-white"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderCompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <OrderCompleteContent />
    </Suspense>
  );
}
