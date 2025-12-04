'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Loader2,
  AlertCircle,
  Menu,
} from 'lucide-react';
import { ProductCard } from '@/components/ui/cards/ProductCard';
import { IStoreProduct } from '@/types/types';
import {
  fetchPublicProducts,
  fetchProductCategories
} from '@/services/discover.service';
import { DiscoverSidebar } from '@/components/discover/DiscoverSidebar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FinalCta } from '@/components/home/CTA';

type Filters = {
  sortBy: string;
  category: string;
  search: string;
  priceMin: string;
  priceMax: string;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
};

export default function DiscoverPageContent({ initialCategory = '' }: { initialCategory?: string }) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IStoreProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  // MASONRY STATE: Track how many columns we should show based on screen width
  const [columnCount, setColumnCount] = useState(1);

  const [filters, setFilters] = useState<Filters>({
    sortBy: 'newest',
    category: initialCategory,
    search: searchParams.get('search') || '',
    priceMin: '',
    priceMax: '',
  });

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. HANDLE RESIZE FOR MASONRY
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) {
        setColumnCount(3); // Desktop
      } else if (window.innerWidth >= 640) {
        setColumnCount(2); // Tablet
      } else {
        setColumnCount(1); // Mobile
      }
    };

    // Run once on mount
    updateColumns();

    // Listen for resize
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // 2. DISTRIBUTE PRODUCTS INTO COLUMNS
  // This splits the single array into [[Col1 Items], [Col2 Items], [Col3 Items]]
  const distributedProducts = useMemo(() => {
    const columns: IStoreProduct[][] = Array.from({ length: columnCount }, () => []);
    
    products.forEach((product, index) => {
      // Logic: Item 0 goes to Col 0, Item 1 to Col 1, Item 2 to Col 2, Item 3 to Col 0...
      columns[index % columnCount].push(product);
    });
    
    return columns;
  }, [products, columnCount]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchParams.get('search') || '' }));
  }, [searchParams]);

  // Fetch Categories
  useEffect(() => {
    const initData = async () => {
      try {
        const cats = await fetchProductCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      }
    };
    initData();
  }, []);

  const fetchProducts = useCallback(
    async (page: number, currentFilters: Filters, loadMore = false) => {
      if (loadMore) setIsMoreLoading(true);
      else setIsPageLoading(true);
      setError(null);

      try {
        const response = await fetchPublicProducts({
          page,
          limit: 12,
          sortBy: currentFilters.sortBy,
          category: currentFilters.category || undefined,
          search: currentFilters.search || undefined,
          priceMin: currentFilters.priceMin || undefined,
          priceMax: currentFilters.priceMax || undefined,
        });

        setProducts((prev) =>
          loadMore
            ? [...prev, ...response.products]
            : response.products
        );
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalProducts: response.totalProducts,
        });
      } catch (err: unknown) {
        console.error('Failed to fetch products:', err);

        let errorMessage = 'Could not load products.';
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const response = (err as { response?: { data?: { message?: string } } }).response;
          if (response?.data?.message) {
            errorMessage = response.data.message;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setIsPageLoading(false);
        setIsMoreLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts(1, filters);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters, fetchProducts]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === 'All' ? '' : category,
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: 'newest',
      category: '',
      search: '',
      priceMin: '',
      priceMax: '',
    });
  };

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchProducts(pagination.currentPage + 1, filters, true);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="max-w-[1600px] min-h-screen mx-auto px-4 md:px-8 py-8">

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Discover</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-white/10 bg-transparent text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0D0D0D] border-white/10 text-white w-[300px] p-6">
              <DiscoverSidebar
                filters={filters}
                categories={categories}
                onFilterChange={handleFilterChange}
                onCategorySelect={handleCategorySelect}
                onSortChange={handleSortChange}
                onClearFilters={handleClearFilters}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block sticky top-24 h-fit">
            <DiscoverSidebar
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onCategorySelect={handleCategorySelect}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <section className="flex-1 min-h-[400px]">
            {/* Header for Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Discover Products</h1>
              <p className="text-gray-400 text-sm">
                {pagination.totalProducts} {pagination.totalProducts === 1 ? 'result' : 'results'}
              </p>
            </div>

            {isPageLoading && (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            )}

            {error && (
              <div className="flex flex-col h-64 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!isPageLoading && !error && products.length === 0 && (
              <div className="flex flex-col h-64 items-center justify-center rounded-xl border border-white/5 bg-[#141414] p-8 text-center">
                <p className="text-lg font-medium text-white mb-2">No products found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-sm text-white hover:text-gray-300 underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {!isPageLoading && products.length > 0 && (
              /* FIX: TRUE MASONRY RENDERER 
                 - We render a Flex Row containing N Flex Cols.
                 - items-start ensures columns don't stretch to match the tallest column.
              */
              <div className="flex flex-row gap-6 md:gap-8 items-start w-full">
                {distributedProducts.map((colProducts, colIndex) => (
                  <div key={colIndex} className="flex flex-col flex-1 gap-6 md:gap-8 w-full min-w-0">
                    {colProducts.map((product) => (
                      <ProductCard key={String(product._id)} product={product} />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {pagination.currentPage < pagination.totalPages && !error && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isMoreLoading}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-8 py-3 text-sm font-medium text-white transition-all hover:bg-white hover:text-black disabled:opacity-50"
                >
                  {isMoreLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isMoreLoading ? 'Loading...' : 'Load More Products'}
                </button>
              </div>
            )}
          </section>
        </div>

      </div>
      <FinalCta />
    </main >
  );
}