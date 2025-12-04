import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://getvik.live';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/*',
          '/api/*',
          '/signin',
          '/signup',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/onboarding',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
