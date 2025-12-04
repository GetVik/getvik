import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },

      {
        protocol: 'https',
        hostname: 'rgmuoepsgctvaqsbostf.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-cc1e727d459148a28c83abd272e76bb9.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'api.producthunt.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },

  async headers() {
    const csp = [
      "default-src 'self'",
      // ⬇️ allow Cashfree SDK + checkout (you can drop Razorpay if fully removed)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.cashfree.com https://checkout.cashfree.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: http:",
      // ⬇️ allow Cashfree network calls from browser (SDK)
      "connect-src 'self' https://*.supabase.co https://*.googleapis.com https://api.cashfree.com https://sandbox.cashfree.com https://*.r2.cloudflarestorage.com https://*.r2.dev https://pub-cc1e727d459148a28c83abd272e76bb9.r2.dev",
      // ⬇️ allow Cashfree iframes/redirects
      "frame-src https://cashfree.com https://*.cashfree.com",
      "font-src 'self' data:",
      "media-src 'self' https://*.r2.dev https://pub-cc1e727d459148a28c83abd272e76bb9.r2.dev",
      "object-src 'none'",
      "base-uri 'self'",
      // ⬇️ allow posting forms to Cashfree
      "form-action 'self' https://cashfree.com https://*.cashfree.com",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
