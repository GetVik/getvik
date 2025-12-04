import { ICreatorOrder } from "@/types/types";
import { mockOrders, mockCheckoutSession } from "@/data/mock";

export const fetchCreatorOrders = async (): Promise<ICreatorOrder[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders;
};

export const createCheckoutSession = async (
  productId: string
): Promise<{ payment_session_id: string; order_id: string; environment: 'production' | 'sandbox' }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockCheckoutSession;
};
