import { ICart } from "@/types/types";
import { mockCart } from "@/data/mock";


let currentCart: ICart = { ...mockCart };

export const fetchCart = async (): Promise<ICart> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return currentCart;
};

export const addToCart = async (productId: string, quantity: number = 1): Promise<ICart> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return currentCart;
};

export const removeFromCart = async (productId: string): Promise<ICart> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const updatedItems = currentCart.items.filter(item => item.product._id !== productId);
  currentCart = { ...currentCart, items: updatedItems };
  return currentCart;
};

export const clearCart = async (): Promise<ICart> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  currentCart = { ...currentCart, items: [] };
  return currentCart;
};
