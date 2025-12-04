import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import QueryProvider from '@/components/queryProvider/QueryProvider';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';

const inter = localFont({
  src: [
    {
      path: './fonts/inter-v20-latin-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/inter-v20-latin-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/inter-v20-latin-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/inter-v20-latin-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/inter-v20-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/inter-v20-latin-800.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/inter-v20-latin-900.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Sell Digital Products in India | Templates, PDFs & Code Tools',
    template: '%s | GetVik',
  },
  description:
    'A trusted digital marketplace for creators. Sell Notion templates, eBooks, PDFs, scripts, and more. Secure checkout, instant delivery, low fees.',
  keywords: [
    'buy notion templates',
    'notion templates india',
    'buy ebooks online india',
    'digital pdf guides',
    'coding interview pdf',
    'nextjs starter kit',
    'tailwind components',
    'python automation scripts',
    'sell digital products india',
    'digital marketplace india',
  ],
  authors: [{ name: 'GetVik' }],
  creator: 'GetVik',
  publisher: 'GetVik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'http://localhost:3000',
    siteName: 'GetVik',
    title: 'GetVik - India\'s Digital Marketplace for Creators',
    description:
      'Discover and sell digital products on India\'s fastest-growing creator marketplace. Join thousands of creators, businesses, and freelancers building their digital empire.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GetVik - Digital Marketplace for Indian Creators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GetVik - India\'s Digital Marketplace for Creators',
    description:
      'Discover and sell digital products on India\'s fastest-growing creator marketplace.',
    images: ['/og-image.png'],
    creator: '@getvik',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  manifest: '/site.webmanifest',
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>

      </head>
      <body className={`font-sans antialiased bg-black text-white`}>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #2a2a2a',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}