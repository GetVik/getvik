'use client';

import { IFullProduct } from '@/types/types';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
    product: IFullProduct;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem, items } = useCart();
    const router = useRouter();

    const isInCart = items.some((item) => item.product._id === product._id);

    const handleClick = () => {
        if (isInCart) {
            router.push('/cart');
        } else {
            addItem(product);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`flex w-full items-center justify-center rounded-lg px-6 py-2 text-lg font-semibold transition-all ${isInCart
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-[#262626] text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
        >
            {isInCart ? (
                <>
                    Go to Cart
                    <ArrowRight className="ml-2 h-5 w-5" />
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </>
            )}
        </button>
    );
}
