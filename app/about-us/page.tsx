import { Metadata } from "next";
import AboutClient from "./AboutClient";
import { generateWebPageSchema, generateJsonLd, getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
    title: "About Us - The Marketplace for Indian Creators | GetVik",
    description: "GetVik is built for Indian creators to sell digital products easily. We prioritize trust, simplicity, and creator success.",
    alternates: {
        canonical: getCanonicalUrl("/about-us"),
    },
    openGraph: {
        title: "About Us - The Marketplace for Indian Creators | GetVik",
        description: "GetVik is built for Indian creators to sell digital products easily.",
        url: getCanonicalUrl("/about-us"),
    },
};

export default function AboutPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={generateJsonLd(
                    generateWebPageSchema({
                        name: "About Us - GetVik",
                        description: "Learn about GetVik's mission to empower Indian creators.",
                        url: getCanonicalUrl("/about-us"),
                    })
                )}
            />
            <AboutClient />
        </>
    );
}
