'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavbarAuthSection } from './NavbarAuthSection';
import { MobileAuthSection } from './MobileAuthSection';


const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.25 87.75V20.25H47.25V87.75H20.25Z" fill="currentColor" />
    <path d="M54 20.25L87.75 87.75H54V20.25Z" fill="currentColor" />
  </svg>
);

const NavLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <Link
      href={href}
      className="group relative py-1 text-sm font-medium text-gray-500 transition-colors duration-300 hover:text-black"
    >
      {label}
      {/* Animated Underline */}
      <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-black transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
};



const navLinks = [
  { href: '/discover', label: 'Discover' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about-us', label: 'About' },
  { href: '/blog', label: 'Blogs' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `sticky top-0 z-50 w-full border-b transition-all duration-300 ${isOpen || isScrolled
    ? "border-gray-200 bg-white/90 backdrop-blur-md shadow-sm"
    : "border-transparent bg-white/50 backdrop-blur-sm"
    }`;

  return (
    <header className={headerClasses}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between">

          {/* Left: Logo & Stars */}
          <div className="flex items-center w-1/3">
            <Link href="/" aria-label="Homepage" className="text-black">
              <Logo />
            </Link>
            <Link href="/" aria-label="Homepage">
              <h2 className="text-xl font-semibold tracking-tight text-black">GetVik</h2>
            </Link>
          </div>

          {/* Center: Nav links */}
          <nav className="hidden md:flex items-center justify-center gap-8 w-1/3">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4 w-1/3">

            <div className="hidden md:block">
              <NavbarAuthSection />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-6">

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-gray-100 pt-6 space-y-6">
                <MobileAuthSection onLinkClick={() => setIsOpen(false)} />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}