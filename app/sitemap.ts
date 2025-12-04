import { MetadataRoute } from "next";
import { mockCreator, mockCreator2, mockProducts } from "@/data/mock";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://getvik.com";

  // Static routes
  const routes = [
    "",
    "/signin",
    "/signup",
    "/pricing",
    "/features",
    "/blog",
    "/discover",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // Dynamic routes: Stores
  const storeRoutes = [mockCreator, mockCreator2].map((creator) => ({
    url: `${baseUrl}/store/${creator.storeSlug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Dynamic routes: Products
  const productRoutes = mockProducts.map((product) => ({
    url: `${baseUrl}/store/${product.creatorId.storeSlug}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...storeRoutes, ...productRoutes];
}
