'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { signupUser, verifySignupOtp } from '@/services/auth.service';
import { fetchUserProfile } from '@/services/settings.service';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { GoogleLoginButton } from '../ui/buttons/GoogleLoginButton';
import { useRouter } from 'next/navigation';

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'verification'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await signupUser({ name, email, password });
      setSuccess('Account created! Please check your email for the verification code.');
      setStep('verification');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during sign up.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await verifySignupOtp(email, otp);
      setSuccess('Email verified successfully! Logging you in...');


      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {

        router.push('/signin');
      } else {
        localStorage.setItem('showCompleteProfile', 'true');


        try {
          const userData = await fetchUserProfile();
          if (userData.user.role === 'User') {
            router.push('/profile');
          } else {
            router.push('/dashboard');
          }
        } catch (error) {
          console.error("Failed to fetch profile for redirect:", error);
          router.push('/dashboard');
        }
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Invalid OTP.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/signup' });
    } catch {
      // optional: show a tiny error in console — keep UI generic
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (step === 'verification') {
    return (
      <div className="w-full">
        <h2 className="text-center text-xl font-bold mb-4">Verify your Email</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          We have sent a verification code to <strong>{email}</strong>.
        </p>

        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-[#2B281F]">Verification Code</label>
            <input
              id="otp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isLoading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-sky-500 focus:border-sky-500"
              placeholder="Enter 6-digit code"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl cursor-pointer bg-black text-white text-lg font-semibold px-4 py-2 transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Verify & Login'}
          </button>
        </form>

        {error && (
          <p className="mt-4 p-3 rounded-md bg-red-50 text-sm text-red-700 border border-red-200">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 p-3 rounded-md bg-green-50 text-sm text-green-700 border border-green-200">
            {success}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">

      <GoogleLoginButton
        onClick={handleGoogleSignIn}
        isLoading={isGoogleLoading}
        text="Sign up with Google"
      />


      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
        </div>
      </div>


      <form onSubmit={handleSignupSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#2B281F]">Name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading || isGoogleLoading}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-sky-500 focus:border-sky-500"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#2B281F]">Email Address</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isGoogleLoading}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-sky-500 focus:border-sky-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#2B281F]">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm text-black focus:ring-sky-500 focus:border-sky-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl cursor-pointer bg-black text-white text-lg font-semibold px-4 py-2   transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
          </button>
        </div>
      </form>

      {success && (
        <p className="mt-4 p-3 rounded-md bg-green-50 text-sm text-green-700 border border-green-200">
          {success}
        </p>
      )}
      {error && (
        <p className="mt-4 p-3 rounded-md bg-red-50 text-sm text-red-700 border border-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
