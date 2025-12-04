'use client';

import { Loader2 } from 'lucide-react';

export interface GoogleLoginButtonProps {
  onClick: () => Promise<void>;
  isLoading?: boolean;
  text?: string;
}

export function GoogleLoginButton({
  onClick,
  isLoading = false,
  text = 'Continue with Google',
}: GoogleLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center cursor-pointer justify-center gap-3 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 10.8v3.6h5.09c-.22 1.17-.92 2.16-1.96 2.83l3.16 2.45c1.85-1.71 2.91-4.23 2.91-7.28 0-.7-.06-1.37-.18-2H12z"
            />
            <path
              fill="#34A853"
              d="M6.56 14.33a5.96 5.96 0 0 1 0-4.66L3.28 7.05a9.48 9.48 0 0 0 0 9.9l3.28-2.62z"
            />
            <path
              fill="#FBBC05"
              d="M12 5.25c1.1 0 2.1.38 2.88 1.12l2.15-2.15A8.98 8.98 0 0 0 12 2.25a9.45 9.45 0 0 0-8.72 4.8l3.28 2.62A5.93 5.93 0 0 1 12 5.25z"
            />
            <path
              fill="#4285F4"
              d="M12 21.75c2.43 0 4.47-.8 5.96-2.17l-3.16-2.45c-.88.6-1.99.94-2.8.94a5.93 5.93 0 0 1-5.16-3.02l-3.28 2.62A9.45 9.45 0 0 0 12 21.75z"
            />
          </svg>
          <span>{text}</span>
        </>
      )}
    </button>
  );
}
