export enum PayoutStatus {
  PENDING = "Pending",
  PROCESSED = "Processed",
  FAILED = "Failed",
}

export interface IPayout {
  _id: string;
  creatorId: string;
  amount: number;
  mode: "BANK" | "UPI";
  upiId?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    accountType?: "Savings" | "Current";
  };
  status: PayoutStatus;
  failureReason?: string;
  requestedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayoutRequestData {
  amount: number;
  mode: "BANK" | "UPI";
}
