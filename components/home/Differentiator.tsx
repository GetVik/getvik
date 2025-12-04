'use client';

import { Zap, Globe, CheckCircle, IndianRupee } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, Variants } from 'framer-motion';

const backgroundVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.0, ease: [0.42, 0, 0.58, 1] },
  },
};

// Scaling Hook
const useScale = (baseWidth = 1180) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const newScale = Math.min(window.innerWidth / baseWidth, 1);
      setScale(newScale);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [baseWidth]);

  return scale;
};

const taglineData = [
  {
    title: 'Instant Digital Delivery',
    description:
      'Your customers get their files immediately after purchase. Secure, automated, and hassle-free delivery.',
    icon: <Zap size={18} className="text-white" />,
  },
  {
    title: 'UPI Payments & INR Support',
    description:
      'Built for India. Accept payments via UPI, Cards, and Netbanking with seamless INR settlement to your bank.',
    icon: <IndianRupee size={18} className="text-white" />,
  },
  {
    title: 'Low Transaction Fees',
    description:
      'Keep more of what you earn. Simple, transparent pricing with no hidden charges or monthly subscriptions.',
    icon: <CheckCircle size={18} className="text-white" />,
  },
  {
    title: 'No Website Required',
    description:
      'Start selling in minutes. You don\'t need a website or technical skills—just upload your product and share the link.',
    icon: <Globe size={18} className="text-white" />,
  },
];

const FeatureListItem = ({ data }: { data: (typeof taglineData)[0] }) => (
  <div className="flex items-start gap-4 p-4 hover:bg-gray-50/50 rounded-lg transition-colors duration-200 cursor-pointer">
    <div className="shrink-0 p-2 rounded-full bg-linear-to-br from-gray-800 to-gray-600">
      {data.icon}
    </div>
    <div>
      <h3 className="text-base font-bold tracking-tighter text-[#2B281F]">
        {data.title}
      </h3>
      <p className="mt-1 text-sm tracking-tight text-[#999999]">
        {data.description}
      </p>
    </div>
  </div>
);

export function Differentiator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const scale = useScale(1180); // base design width

  return (
    <section
      ref={ref}
      id="features"
      style={{
        height: `${scale * 800}px`,
        transition: "height .3s ease",
      }}
      className="bg-gray-50/50 py-10 lg:py-20 overflow-hidden bg-dot-pattern flex justify-center items-start"
    >
      {/* SCALE WRAPPER */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.25s ease-out',
        }}
        className="overflow-visible"
      >
        {/* FIXED WIDTH INTERNAL CANVAS */}
        <div className="relative w-[1180px] mx-auto">
          {/* Background Animation */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={backgroundVariants}
            className="absolute z-0 select-none pointer-events-none"
            style={{
              bottom: '-7%',
              left: '6%',
              width: '120%',
              maxWidth: 'none',
            }}
          >
            <Image
              src="/bg-differentiator.avif"
              alt="Abstract background gradient"
              width={1000}
              height={900}
              className="object-cover"
            />
          </motion.div>

          {/* Main Card */}
          <div className="relative z-10 bg-white max-w-4xl mx-auto rounded-3xl shadow-2xl ring-1 ring-gray-100 overflow-hidden">
            <div className="grid grid-cols-2">
              {/* Left List */}
              <motion.div
                className="p-12 space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
              >
                {taglineData.map((data, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } }
                    }}
                  >
                    <FeatureListItem data={data} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Right Highlight Section */}
              <div className="relative bg-gray-100 min-h-80 flex items-center justify-center p-6 overflow-hidden rounded-r-3xl">
                <div className="flex flex-col items-center text-center text-[#2B281F]/80 p-4">
                  <p className="text-sm font-bold tracking-tight uppercase">
                    Focus On Your Craft
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight">
                    We Handle the Complexity.
                  </h3>
                  <p className="mt-3 text-sm text-[#666666] max-w-xs">
                    Designed to sit cleanly inside your dashboard view on any device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 