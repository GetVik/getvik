'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { NavbarAuthSection } from './NavbarAuthSection';
import { MobileAuthSection } from './MobileAuthSection';
import { motion, AnimatePresence } from 'framer-motion';

const Logo = () => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 108 108"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.25 87.75V20.25H47.25V87.75H20.25Z" fill="black" />
    <path d="M54 20.25L87.75 87.75H54V20.25Z" fill="black" />
  </svg>
);

const navLinks = [
  { href: '/discover', label: 'Discover' },
  { href: '/pricing', label: 'Pricing' },
  // { href: '/contact', label: 'Support' },
  { href: '/about-us', label: 'About' },
  { href: '/blog', label: 'Blogs' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ─── Desktop Layout ─────────────────────────────────── */}
        <div className="hidden w-full md:flex h-16 items-center justify-between">

          {/* Left: Logo */}
          <div className="flex items-center w-1/3">
            <Link href="/" aria-label="Homepage">
              <Logo />
            </Link>
            <Link href="/" aria-label="Homepage" className="group h-7 overflow-hidden block">
              <div className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-7">
                <h2 className="text-xl font-semibold tracking-tight text-black h-7 flex items-center">GetVik</h2>
                <h2 className="text-xl font-semibold tracking-tight text-black h-7 flex items-center">GetVik</h2>
              </div>
            </Link>
          </div>

          {/* Center: Nav links */}
          <nav className="flex items-center justify-center gap-8 w-1/3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group h-5 overflow-hidden block text-sm font-medium"
              >
                <div className="flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-5">
                  <span className="text-[#999696] h-5 flex items-center transition-colors duration-300 group-hover:text-black">
                    {link.label}
                  </span>
                  <span className="text-black h-5 flex items-center">
                    {link.label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Right: Auth / Dashboard */}
          <div className="flex items-center justify-end gap-3 w-1/3">

            <NavbarAuthSection />
          </div>
        </div>

        {/* ─── Mobile Layout ───────────────────────────────────── */}
        <div className="flex h-16 items-center justify-between md:hidden">
          <Link href="/" aria-label="Homepage" className="flex items-center gap-2">
            <Logo />
            <h2 className="text-xl font-semibold tracking-tight text-black">GetVik</h2>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="p-2 text-gray-700 hover:text-black"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Drawer Menu ───────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden border-t border-gray-200 overflow-hidden"
          >
            <div className="space-y-1 px-4 pt-4 pb-6">
              <nav className="flex flex-col space-y-3 mb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-[#2B281F] hover:bg-gray-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-gray-100 pt-4">
                <MobileAuthSection onLinkClick={() => setIsOpen(false)} />

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
