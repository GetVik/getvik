import { IStoreProduct } from "@/types/types";
import { mockProducts, mockCategories } from "@/data/mock";

export const fetchPublicProducts = async ({
  page = 1,
  limit = 12,
  sortBy = "newest",
  category,
  search,
  priceMin,
  priceMax,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  category?: string;
  search?: string;
  priceMin?: string;
  priceMax?: string;
}): Promise<{
  products: IStoreProduct[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredProducts = [...mockProducts];

  // Filter by Category
  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  // Filter by Search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by Price
  if (priceMin) {
    filteredProducts = filteredProducts.filter((p) => p.price >= Number(priceMin));
  }
  if (priceMax) {
    filteredProducts = filteredProducts.filter((p) => p.price <= Number(priceMax));
  }

  // Sort
  if (sortBy === "price_asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  // Default is newest, but our mock data doesn't have dates, so we leave as is.

  // Pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  return {
    products: paginatedProducts,
    totalProducts,
    totalPages,
    currentPage: page,
  };
};

export const fetchProductCategories = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCategories;
};
