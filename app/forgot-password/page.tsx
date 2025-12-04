'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import BlobBg from '@/public/blob-bg.svg';

const Logo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 108 108"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.25 87.75V20.25H47.25V87.75H20.25Z" fill="#2B281F" />
    <path d="M54 20.25L87.75 87.75H54V20.25Z" fill="#2B281F" />
  </svg>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 p-4 bg-dot-pattern">
      {/* Background Blur */}
      <div className="absolute inset-0 -z-10 flex justify-center items-center">
        <Image
          src={BlobBg}
          alt="abstract background"
          fill
          className="object-cover opacity-60 blur-[60px] scale-125"
          priority
        />
      </div>

      <motion.div
        className="w-full max-w-sm z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-center">
          <Link href="/" aria-label="Homepage">
            <Logo />
          </Link>
        </div>

        <h1 className="mt-6 text-center text-black text-3xl font-bold">
          Reset your password
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a code to reset your password.
        </p>

        <div className="mt-8">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-50 rounded-lg text-green-700 text-sm">
                If an account exists for <strong>{email}</strong>, we have sent a verification code.
              </div>
              <Link
                href={`/reset-password?email=${encodeURIComponent(email)}`}
                className="inline-flex justify-center rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-800"
              >
                Enter Code
              </Link>
              <div className="mt-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Try a different email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-dark">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-black focus:border-black transition sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center rounded-full cursor-pointer bg-black px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Code'}
              </button>
            </form>
          )}
        </div>

        {error && (
          <p className="mt-4 p-3 rounded-md bg-red-50 text-sm text-red-700 border border-red-200 text-center">
            {error}
          </p>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/signin"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
