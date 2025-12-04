'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IFullProduct, ICartItem } from '@/types/types';
import toast from 'react-hot-toast';
import { fetchCart, addToCart, removeFromCart, clearCart as apiClearCart } from '@/services/cart.service';
import { useSession } from 'next-auth/react';

interface CartContextType {
    items: ICartItem[];
    addItem: (product: IFullProduct) => Promise<void>;
    updateQuantity: (productId: string, delta: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    total: number;
    itemCount: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ICartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            loadCart();
        } else {
            setItems([]);
        }
    }, [status]);

    const loadCart = async () => {
        try {
            setIsLoading(true);
            const cart = await fetchCart();
            console.log('Cart loaded:', cart);
            const validItems = (cart?.items || []).filter(item => item.product && item.product._id);
            setItems(validItems);
        } catch (error) {
            console.error('Failed to load cart', error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = async (product: IFullProduct) => {
        if (status !== 'authenticated') {
            toast.error('Please sign in to add items to cart');
            return;
        }

        // Optimistic update
        const existingItem = items.find(item => item.product._id === product._id);
        if (existingItem) {
            toast.error('Item already in cart');
            return;
        }

        try {
            const updatedCart = await addToCart(product._id, 1);
            console.log('Cart updated after add:', updatedCart);
            const validItems = (updatedCart?.items || []).filter(item => item.product && item.product._id);
            setItems(validItems);
            toast.success('Added to cart');
        } catch (error) {
            console.error('Failed to add item', error);
            toast.error('Failed to add item');
        }
    };

    const updateQuantity = async (productId: string, delta: number) => {
        try {
            const updatedCart = await addToCart(productId, delta);
            console.log('Cart updated after quantity change:', updatedCart);
            const validItems = (updatedCart?.items || []).filter(item => item.product && item.product._id);
            setItems(validItems);
            toast.success('Cart updated');
        } catch (error) {
            console.error('Failed to update quantity', error);
            toast.error('Failed to update quantity');
        }
    };

    const removeItem = async (productId: string) => {
        try {
            const updatedCart = await removeFromCart(productId);
            setItems(updatedCart?.items || []);
            toast.success('Removed from cart');
        } catch (error) {
            console.error('Failed to remove item', error);
            toast.error('Failed to remove item');
        }
    };

    const clearCart = async () => {
        try {
            await apiClearCart();
            setItems([]);
        } catch (error) {
            console.error('Failed to clear cart', error);
        }
    };

    const total = (items || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <CartContext.Provider
            value={{
                items: items || [],
                addItem,
                updateQuantity,
                removeItem,
                clearCart,
                total,
                itemCount: (items || []).length,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
