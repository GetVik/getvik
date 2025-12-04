import { ICart } from "@/types/types";
import { mockCart } from "@/data/mock";

// Simple in-memory cart for demo purposes
let currentCart: ICart = { ...mockCart };

export const fetchCart = async (): Promise<ICart> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return currentCart;
};

export const addToCart = async (productId: string, quantity: number = 1): Promise<ICart> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // In a real mock, we'd update currentCart here
  // For now, just return the static mock cart
  return currentCart;
};

export const removeFromCart = async (productId: string): Promise<ICart> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Mock removal
  const updatedItems = currentCart.items.filter(item => item.product._id !== productId);
  currentCart = { ...currentCart, items: updatedItems };
  return currentCart;
};

export const clearCart = async (): Promise<ICart> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  currentCart = { ...currentCart, items: [] };
  return currentCart;
};
