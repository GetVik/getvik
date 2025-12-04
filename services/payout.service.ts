import api from "@/lib/api";
import { IPayout, PayoutRequestData } from "@/types/payout.interface";

export const requestPayout = async (data: PayoutRequestData) => {
  const response = await api.post("/payouts/request", data);
  return response.data;
};

import { mockPayouts } from "@/data/mock";

export const getMyPayouts = async (): Promise<IPayout[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockPayouts;
};
