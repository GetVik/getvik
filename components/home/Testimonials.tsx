"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TestimonialCard } from "../ui/cards/home/TestimonialCard";

const testimonialData = [
  {
    quote: "Getting paid through UPI is effortless — and it happens within seconds.",
    name: "Amit S.",
    role: "Digital Artist",
  },
  {
    quote: "Selling digital products has never felt this smooth. The experience is seamless.",
    name: "Priya M.",
    role: "Author",
  },
  {
    quote: "UPI payments are fast and simple. I can focus on creating instead of worrying about payments.",
    name: "Rahul D.",
    role: "Freelancer",
  },
  {
    quote: "Uploading and sharing my tracks is straightforward — it just works.",
    name: "Meera K.",
    role: "Music Producer",
  },
];


export function Testimonials() {
  // State for the current card index in the carousel
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Effect to automatically advance the card
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) =>
        (prevIndex + 1) % testimonialData.length
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-20 bg-dot-pattern">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <h2 className="text-2xl font-bold tracking-tighter text-[#2B281F] lg:text-[2rem] sm:text-[2rem]">
            Loved by Creators
          </h2>
          <h2 className="text-2xl font-bold tracking-tighter text-[#999999] lg:text-[2rem] sm:text-[2rem]">
            Early adopters are earning fast.
          </h2>
        </div>

        {/* 1. Mobile Carousel (Only on xs screens, hidden from sm upwards) */}
        <div className="mx-auto max-w-lg p-1 overflow-hidden sm:hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentTestimonialIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <TestimonialCard
                quote={testimonialData[currentTestimonialIndex].quote}
                name={testimonialData[currentTestimonialIndex].name}
                role={testimonialData[currentTestimonialIndex].role}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tablet/Desktop Grid (Hidden on xs, visible from sm upwards) */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {testimonialData.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                    delay: index * 0.1
                  },
                },
              }}
              viewport={{ once: true, amount: 0.4 }}
              className="h-full"
            >
              <TestimonialCard
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}