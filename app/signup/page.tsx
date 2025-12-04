'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SignupForm } from '@/components/forms/SignupForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchUserProfile } from '@/services/settings.service';

const Logo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 108 108"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M20.25 87.75V20.25H47.25V87.75H20.25Z" fill="#2B281F" />
    <path d="M54 20.25L87.75 87.75H54V20.25Z" fill="#2B281F" />
  </svg>
);



export default function SignupPage() {
  const router = useRouter();
  const { status } = useSession();

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
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 bg-dot-pattern p-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-center">
          <Link href="/" aria-label="Homepage">
            <Logo />
          </Link>
        </div>

        <h1 className="mt-6 text-center text-3xl text-blacknp font-bold tracking-tight text-brand-dark">
          Create your account
        </h1>

        <div className="mt-8">
          <SignupForm />
        </div>

        {/* Demo Login */}
        <div className="mt-4">
          <button
            onClick={() => {
              // Redirect to signin with demo credentials or just signin directly
              import('next-auth/react').then(({ signIn }) => {
                signIn('credentials', {
                  email: 'demo@getvik.com',
                  password: 'password',
                  callbackUrl: '/dashboard'
                });
              });
            }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Demo Login
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-semibold text-brand-dark hover:text-brand-gray-hover transition"
          >
            Sign in
          </Link>
        </p>
      </motion.div >
    </div >
  );
}
