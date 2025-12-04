'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ShoppingBag } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

import { NavbarAuthSection } from '@/components/layout/home/NavbarAuthSection';

const Logo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 108 108"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.25 87.75V20.25H47.25V87.75H20.25Z" fill="white" />
    <path d="M54 20.25L87.75 87.75H54V20.25Z" fill="white" />
  </svg>
);

// This is the new Search Bar component 
function NavbarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/discover?search=${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-full border border-gray-700 bg-[#242423] p-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:border-[#643446] focus:ring-1 focus:ring-[#643446] focus:outline-none"
      />
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
    </form>
  );
}

// function StartSellingButton() {
//   const { status } = useSession();

//   if (status === 'loading') {
//     return (
//       <div className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-black shadow-lg flex items-center justify-center w-[116px] h-9">
//         <Loader2 className="animate-spin" size={16} />
//       </div>
//     );
//   }

//   const href = status === 'authenticated' ? '/dashboard' : '/signin';

//   return (
//     <Link
//       href={href}
//       className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-200"
//     >
//       Start Selling
//     </Link>
//   );
// }

function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-400 hover:text-white transition-colors"
      aria-label="Cart"
    >
      <ShoppingBag size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-[#0D0D0D] ">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex justify-between items-center gap-6">
          <div className="flex items-center w-1/3">
            <Link href="/" aria-label="Homepage">
              <Logo />
            </Link>
            <Link href="/" aria-label="Homepage">
              <h2 className="text-xl font-semibold tracking-tight text-white">GetVik</h2>
            </Link>
          </div>

          {/* **CHANGE**: Added 'hidden md:block' to this wrapper */}
          <div className="flex-1 hidden md:block">
            <NavbarSearch />
          </div>

          <div className="flex gap-4 items-center">
            <CartButton />
            <NavbarAuthSection />
            {/* <StartSellingButton /> */}
          </div>
        </div>

        {/* **CHANGE**: Wrapper is now 'block md:hidden' */}
        <div className="mt-4 block md:hidden">
          <NavbarSearch />
        </div>
      </div>
    </nav>
  );
}