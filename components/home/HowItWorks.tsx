'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type StepType = {
  imageUrl: string;
  name: string;
  description: string;
};

const steps: StepType[] = [
  {
    imageUrl: '/next.svg',
    name: '1. Create Your Product',
    description:
      'Upload your digital product, set a price, and write a compelling description. It only takes a few minutes.',
  },
  {
    imageUrl: '/share_link.svg',
    name: '2. Share Your Link',
    description:
      'We generate a unique link for your product. Share it across social media, your blog, or directly with your audience.',
  },
  {
    imageUrl: '/pay_instantly.svg',
    name: '3. Get Paid Instantly',
    description:
      'Sales are processed securely via UPI, cards, and more. Your earnings are sent directly to your bank account.',
  },
];

const SectionTransitionDark = () => (
  <div className="relative w-full h-4 bg-[#efe7e4]">
    <div
      className="absolute inset-0 bg-[#0d0e10] transform skew-y-1 sm:skew-y-2 origin-bottom-left"
      style={{ height: '40px', bottom: '0px' }}
    />
  </div>
);

const StepperItem = ({
  step,
  index,
  isActive,
  setActive,
}: {
  step: StepType;
  index: number;
  isActive: boolean;
  setActive: (index: number) => void;
}) => {
  const borderColor = isActive
    ? 'border-[#948f89]'
    : 'border-[#dbdbdb] hover:border-[#948f89]';

  return (
    <div
      onClick={() => setActive(index)}
      className={`cursor-pointer border-l-4 p-4 pr-0 transition-all duration-300
        ${borderColor} ${isActive ? 'bg-[#ffffff] shadow-lg' : 'bg-[#ebebeb]'
        } rounded-lg`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center justify-center h-8 w-8 rounded-full font-extrabold text-lg shrink-0 transition-all duration-300 ${isActive
              ? 'bg-[#948f89] text-white'
              : 'bg-[#dbdbdb] text-[#2b281f]'
            }`}
        >
          {index + 1}
        </div>
        <h3 className="text-xl font-semibold leading-7 text-[#2b281f]">
          {step.name}
        </h3>
      </div>
      {isActive && (
        <p className="mt-4 text-base leading-7 text-[#585857] pl-12">
          {step.description}
        </p>
      )}
    </div>
  );
};

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex];

  return (
    <>
      <section className="pt-16 pb-24 sm:pt-24 sm:pb-32 bg-white bg-dot-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
            <p className="text-lg font-semibold leading-8 tracking-tight text-[#948f89]">
              The Process
            </p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-[#2b281f] sm:text-6xl">
              Start selling in{' '}
              three steps
            </h2>
            <p className="mt-6 text-xl leading-8 text-[#585857]">
              We handle the platform, payments, and complexity—so you can focus
              100% on your content.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="flex flex-col space-y-4">
              {steps.map((step, index) => (
                <StepperItem
                  key={index}
                  step={step}
                  index={index}
                  isActive={index === activeIndex}
                  setActive={setActiveIndex}
                />
              ))}
            </div>

            <div className="sticky top-8 rounded-xl p-8 bg-[#ffffff] shadow-xl ring-1 ring-[#dbdbdb] hidden lg:flex items-center justify-center h-full min-h-[400px]">
              <Image
                key={activeStep.imageUrl}
                src={activeStep.imageUrl}
                alt={activeStep.name}
                width={500}
                height={500}
                className="object-contain transition-opacity duration-700 ease-in-out"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionTransitionDark />
    </>
  );
}
