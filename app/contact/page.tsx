import { Metadata } from "next";
import ContactClient from "./ContactClient";
import { generateWebPageSchema, generateJsonLd, getCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Contact Us - Support & Inquiries | GetVik",
    description: "Have questions or need support? Contact the GetVik team. We're here to help creators and buyers.",
    alternates: {
        canonical: getCanonicalUrl("/contact"),
    },
    openGraph: {
        title: "Contact Us - Support & Inquiries | GetVik",
        description: "Have questions or need support? Contact the GetVik team.",
        url: getCanonicalUrl("/contact"),
    },
};

export default function ContactPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={generateJsonLd(
                    generateWebPageSchema({
                        name: "Contact Us - GetVik",
                        description: "Contact page for GetVik support and inquiries.",
                        url: getCanonicalUrl("/contact"),
                    })
                )}
            />
            <ContactClient />
        </>
    );
}
