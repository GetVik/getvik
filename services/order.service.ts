import api from "@/lib/api";
import { IUserOrder } from "@/types/order.interface";
import { ICreatorOrder } from "@/types/types";


import { mockOrders } from "@/data/mock";

export const getMyOrders = async (): Promise<IUserOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockOrders as any as IUserOrder[]; 
};

export const checkProductAccess = async (productId: string): Promise<{ hasAccess: boolean; order?: IUserOrder }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const order = mockOrders.find(o => o.productId?._id === productId);
    return { hasAccess: !!order, order: order as any as IUserOrder };
};

export const getOrder = async (orderId: string): Promise<IUserOrder> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const order = mockOrders.find(o => o._id === orderId);
    if (!order) throw new Error("Order not found");
    return order as any as IUserOrder;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<IUserOrder> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const order = mockOrders.find(o => o._id === orderId);
    if (!order) throw new Error("Order not found");
    return { ...order, status } as any as IUserOrder;
};

export const verifyPayment = async (orderId: string): Promise<{ success: boolean; order?: IUserOrder; message?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const order = mockOrders.find(o => o._id === orderId);
    return { success: !!order, order: order as any as IUserOrder, message: order ? "Payment verified" : "Order not found" };
};

export const getRecentOrders = async (): Promise<ICreatorOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockOrders;
};
