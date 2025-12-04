import { Metadata } from "next";
import PricingClient from "./PricingClient";
import { generateWebPageSchema, generateJsonLd, getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Pricing - Simple, Transparent Fees | GetVik",
    description: "Start for free with a 10% platform fee. Upgrade to reduce fees as you grow. No hidden charges, no setup fees.",
    alternates: {
        canonical: getCanonicalUrl("/pricing"),
    },
    openGraph: {
        title: "Pricing - Simple, Transparent Fees | GetVik",
        description: "Start for free with a 10% platform fee. Upgrade to reduce fees as you grow.",
        url: getCanonicalUrl("/pricing"),
    },
};

export default function PricingPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={generateJsonLd(
                    generateWebPageSchema({
                        name: "Pricing - GetVik",
                        description: "Simple, transparent pricing for creators. Start for free.",
                        url: getCanonicalUrl("/pricing"),
                    })
                )}
            />
            <PricingClient />
        </>
    );
}
