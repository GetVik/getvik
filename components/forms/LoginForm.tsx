'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { fetchUserProfile } from '@/services/settings.service';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      if (result.error === 'NOT_VERIFIED' || result.error === 'Please verify your email before logging in.') {
        // Redirect to verify-email page
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        setError('Login failed. Please check your credentials.');
      }
      setIsLoading(false);
    } else {
      // Get fresh user profile to check role
      try {
        const userData = await fetchUserProfile();
        console.log("Login successful. User data:", userData);
        if (userData.user.role === 'User') {
          console.log("Redirecting to /profile");
          router.push('/profile');
        } else {
          console.log("Redirecting to /dashboard");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Failed to fetch profile for redirect:", error);
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="w-full">
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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-brand-dark">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-black focus:border-black transition sm:text-sm"
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

        <div className="flex items-center justify-end">
          <a href="/forgot-password" className="text-sm font-medium text-brand-dark hover:text-gray-700">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center rounded-full cursor-pointer bg-black px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
        </button>
      </form>

      {error && (
        <p className="mt-4 p-3 rounded-md bg-red-50 text-sm text-red-700 border border-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
