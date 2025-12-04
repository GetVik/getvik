import { ICreator } from "@/types/creator.interface";
import { mockCreator } from "@/data/mock";

export type CreatorDetails = Omit<ICreator, "userId"> & {
  _id: string;
  userId: { name: string; _id: string; phone?: string };
  coverImageUrl?: string;
};

export interface ProfileUpdateData {
  userName: string;
  bio: string;
  profileImageUrl: string;
  socials?: {
    x?: string;
    instagram?: string;
    website?: string;
  };
}

export interface StoreUpdateData {
  storeName: string;
  storeSlug: string;
  bio: string;
  coverImageUrl: string;
}

export interface PayoutUpdateData {
  panNumber: string;
  accountHolderName: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountType: "Savings" | "Current";
  };
  upiId?: string;
}

export const fetchCreatorSettings = async (): Promise<CreatorDetails> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
      ...mockCreator,
      userId: { name: "Demo User", _id: "user-1", phone: "1234567890" }
  } as unknown as CreatorDetails;
};

export const updateProfileSettings = async (data: ProfileUpdateData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data;
};

export const updateStoreSettings = async (data: StoreUpdateData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    message: "Store settings updated",
    creator: { ...mockCreator, ...data }
  };
};

export const updatePayoutSettings = async (data: PayoutUpdateData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { message: "Payout settings updated" };
};

export interface UserPhoneUpdateData {
  phone: string;
}

export const updateUserPhone = async (phone: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    message: "Phone updated",
    user: { phone }
  };
};

export const fetchUserProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    user: {
      _id: "mock-creator-id",
      name: "GetVik Demo",
      email: "demo@getvik.com",
      phone: "1234567890",
      role: "Creator",
      isVerified: true,
    },
    creator: {
      storeSlug: mockCreator.storeSlug,
    }
  };
};
