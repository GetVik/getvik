import { Types } from "mongoose";

export interface ICreator {
  userId: Types.ObjectId;
  storeName: string;
  storeSlug: string;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  socials?: {
    x?: string;
    instagram?: string;
    website?: string;
  };
  balance: number;
  panNumber?: string;
  gstin?: string;
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountType?: 'Savings' | 'Current';
  };
  upiId?: string;
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

