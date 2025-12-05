"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo, LinkIcon, UpiIcon, UploadIcon } from "../ui/icons/icons";
import { FeatureCard } from "../ui/cards/home/HeroFeatureCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 50,
      damping: 20,
    },
  },
};

const cardData = [
  {
    title: "Easy uploading.",
    description:
      "Quickly upload PDFs, audio, design files, and more from your dashboard.",
    icon: <UploadIcon />,
    imageUrl: "/bgAIsection.avif",
  },
  {
    title: "Share links.",
    description:
      "Get instant, secure product links to share with your audience anywhere.",
    icon: <LinkIcon />,
    imageUrl: "/bgAIsection.avif",
  },
  {
    title: "Fast UPI payouts.",
    description:
      "Request payouts anytime (₹100 min) and receive funds in 5-7 days via UPI or bank.",
    icon: <UpiIcon />,
    imageUrl: "/bgAIsection.avif",
  },
];



export function Hero() {
  const { status } = useSession();
  const router = useRouter();

  const handleStartSelling = () => {
    if (status === "loading") return;

    if (status === "authenticated") {
      router.push("/onboarding");
    } else {
      router.push("/signup");
    }
  };

  // State for the current card index in the carousel
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Effect to automatically advance the card
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cardData.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white bg-dot-pattern pt-20 sm:pt-30 md:pt-30 lg:pt-40">
      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex max-w-4xl flex-col items-center text-center mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Link href="/" aria-label="Homepage" className="mb-9">
              <Logo />
            </Link>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl font-bold tracking-tighter text-[#2B281F] lg:text-[2.5rem] mt-1  sm:text-[2.5rem]"
          >
            Empower Your Creativity.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-2xl font-bold tracking-tighter text-[#999999] lg:text-[3rem] sm:text-[2.5rem]"
          >
            Sell digital products Instantly.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center justify-center gap-x-4"
          >
            <button
              onClick={handleStartSelling}
              disabled={status === "loading"}
              className="rounded-full cursor-pointer bg-black lg:px-3 py-1 px-3 lg:py-1 lg:text-base text-sm font-bold tracking-tighter text-white shadow-lg transition-transform duration-200 hover:scale-105 disabled:bg-gray-500"
            >
              Start selling
            </button>
            <Link href="/discover" className="rounded-full cursor-pointer bg-gray-100 px-3 py-1 text-sm lg:text-base font-bold tracking-tighter text-black shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-200">
              Browse marketplace
            </Link>
          </motion.div>

          {/* ---Feature Cards Section for Mobile Carousel --- */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-20 w-full sm:mt-32 relative"
          >
            {/* Mobile Carousel (Visible up to lg) */}
            <div className="w-full max-w-lg mx-auto overflow-hidden lg:hidden">
              <AnimatePresence initial={false} mode="wait">
                {" "}
                {/* 'wait' mode ensures one exits before next enters */}
                <motion.div
                  key={currentCardIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <FeatureCard
                    title={cardData[currentCardIndex].title}
                    description={cardData[currentCardIndex].description}
                    icon={cardData[currentCardIndex].icon}
                    imageUrl={cardData[currentCardIndex].imageUrl}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Grid (Hidden until lg) */}
            <div
              className="
                hidden
                lg:grid lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16
              "
            >
              {cardData.map((card) => (
                <FeatureCard
                  key={card.title}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  imageUrl={card.imageUrl}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-30 mb-10 flex flex-col items-start self-start text-start"
          >
            <h3 className="text-[16px] font-bold tracking-tighter text-[#2B281F]">
              What is GetVik and why trust it?
            </h3>
            <p className="mt-5 mb-19 max-w-lg text-[15px] font-bold tracking-tighter text-[#999999]">
              GetVik is your all-in-one platform for selling digital products.
              We handle secure file delivery, instant payouts, and
              creator-focused support, so you can focus on what you do
              best—creating. Build your business on a platform designed for
              simplicity, speed, and reliability.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
