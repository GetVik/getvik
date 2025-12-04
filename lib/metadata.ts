import { Metadata } from 'next';
import {
  siteConfig,
  getCanonicalUrl,
  generateOGMetadata,
  generateTwitterMetadata,
} from './seo';

// Base metadata that all pages inherit
export function generateBaseMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
  const canonicalUrl = getCanonicalUrl(path);

  const metadata: Metadata = {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: generateOGMetadata({
      title: fullTitle,
      description,
      image,
      url: canonicalUrl,
    }),
    twitter: generateTwitterMetadata({
      title: fullTitle,
      description,
      image,
    }),
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

// Homepage metadata
export function generateHomeMetadata(): Metadata {
  return generateBaseMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: '/',
  });
}

// About page metadata
export function generateAboutMetadata(): Metadata {
  return generateBaseMetadata({
    title: 'About Us',
    description:
      'Learn about getvik - empowering local creators, businesses, and freelancers across India through our innovative digital platform.',
    path: '/about-us',
  });
}

// Contact page metadata
export function generateContactMetadata(): Metadata {
  return generateBaseMetadata({
    title: 'Contact Us',
    description:
      'Get in touch with getvik. We\'re here to help creators and customers with any questions or support needs.',
    path: '/contact',
  });
}

// Privacy Policy metadata
export function generatePrivacyMetadata(): Metadata {
  return generateBaseMetadata({
    title: 'Privacy Policy',
    description:
      'Read our privacy policy to understand how getvik collects, uses, and protects your personal information.',
    path: '/privacy-policy',
  });
}

// Terms of Service metadata
export function generateTermsMetadata(): Metadata {
  return generateBaseMetadata({
    title: 'Terms of Service',
    description:
      'Review the terms and conditions for using getvik platform and services.',
    path: '/terms-of-service',
  });
}

// GST/Taxes page metadata
export function generateGSTMetadata(): Metadata {
  return generateBaseMetadata({
    title: 'GST & Taxes',
    description:
      'Understand GST and tax implications for buying and selling on getvik.',
    path: '/gst-taxes',
  });
}

// Discover page metadata
export function generateDiscoverMetadata(): Metadata {
  return generateBaseMetadata({
    title: 'Discover Products',
    description:
      'Explore thousands of digital products, templates, courses, and resources from talented Indian creators on getvik.',
    path: '/discover',
  });
}

// Blog page metadata
export function generateBlogMetadata(): Metadata {
  return generateBaseMetadata({
    title: 'Blog - GetVik',
    description: 'Insights, guides, and stories for digital creators in India.',
    path: '/blog',
  });
}

// Auth pages metadata (no-index)
export function generateAuthMetadata(pageName: string): Metadata {
  const paths: Record<string, string> = {
    signin: '/signin',
    signup: '/signup',
    'forgot-password': '/forgot-password',
    'reset-password': '/reset-password',
    'verify-email': '/verify-email',
    onboarding: '/onboarding',
  };

  return generateBaseMetadata({
    title: pageName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    description: `${pageName} page for getvik`,
    path: paths[pageName] || `/${pageName}`,
    noIndex: true,
  });
}

// Dashboard metadata (no-index)
export function generateDashboardMetadata(pageName?: string): Metadata {
  const title = pageName ? `${pageName} - Dashboard` : 'Dashboard';
  return generateBaseMetadata({
    title,
    description: 'Manage your getvik account, products, and sales.',
    path: pageName ? `/dashboard/${pageName}` : '/dashboard',
    noIndex: true,
  });
}
