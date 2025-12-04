import { IPlan } from "@/types/types";
import { ISubscription, IInvoice, ICreatorSettings } from "@/types/billing";
import { 
  CreateSubscriptionResponse 
} from "@/types/subscription.interface";
import { mockPlans, mockSubscription } from "@/data/mock";

export const fetchPlans = async (): Promise<IPlan[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPlans;
};

export const fetchSubscription = async (): Promise<ISubscription | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockSubscription;
};

export const fetchInvoices = async (): Promise<IInvoice[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      _id: "inv-1",
      invoiceNumber: "INV-001",
      createdAt: new Date().toISOString(),
      amount: 999,
      currency: "INR",
      status: "paid",
      pdfUrl: "#",
    }
  ];
};

export const downloadInvoice = async (invoiceId: string): Promise<Blob> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return new Blob(["Mock Invoice PDF"], { type: "application/pdf" });
};

export const fetchCreatorSettings = async (): Promise<ICreatorSettings> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    storeName: "GetVik Demo Store",
    storeSlug: "getvik-demo",
    kycStatus: "Verified",
    userName: "Demo User",
  };
};

export const updateCreatorSettings = async (
  payload: ICreatorSettings
): Promise<ICreatorSettings> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return payload;
};


export const cancelSubscription = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
};



export const createSubscription = async (
  planId: string
): Promise<CreateSubscriptionResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    subscriptionId: "sub-new",
    clientSecret: "secret",
    paymentId: "pay-1",
  } as any; // Mock response
};

export const switchSubscription = async (
  newPlanId: string
): Promise<CreateSubscriptionResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    subscriptionId: "sub-switched",
    clientSecret: "secret",
    paymentId: "pay-2",
  } as any;
};

export const verifySubscriptionPayment = async (
  subscriptionId: string
): Promise<{ message: string; subscription: ISubscription }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    message: "Payment verified",
    subscription: mockSubscription,
  };
};

export const checkoutPlan = async (
  planId: string,
  billingCycle: "monthly" | "yearly"
) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { url: "https://example.com/checkout" };
};
