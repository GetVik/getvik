'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// We create the client inside the component
// so that it's only created once per user session
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // This is a good default:
        // Data will be considered "stale" after 5 minutes.
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new client
    return makeQueryClient();
  } else {
    // Browser: use singleton pattern
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get a QueryClient
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}