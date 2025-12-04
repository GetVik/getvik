"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();


  useEffect(() => {
    // Redirect if not authenticated or not a creator
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'Creator') {
      router.push('/');
    }
  }, [status, session, router]);

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  // Show loading while redirecting
  if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'Creator')) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <main className="h-screen w-full bg-[#0D0D0D] font-sans text-white flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:block md:w-24">
        <Sidebar />
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden pb-16 md:pb-0">
        <Header />
        <div className="flex-1 overflow-auto p-6 md:p-8">{children}</div>
      </div>

      {/* Mobile bottom nav (client component) */}
      <MobileBottomNav />
    </main>
  );
}
