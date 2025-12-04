'use client';

import { GoogleLoginButton } from '@/components/ui/buttons/GoogleLoginButton';
import { LoginForm } from '@/components/forms/LoginForm';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import BlobBg from '@/public/blob-bg.svg';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { fetchUserProfile } from '@/services/settings.service';

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

const LoginContent = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const error = searchParams.get('error');

  const handleGoogleSignIn = async (): Promise<void> => {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/signin' });
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (status === 'authenticated') {
        try {
          const userData = await fetchUserProfile();
          if (userData.user.role === 'User') {
            router.push('/profile');
          } else {
            router.push('/dashboard');
          }
        } catch (error) {
          console.error("Failed to fetch user profile for redirect:", error);
          // Fallback to dashboard or stay on page with error?
          // For now, fallback to dashboard as safe default if auth is valid
          router.push('/dashboard');
        }
      }
    };

    checkUserAndRedirect();
  }, [status, router]);

  // Prevent flash while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 z-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }


  if (status === 'authenticated') {
    return null;
  }

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

      {/* Content */}
      <motion.div
        className="w-full max-w-sm z-10 text-black"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" aria-label="Homepage">
            <Logo />
          </Link>
        </div>

        {error && (
          <div className="mt-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <p>
              {error === 'Callback'
                ? 'Authentication failed. Please try again.'
                : 'An error occurred during sign in.'}
            </p>
          </div>
        )}

        <h1 className="mt-6 text-center text-black text-3xl font-bold">
          Sign in to your account
        </h1>

        {/* Google Login */}
        <div className="mt-8">
          <GoogleLoginButton
            onClick={handleGoogleSignIn}
            isLoading={googleLoading}
          />
        </div>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or with email</span>
          </div>
        </div>

        {/* Email Form */}
        <div className="mt-6">
          <LoginForm />
        </div>

        {/* Demo Login */}
        <div className="mt-4">
          <button
            onClick={() => {
              signIn('credentials', {
                email: 'demo@getvik.com',
                password: 'password',
                callbackUrl: '/dashboard'
              });
            }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Demo Login
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-brand-dark hover:text-brand-gray-hover transition"
          >
            Sign up
          </Link>
        </p>
      </motion.div >
    </div >
  );
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 z-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
