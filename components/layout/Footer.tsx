"use client";

import Link from "next/link";
import React from "react";

export type FooterLink = { name: string; href: string };
export type SocialLink = { name: string; href: string; icon: React.ElementType };

export type FooterNavigation = {
  products: FooterLink[];
  company: FooterLink[];
  legal: FooterLink[];
  social: SocialLink[];
};

export function Footer({
  variant = "light",
  navigation,
  supportBlurb = "Need help? Reach out to our support team for quick assistance.",
}: {
  variant?: "light" | "dark";
  navigation: FooterNavigation;
  supportBlurb?: string;
}) {
  const isDark = variant === "dark";

  const containerBg = isDark ? "bg-[#242423]" : "bg-white";
  const borderColor = isDark ? "border-gray-200/20" : "border-gray-200";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-white" : "text-gray-600";
  const hoverColor = isDark ? "hover:text-gray-300" : "hover:text-gray-900";
  const socialColor = isDark ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-800";
  const logoClass = isDark ? "text-white" : "text-black";

  const Logo = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 108 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={logoClass}
    >
      <path d="M20.25 87.75V20.25H47.25V87.75H20.25Z" fill="currentColor" />
      <path d="M54 20.25L87.75 87.75H54V20.25Z" fill="currentColor" />
    </svg>
  );

  return (
    <footer className={containerBg}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${headingColor}`}>Company</h3>
            <ul className="mt-4 space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={`text-[15px] ${textColor} ${hoverColor} transition-colors duration-150`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${headingColor}`}>Product</h3>
            <ul className="mt-4 space-y-3">
              {navigation.products.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={`text-[15px] ${textColor} ${hoverColor} transition-colors duration-150`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${headingColor}`}>Legal</h3>
            <ul className="mt-4 space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={`text-[15px] ${textColor} ${hoverColor} transition-colors duration-150`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${headingColor}`}>Support</h3>
            <p className={`mt-4 text-[15px] leading-relaxed ${textColor}`}>{supportBlurb}</p>
          </div>
        </div>

        <div className={`mt-12 border-t ${borderColor}`} />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <Link href="/" aria-label="Homepage" className="flex items-center">
              <Logo />
            </Link>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              &copy; {new Date().getFullYear()} GetVik.                                  All rights reserved.
            </p>
          </div>

          <div className="flex space-x-5">
            {navigation.social.map(({ name, href, icon: Icon }) => (
              <a key={name} href={href} aria-label={name} className={`${socialColor} transition-colors duration-200`}>
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
