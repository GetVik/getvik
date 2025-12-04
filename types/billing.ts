
export interface ISubscription {
  _id: string;
  status: "active" | "past_due" | "canceled" | "incomplete" | "trial";
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  billingCycle: "monthly" | "yearly";
  planId: {
    _id: string;
    name: string;
    planCode: string;
    price: number;
    currency: string;
    features?: string[];
    trialDays?: number;
    description?: string;
    limits?: [];
  };
}

export interface IInvoice {
  _id: string;
  id?: string; // Potential alias
  invoiceId?: string; // Potential alias
  orderId?: string; // To check if it's present
  invoiceNumber: string;
  createdAt: string;
  amount: number;
  currency: string;
  status: "paid" | "refunded" | "pending" | "failed";
  downloadUrl?: string;
  pdfUrl?: string;
}

export interface CreatorBankDetails {
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountType?: "Savings" | "Current";
}

export interface ICreatorSettings {
  storeName: string;
  storeSlug: string;
  gstin?: string;
  panNumber?: string;
  bankDetails?: CreatorBankDetails;
  upiId?: string;
  kycStatus: "Pending" | "Verified" | "Rejected";
  userName?: string;
}
