import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import DiscoverPageContent from './DiscoverPageContent'; 
import { generateDiscoverMetadata } from '@/lib/metadata';

export const metadata = generateDiscoverMetadata();
 

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        // This is the loading UI shown during prerendering
        <div className="bg-[#0D0D0D] min-h-screen w-full flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        </div>
      }
    >
      {/* This component will be loaded ONLY on the client */}
      <DiscoverPageContent />
    </Suspense>
  );
}