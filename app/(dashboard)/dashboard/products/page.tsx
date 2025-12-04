'use client';

import React from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  ExternalLink,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { DashboardCard } from '@/components/ui/cards/dashboard/DashboardCard';
import { LegendItem } from '@/components/ui/LegendItem';
import { useSession } from 'next-auth/react';

import { formatCurrency } from '@/types/formats';
import toast from 'react-hot-toast';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchProducts, deleteProduct, Product } from '@/services/product.service';




export default function ProductsPage() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const storeSlug = session?.user?.storeSlug;
  const isEnabled = !!session?.user?.role && session.user.role === 'Creator';


  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: productsError,
  } = useQuery<Product[], Error>({
    queryKey: ['myProducts'],
    queryFn: fetchProducts,
    enabled: isEnabled,
  });


  const {
    mutate: deleteProductMutation,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
      toast.success('Product deleted successfully!');
    },
    onError: (err: Error) => {
      console.error('Failed to delete product:', err);
      toast.error(err.message || 'Failed to delete product. Please try again.');
    },
  });

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      return;
    }
    deleteProductMutation(productId);
  };

  const handleShare = (e: React.MouseEvent, productSlug: string) => {
    e.preventDefault();
    if (!storeSlug) return;

    const url = `${window.location.origin}/store/${storeSlug}/product/${productSlug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section: Stack on mobile, Row on desktop */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl px-2 font-light text-white">My Products</h1>
        <Link
          href="/dashboard/products/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-gray-200 sm:w-auto"
        >
          <Plus size={16} />
          Add New Product
        </Link>
      </div>

      <DashboardCard title="All Products" className="overflow-hidden">
        {isLoadingProducts && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        {isErrorProducts && !isLoadingProducts && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-400">
              {productsError?.message || 'Failed to load products. Please try again.'}
            </p>
          </div>
        )}
        {!isLoadingProducts && !isErrorProducts && products.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            {status === 'loading'
              ? 'Loading session...'
              : !isEnabled
                ? 'You are not authorized to view products.'
                : "You haven't added any products yet."}
          </p>
        )}

        {!isLoadingProducts && !isErrorProducts && products.length > 0 && (
          <div className="w-full">

            <div className="hidden md:grid md:grid-cols-7 md:gap-4 border-b border-gray-700 pb-3 text-sm font-medium uppercase text-gray-400">
              <div className="col-span-2">Product Name</div>
              <div>Category</div>
              <div>Price</div>
              <div>Slug (Link)</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {products.map((product) => (
                <div
                  key={product._id}

                  className="
                    flex flex-col gap-3 rounded-lg bg-[#0D0D0D] p-4 
                    md:grid md:grid-cols-7 md:items-center md:gap-4 md:p-3
                    transition-colors hover:bg-[#262626]
                  "
                >

                  <div className="md:col-span-2 flex flex-col truncate mb-2 md:mb-0">
                    <span className="font-medium text-white truncate text-base md:text-sm" title={product.title}>
                      {product.title}
                    </span>
                    <span className="text-xs text-gray-500">{product.files?.length || 0} file(s)</span>
                  </div>


                  <div className="flex justify-between items-center md:block">
                    <span className="text-sm text-gray-500 md:hidden">Category:</span>
                    <div className="text-sm text-gray-400 truncate text-right md:text-left">
                      {product.category || '-'}
                    </div>
                  </div>


                  <div className="flex justify-between items-center md:block">
                    <span className="text-sm text-gray-500 md:hidden">Price:</span>
                    <div className="flex items-center justify-end md:justify-start text-sm text-gray-300">
                      {formatCurrency(product.price)}
                      {product.allowPayWhatYouWant && (
                        <span className="ml-1 text-xs text-blue-400" title="Pay What You Want enabled">
                          (PWYW)
                        </span>
                      )}
                    </div>
                  </div>


                  <div className="flex justify-between items-center md:block">
                    <span className="text-sm text-gray-500 md:hidden">Slug:</span>
                    <div className="text-sm text-gray-400 truncate max-w-[200px] md:max-w-none text-right md:text-left">
                      /{product.slug}
                    </div>
                  </div>


                  <div className="flex justify-between items-center md:block">
                    <span className="text-sm text-gray-500 md:hidden">Status:</span>
                    <div className="flex justify-end md:justify-start">
                      <LegendItem
                        colorClass={
                          product.isArchived
                            ? 'bg-gray-500'
                            : product.status === 'Active'
                              ? 'bg-green-700'
                              : 'bg-yellow-400'
                        }
                        text={
                          product.isArchived
                            ? 'Archived'
                            : product.status
                        }
                      />
                    </div>
                  </div>


                  <div className="flex items-center justify-end gap-3 pt-3 mt-1 border-t border-gray-800 md:border-0 md:mt-0 md:pt-0 md:gap-2 text-gray-400">
                    <span className="text-sm text-gray-500 md:hidden mr-auto">Actions:</span>

                    {storeSlug && (
                      <Link
                        href={`/store/${storeSlug}/product/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Public Page"
                        className="p-1 hover:text-white"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    )}
                    {storeSlug && (
                      <button
                        onClick={(e) => handleShare(e, product.slug)}
                        title="Share Link"
                        className="p-1 hover:text-blue-400"
                      >
                        <Share2 size={18} />
                      </button>
                    )}
                    <Link href={`/dashboard/products/edit/${product._id}`} title="Edit" className="p-1 hover:text-white">
                      <Edit size={18} />
                    </Link>
                    <button
                      title="Delete"
                      className="p-1 hover:text-red-500 disabled:opacity-50"
                      onClick={() => handleDelete(product._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}