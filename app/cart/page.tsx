'use client';

import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/types/formats';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fixR2Url } from '@/lib/image.utils';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart, isLoading } = useCart();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-gray-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                <p className="text-gray-400 mb-8 text-center max-w-md">
                    Looks like you haven&apos;t added any digital assets to your cart yet.
                </p>
                <Link
                    href="/discover"
                    className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Breadcrumb items={[{ label: 'Cart' }]} />
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.product._id}
                                className="flex gap-4 p-3 sm:p-4 bg-[#111] rounded-xl border border-[#222] group"
                            >
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#1a1a1a] rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={fixR2Url(item.product.media?.[0]?.url) || 'https://placehold.co/400x400/1C1C1C/FFF?text=Product'}
                                        alt={item.product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-lg line-clamp-1">{item.product.title}</h3>
                                        <p className="text-sm text-gray-400 mt-1">
                                            by {item.product.creatorId?.storeName || 'Creator'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, -1)}
                                                disabled={item.quantity <= 1}
                                                className="p-1 hover:bg-[#262626] rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, 1)}
                                                className="p-1 hover:bg-[#262626] rounded-md transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(item.product.price * item.quantity)}
                                            </span>
                                            <button
                                                onClick={() => removeItem(item.product._id)}
                                                className="text-gray-500 hover:text-red-400 transition-colors p-2 -mr-2"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-sm text-gray-500 hover:text-white transition-colors underline"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#111] rounded-2xl border border-[#222] p-4 sm:p-6 lg:sticky lg:top-24">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Taxes</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="h-px bg-[#222] my-4" />
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-white text-black py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                            >
                                Proceed to Checkout
                                <ArrowRight size={18} />
                            </Link>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                Secure checkout powered by Cashfree
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
