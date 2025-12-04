'use client';

import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion, useInView, Variants } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const backgroundVariants: Variants = {
  hidden: {
    opacity: 0,
    clipPath: 'inset(10% 10% 10% 10%)',
  },
  visible: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: 1.0,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

export function FinalCta() {

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-150px' });
  const { status } = useSession();
  const router = useRouter();

  const handleStartSelling = () => {
    if (status == 'loading') return;

    if (status == 'authenticated') {
      router.push('/dashboard');
    }
    else {
      router.push('/signup')
    }
  }

  return (
    <section
      ref={ref}
      className="relative z-99 py-24 sm:py-32 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0 after:content-[''] after:absolute after:inset-0 after:bg-black after:opacity-20"
        variants={backgroundVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <Image
          src="/behindmockup.avif"
          alt="Abstract background shape"
          width={1600}
          height={900}
          className="w-full h-full object-cover select-none pointer-events-none"
          priority
        />
      </motion.div>

      {/* Content (remains on top) */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 lg:px-8">
        {/* Headline */}
        <h2 className="text-4xl sm:text-[2.5rem] font-extrabold tracking-tight text-white leading-tight">
          Join the next wave of creators
        </h2>

        {/* Subheading (Removed India-specific text) */}
        <p className="mt-4 text-base sm:text-lg font-medium text-white leading-relaxed max-w-2xl mx-auto">
          Turn your ideas into income. Sell your work, get paid instantly,
          and manage everything in one simple dashboard.
        </p>

        {/* CTA (Updated focus ring) */}
        <div className="mt-10 flex justify-center">
          <button onClick={handleStartSelling} className="inline-flex items-center gap-2 rounded-full cursor-pointer bg-black px-4 py-2 text-base sm:text-lg font-semibold tracking-tight text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-black">
            Start for Free <ArrowRight size={18} className="mt-px" />
          </button>
        </div>
      </div>
    </section>
  );
}