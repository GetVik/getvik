import api from "@/lib/api";
import { IInvoice } from "@/types/billing";

import { mockInvoices } from "@/data/mock";

export const getMyInvoices = async (): Promise<IInvoice[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockInvoices;
};

export const downloadInvoice = async (invoiceId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Mock downloading invoice ${invoiceId}`);
};