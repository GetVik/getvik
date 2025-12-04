export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  EXPIRED = 'expired',
  TRIAL = 'trial',
}


export interface ISubscribedPlan {
  _id: string;
  name: string;
  features: string[];
  planCode: string;
}

export interface ISubscriptionDetails {
  _id: string;
  planId: ISubscribedPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  trialEndDate?: string;
}

// Response when creating a free or trial subscription (instant activation)
export interface FreeSubscriptionResponse {
  _id: string;
  status: 'active' | 'trial';
  planId: ISubscribedPlan | { _id: string; name: string; features: string[]; planCode: string };
  endDate: string;
  startDate: string;
  trialEndDate?: string;
}

// Response when creating a paid subscription (requires payment)
export interface PaidSubscriptionResponse {
  subscriptionId: string;
  payment_session_id: string;
  order_amount: number;
  order_currency: string;
  environment: 'production' | 'sandbox';
}

// Union type for subscription creation response
export type CreateSubscriptionResponse = FreeSubscriptionResponse | PaidSubscriptionResponse;

// Type guard to check if response is paid subscription
export function isPaidSubscriptionResponse(
  response: CreateSubscriptionResponse
): response is PaidSubscriptionResponse {
  return 'payment_session_id' in response;
}