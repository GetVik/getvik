import { Metadata } from 'next';

// Site configuration
export const siteConfig = {
  name: 'GetVik',
  description: 'A trusted digital marketplace for creators. Sell Notion templates, eBooks, PDFs, scripts, and more. Secure checkout, instant delivery, low fees.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://getvik.live',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/getvik',
  },
};

// Generate canonical URL
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}

// Generate Open Graph metadata
export function generateOGMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
}: {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: 'website' | 'article';
}): Metadata['openGraph'] {
  return {
    title,
    description,
    url,
    siteName: siteConfig.name,
    type,
    images: [
      {
        url: image || siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    locale: 'en_IN',
  };
}

// Generate Twitter Card metadata
export function generateTwitterMetadata({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}): Metadata['twitter'] {
  return {
    card: 'summary_large_image',
    title,
    description,
    images: [image || siteConfig.ogImage],
    creator: '@getvik',
  };
}

// Generate JSON-LD structured data for Organization
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/icon.svg`,
      width: 512,
      height: 512,
    },
    description: siteConfig.description,
    sameAs: [siteConfig.links.twitter],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      url: `${siteConfig.url}/contact`,
      email: 'support.getvik@gmail.com',
    },
  };
}

// Generate JSON-LD structured data for Product
export function generateProductSchema({
  name,
  description,
  image,
  price,
  currency = 'INR',
  availability = 'InStock',
  url,
  brand,
  ratingValue,
  reviewCount,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
  brand: string;
  ratingValue?: number;
  reviewCount?: number;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url,
    },
  };

  if (ratingValue && reviewCount && reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
}

// Generate JSON-LD structured data for ProfilePage
export function generateProfilePageSchema({
  name,
  url,
  image,
  description,
}: {
  name: string;
  url: string;
  image?: string;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name,
    url,
    image,
    description,
    mainEntity: {
      '@type': 'Person',
      name,
      image,
      description,
    },
  };
}

// Generate JSON-LD structured data for WebPage
export function generateWebPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Helper to inject JSON-LD script
export function generateJsonLd(data: object) {
  return {
    __html: JSON.stringify(data),
  };
}
