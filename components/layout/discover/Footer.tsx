"use client";

import { Instagram, Linkedin, X } from "lucide-react";
import { Footer as SharedFooter, FooterNavigation } from "@/components/layout/Footer";

const navigation: FooterNavigation = {
  products: [
    { name: "Pricing", href: "#pricing" },
    { name: "Features", href: "#features" },
    // { name: "How It Works", href: "#how-it-works" },
  ],
  company: [
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "GST & Taxes", href: "/gst-taxes" },
  ],
  social: [
    { name: "Instagram", href: "https://www.instagram.com/getvik.live?igsh=MXdjdGRiaWhndjhudw==", icon: Instagram },
    { name: "X", href: "https://x.com/getviklive?t=wxz5izZdmTLOul5xg-BInA&s=09", icon: X },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/getvik", icon: Linkedin },
  ],
};

export function Footer() {
  return <SharedFooter variant="dark" navigation={navigation} />;
}