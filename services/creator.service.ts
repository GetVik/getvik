import { mockCreator } from "@/data/mock";

export interface OnboardCreatorData {
  storeName: string;
  desiredSlug?: string;
}

export interface OnboardCreatorResponse {
  token: string;
  storeSlug: string;
}

export const onboardCreator = async (data: OnboardCreatorData): Promise<OnboardCreatorResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
      token: "mock-token",
      storeSlug: data.desiredSlug || mockCreator.storeSlug
  };
};
