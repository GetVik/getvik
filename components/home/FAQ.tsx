"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

const faqData = [
  {
    question: "What are the transaction fees?",
    answer:
      "We believe in transparent pricing. We charge a flat, transaction fee  on every successful sale. There are subscriptions is you choose to buy one monthly fees other than that no listing fees, or hidden charges. You only pay when you make money.",
  },
  {
    question: "How do I receive payments through UPI?",
    answer:
      "Your earnings are processed securely and sent directly to your linked bank accounts.\n\nYou simply provide:\n\n- **Bank Account** or **UPI ID**\n- Basic KYC details\n\nWe handle the rest automatically.",
  },
  {
    question: "What types of digital files can I sell?",
    answer:
      "- E-books (PDF, EPUB)\n- Templates (Figma, Notion, Excel)\n- Stock Photos & Videos\n- Audio Files & Music\n- Software Keys / Licenses\n- Courses & Tutorials\n\nPretty much **any digital downloadable file**.",
  },
  {
    question: "Is there a fee to join or list products?",
    answer:
      "**No. It is 100% free to join** and create up to 2 product listings.\n\nYou only pay our platform fee based on the plan you have.",
  },
  {
    question: "Do you handle the delivery of the files?",
    answer:
      "Yes — 100% automated.\n\nCustomers receive a **secure download link** instantly after purchase.\n\nNo manual work needed.",
  },
];

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-4 border-b border-gray-200 last:border-b">
      <button
        className="flex justify-between items-start w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold tracking-tighter text-[#2b281f] pr-4">
          {question}
        </span>
        <span className="p-1 rounded-full text-[#643446] bg-pink-50 transition-transform duration-300 shrink-0">
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="text-[15px] font-medium tracking-tighter leading-relaxed text-[#585857]
                 prose prose-p:m-0 prose-li:m-0 prose-ul:list-disc prose-ul:pl-4 pt-4"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {answer}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function FAQ() {
  return (
    <section className="py-12 sm:py-12 bg-gray-50 bg-dot-pattern">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-6 mt-10 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter text-[#2B281F] lg:text-[2rem] sm:text-[2rem]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-5xl mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl ring-1 ring-gray-100/70">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-[15px] font-bold tracking-tighter text-[#585857]">
            Still can&apos;t find what you&apos;re looking for?
          </p>
          <Link href="/contact" className="mt-4 inline-flex items-center gap-2 rounded-full cursor-pointer bg-black px-4 py-2 text-base font-bold tracking-tighter text-white shadow-lg transition-transform duration-200 hover:scale-[1.03] hover:bg-gray-800">
            Contact Our Support Team <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
