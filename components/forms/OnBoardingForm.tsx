'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { onboardCreator } from '@/services/creator.service';

import slugify from 'slugify';
import { motion } from 'framer-motion';
import { Loader2, Info } from 'lucide-react';

export function OnboardingForm() {
  const { data: session, update } = useSession();
  const [storeName, setStoreName] = useState('');
  const [desiredSlug, setDesiredSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<'storeName' | 'desiredSlug' | null>(null);
  const router = useRouter();

  const generateSlugPreview = () => {
    const slug = desiredSlug || storeName;
    return slugify(slug, { lower: true, strict: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardCreator({
        storeName,
        desiredSlug: desiredSlug || undefined,
      });

      const newBackendToken = response.token;
      const newStoreSlug = response.storeSlug;

      await update({
        ...session,
        role: 'Creator',
        backendToken: newBackendToken,
        user: {
          ...session?.user,
          storeSlug: newStoreSlug,
        }
      });

      router.push('/dashboard/products');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md rounded-2xl bg-[#1a1a1a]/70 backdrop-blur-md border border-white/10 p-8 shadow-2xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white bg-clip-text">
          Become a Creator
        </h2>
        <p className="mt-2 text-gray-400">
          Choose a name and custom link for your store.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="storeName"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Store Name
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            onFocus={() => setFocusedField('storeName')}
            onBlur={() => setFocusedField(null)}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 p-3 focus:outline-none focus:ring-1   focus:ring-white focus:border-transparent"
            placeholder="e.g., My Store"
          />
          {focusedField === 'storeName' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-start gap-2 text-xs text-gray-400/80 overflow-hidden"
            >
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <p>Must be at least 2 characters long.</p>
            </motion.div>
          )}
        </div>

        <div>
          <label
            htmlFor="desiredSlug"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Custom Store Link (Optional)
          </label>
          <div className="flex overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <span className="inline-flex items-center px-3 text-sm text-gray-400 bg-white/5 border-r border-white/10">
              getvik.live/store/
            </span>
            <input
              id="desiredSlug"
              type="text"
              value={desiredSlug}
              onChange={(e) => setDesiredSlug(e.target.value)}
              onFocus={() => setFocusedField('desiredSlug')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 p-3 focus:outline-none focus:border-transparent"
              placeholder="your-custom-link"
            />
          </div>
          {focusedField === 'desiredSlug' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-start gap-2 text-xs text-gray-400/80 overflow-hidden"
            >
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <p>Min 3 chars. Lowercase letters, numbers, hyphens only.</p>
            </motion.div>
          )}

          {(storeName || desiredSlug) && (
            <p className="mt-1 text-xs text-gray-500">
              Your store link will be:{' '}
              <span className="text-gray-300">
                getvik.live/store/{generateSlugPreview()}
              </span>
            </p>
          )}
        </div>

        {error && (
          <motion.p
            className="text-red-400 text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <div className="pt-3 flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !storeName}
            className="group relative inline-flex items-center justify-center rounded-full cursor-pointer bg-black px-6 py-2.5 font-semibold text-white transition-all hover:scale-[1.03] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              <>
                <span>Create my store</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}