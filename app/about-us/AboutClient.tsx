'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/home/Navbar';
import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Store, 
  ShoppingBag, 
  ArrowRight,
  CheckCircle2,
  IndianRupee // Imported for the new badge
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  return (
    <div className="bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans">
      <Navbar />

      {/* HERO SECTION WITH DOT PATTERN & IMAGE SPLIT */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-white">
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 text-balance"
              >
                The marketplace for India&apos;s digital creators.
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-lg text-zinc-600 max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance"
              >
                GetVik makes it simple to sell Notion templates, PDFs, and coding tools. Secure checkout, instant delivery, and payments directly to your bank in INR.
              </motion.p>
            </motion.div>

            {/* Hero Image Asset */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-zinc-200/50 border border-zinc-100 perspective-1000"
            >
               {/* Existing subtle overlay */}
               <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 via-white to-zinc-50 opacity-80 mix-blend-overlay z-10"></div>
               
               {/* --- NEW ELEMENT: Floating Payment Badge --- */}
               <motion.div 
                 initial={{ opacity: 0, y: 20, x: 20 }}
                 animate={{ opacity: 1, y: 0, x: 0 }}
                 transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                 className="absolute bottom-8 right-8 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center gap-4"
               >
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm">
                    <IndianRupee size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Instant Payout</p>
                    <p className="text-xl font-bold text-zinc-900">₹12,450.00</p>
                  </div>
               </motion.div>
               {/* ------------------------------------------- */}

               <Image 
               src="/behindmockup.avif"
                  alt="Digital creation abstract"
                  fill
                  className="object-cover"
                  priority
               />
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION WITH IMAGE */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
             {/* Image Anchor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg group"
            >
                 {/* --- NEW ELEMENTS: Gradient Overlay & Icon Badge --- */}
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/30 via-transparent to-transparent z-10 pointer-events-none transition-opacity group-hover:opacity-70"></div>
                 
                 <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white/70">
                    <Heart size={28} className="text-red-500 fill-red-100" />
                 </div>
                 {/* -------------------------------------------------- */}

                 <Image 
                   src="/behindmockup.avif"
                   alt="Creator working at desk"
                   fill
                   className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
               />
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Our Mission</h2>
                <div className="space-y-4 text-zinc-600 leading-relaxed">
                  <p>
                    We&apos;re building the simplest way for Indian creators to earn from their work online. No complex setup, no international hoops—just a clean platform where you set a price in INR and get paid.
                  </p>
                </div>
              </div>
              
              <div className="pl-6 border-l-2 border-zinc-200">
                <h3 className="text-xl font-semibold mb-2">Why GetVik?</h3>
                <p className="text-zinc-600">
                  Most tools are priced in dollars and built for other markets. We felt the gap: high fees and complicated payouts. GetVik is our answer—a modern marketplace that respects the Indian context.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CREATOR/BUYER CARDS - (Unchanged from previous version) */}
      <section className="py-24 bg-zinc-50/80 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Built for the Ecosystem
            </h2>
            <p className="mt-4 text-zinc-600 text-lg">Connecting creators and buyers seamlessly.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Creator Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 lg:p-10 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              {/* Subtle background graphic for depth */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 text-zinc-50 opacity-50 group-hover:text-zinc-100 transition-colors">
                 <Store size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-zinc-900/20">
                    <Store size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Creators</h3>
                <p className="text-zinc-600 mb-8 leading-relaxed">
                  A ready-to-use storefront with file hosting, tax handling, and delivery automation handled for you.
                </p>
                <ul className="space-y-4">
                  {[
                    'Sell Notion templates, PDFs, & code',
                    'Price in INR, accept UPI & Cards',
                    'Instant digital delivery',
                    'Transparent earnings dashboard'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-700 font-medium">
                      <CheckCircle2 size={20} className="text-zinc-900 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Buyer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 lg:p-10 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 -mt-10 -mr-10 text-zinc-50 opacity-50 group-hover:text-zinc-100 transition-colors">
                 <ShoppingBag size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-6 text-zinc-900">
                    <ShoppingBag size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Buyers</h3>
                <p className="text-zinc-600 mb-8 leading-relaxed">
                  A familiar, safe checkout experience with instant access to your purchases.
                </p>
                <ul className="space-y-4">
                  {[
                    'Secure checkout via trusted providers',
                    'Instant access to files',
                    'Clear product details before buying',
                    'Support for all Indian payment methods'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-700 font-medium">
                      <CheckCircle2 size={20} className="text-zinc-900 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION WITH DOT PATTERN - (Unchanged) */}
      <section className="py-24 relative bg-white overflow-hidden">
        {/* Background Dot Pattern (Light) */}
        <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">What We Stand For</h2>
            <p className="text-zinc-600 text-lg">Our core principles guide every decision we make.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Trust by Design',
                desc: 'From payments to file delivery, we focus on predictable, transparent behavior—no surprises.',
              },
              {
                icon: Heart,
                title: 'Creator-First',
                desc: 'We build for the people who ship templates, tools, and knowledge—not for ads or algorithms.',
              },
              {
                icon: Zap,
                title: 'Simple, Not Basic',
                desc: 'Clean UX, fast load times, and no unnecessary friction—just the tools you need to sell well.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="mb-5 text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION WITH DARK DOT PATTERN - (Unchanged) */}
      <section className="py-28 relative bg-zinc-900 text-white text-center px-6 overflow-hidden">
         {/* Background Dot Pattern (Dark Mode Inverted) */}
         <div className="absolute inset-0 z-0 h-full w-full opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-balance">
            Start selling your digital products today.
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed text-balance">
            List your first Notion template, PDF, or tool in minutes. Ship fast and get paid in INR.
          </p>
          <Link
            href="/onboarding"
            className="group inline-flex items-center gap-2 bg-white text-zinc-900 font-bold px-8 py-4 rounded-full hover:bg-zinc-100 hover:scale-105 transition-all duration-200 shadow-xl shadow-white/10"
          >
            Create Seller Account
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}