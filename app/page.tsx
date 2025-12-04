import { FinalCta } from "@/components/home/CTA";
import { Differentiator } from "@/components/home/Differentiator";
import { FAQ } from "@/components/home/FAQ";
import { Hero } from "@/components/home/Hero";
import { PricingSection } from "@/components/home/Pricing";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/home/Footer";
import { Navbar } from "@/components/layout/home/Navbar";
import { Metadata } from "next";
import { generateHomeMetadata } from "@/lib/metadata";
import { generateOrganizationSchema, generateJsonLd } from "@/lib/seo";

export const metadata: Metadata = generateHomeMetadata();

export default function HomePage() {
  return (

    <div className="bg-[#F7F7F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(generateOrganizationSchema())}
      />
      <Navbar/>
      <main>
        <Hero />
        <Differentiator/>
        <Testimonials/>
        <PricingSection/>
        <FAQ/>
        <FinalCta/>
      </main>
      <Footer/>
    </div>
  );
}