'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IUserOrder } from '@/types/order.interface';
import { getMyOrders } from '@/services/order.service';
import { Loader2, Package, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/types/formats';
import { downloadInvoice, getMyInvoices } from '@/services/invoice.service';
import { IInvoice } from '@/types/billing';
import toast from 'react-hot-toast';
import { fixR2Url } from '@/lib/image.utils';

export function OrderHistory() {
  const [orders, setOrders] = useState<IUserOrder[]>([]);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, invoicesData] = await Promise.all([
          getMyOrders(),
          getMyInvoices()
        ]);

        type OrdersResponse = IUserOrder[] | { orders: IUserOrder[] };

        const typedData = ordersData as OrdersResponse;

        const ordersList = Array.isArray(typedData)
          ? typedData
          : typedData.orders ?? [];

        setOrders(ordersList);
        setInvoices(invoicesData);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadInvoice = async (invoiceId: string) => {
    if (!invoiceId) return;
    setDownloadingInvoiceId(invoiceId);
    try {
      await downloadInvoice(invoiceId);
      toast.success('Invoice downloaded');
    } catch (error) {
      console.error(error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Only show completed orders
  const completedOrders = orders.filter((o) => o.status === 'Completed');

  const renderOrderCard = (order: IUserOrder, completed: boolean) => {
    const product = order.productId;
    const creator = order.creatorId ?? product?.creatorId;

    const productHref =
      product && creator?.storeSlug
        ? `/store/${creator.storeSlug}/product/${product.slug}`
        : undefined;

    const creatorHref =
      creator?.storeSlug ? `/store/${creator.storeSlug}` : undefined;

    return (
      <div
        key={order._id}
        className="flex flex-col gap-4 rounded-xl border border-[#262626] bg-[#101010] p-5 transition-all hover:border-[#333] sm:flex-row sm:items-center sm:justify-between"
      >
        {/* Product Info */}
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#262626] bg-[#1a1a1a]">
            {product?.media?.[0]?.url ? (
              <Image
                src={fixR2Url(product.media[0].url)}
                alt={product?.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-6 w-6 text-gray-600" />
              </div>
            )}
          </div>

          <div className='flex flex-col'>
            {/* Product name → link to product page */}

            {productHref ? (
              <Link
                href={productHref}
                className="font-medium text-white hover:underline"
              >
                {product?.title || 'Product Unavailable'}
              </Link>
            ) : (
              <h3 className="font-medium text-white">
                {product?.title || 'Product Unavailable'}
              </h3>
            )}

            {/* Creator name → link to store */}
            {creator?.storeName ? (
              creatorHref ? (
                <Link
                  href={creatorHref}
                  className="text-sm text-gray-400 hover:text-gray-200 hover:underline"
                >
                  {creator.storeName}
                </Link>
              ) : (
                <p className="text-sm text-gray-400">{creator.storeName}</p>
              )
            ) : (
              <p className="text-sm text-gray-400">Unknown Creator</p>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className={completed ? 'text-emerald-400' : 'text-yellow-400'}>
                {order.status}
              </span>
              <span>•</span>
              <span>{formatCurrency(order.amount)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {/* Download button only for completed orders with files */}
          {completed && product?.files && product.files.length > 0 && productHref && (
            <Link
              href={productHref}
              className="inline-flex items-center gap-2 rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-[#262626] hover:text-white"
            >
              <Download className="h-4 w-4" />
              Download
            </Link>
          )}

          {/* Invoice button (only completed) */}
          {completed && (
            <button
              onClick={() => {
                // Find invoice for this order
                const invoice = invoices.find(inv => inv.orderId === order._id);
                // Fallback to order.invoiceId or order._id if not found (though order._id is likely wrong)
                const invoiceId = invoice?._id || order.invoiceId;

                if (invoiceId) {
                  handleDownloadInvoice(invoiceId);
                } else {
                  toast.error("Invoice not found for this order");
                }
              }}
              disabled={!!downloadingInvoiceId}
              className="inline-flex items-center gap-2 rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-[#262626] hover:text-white disabled:opacity-50"
            >
              {downloadingInvoiceId && invoices.find(inv => inv.orderId === order._id)?._id === downloadingInvoiceId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Invoice
            </button>
          )}
        </div>
      </div>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        {/* Profile navigation */}
        <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="text-gray-600">/</span>
          <span className="font-semibold text-white">Orders</span>
          <span className="text-gray-600">/</span>
          <Link href="/dashboard/billing" className="hover:text-white">
            Billing
          </Link>
        </nav>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#262626] bg-[#101010] py-16 text-center">
          <div className="mb-4 rounded-full bg-[#1a1a1a] p-4">
            <Package className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white">No orders yet</h3>
          <p className="mt-1 max-w-sm px-4 text-sm text-gray-400">
            You haven&apos;t purchased any products yet. Explore the marketplace to find something amazing.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile navigation like product page breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span className="text-gray-600">/</span>
        <span className="font-semibold text-white">Orders</span>
        <span className="text-gray-600">/</span>
        <Link href="/dashboard/billing" className="hover:text-white">
          Billing
        </Link>
      </nav>

      <div>
        <h2 className="text-xl font-semibold text-white">Order History</h2>
        <p className="mt-1 text-xs text-gray-400">
          Showing only completed purchases. Pending/failed orders are not displayed.
        </p>
      </div>

      {/* Completed orders */}
      <div className="grid gap-4">
        {completedOrders.map((order) => renderOrderCard(order, true))}
      </div>
    </div>
  );
}
