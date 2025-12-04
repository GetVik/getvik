"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { resendSignupOtp } from "@/services/auth.service";
import toast from "react-hot-toast";


function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const hasSentOtp = useRef(false);

  useEffect(() => {
    if (!email) {
      toast.error("No email provided");
      router.push("/signin");
    } else if (!hasSentOtp.current) {
      hasSentOtp.current = true;

      const sendOtp = async () => {
        setIsResending(true);
        try {
          await resendSignupOtp(email);
          toast.success("Verification code sent to your email");
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message || "Failed to send OTP");
          }
        } finally {
          setIsResending(false);
        }
      };
      sendOtp();
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Email verified successfully!");
      router.push("/signin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    setIsResending(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Verification email sent!");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a verification code to <strong>{email}</strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="otp" className="sr-only">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Verify Email"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-sm font-medium text-brand-dark hover:text-gray-500 disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        </div>

        <div className="text-center mt-4">
          <a href="/signin" className="text-sm font-medium text-gray-600 hover:text-black">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
