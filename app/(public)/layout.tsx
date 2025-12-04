import { Navbar } from '@/components/layout/discover/NavbarSearch';
import { Footer } from '@/components/layout/discover/Footer';
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// A simple loading fallback for the navbar to prevent layout shift
const NavbarLoader = () => (
  <nav className="border-b border-white/10 bg-[#0D0D0D]">
    <div className="container mx-auto max-w-7xl px-4 py-4 h-[81px] flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  </nav>
);

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Wrap the component that uses the hook in Suspense */}
      <Suspense fallback={<NavbarLoader />}>
        <Navbar />
      </Suspense>

      <main className="flex-1">
        {/* Your discover/page.tsx <Suspense> boundary is STILL needed 
          for the DiscoverPageContent component. This is correct.
        */}
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
