
export interface TopProduct {
  _id: string;
  salesCount: number;
  productDetails: {
    _id: string;
    title: string;
    slug: string;
  };
}

export interface ITrafficAnalytics {
  totalViews: number;
  totalSales: number;
  conversionRate: number;
  trafficSources: {
    source: string;
    views: number;
  }[];
}

export interface ICustomerAnalytics {
  _id: string;
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
}

export interface ProductViewSummary {
  productId: string;
  totalViews: number;
  viewsLastNDays: number;
  viewsBySource: Record<string, number>;
  daily: Array<{
    date: string;
    views: number;
  }>;
}


export interface KpiData {
  totalRevenue: number;
  availableBalance: number;
  pendingBalance: number;
  totalRevenueChange: number;
  pendingBalanceChange: number;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  amount: number;
}

export interface ISalesData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  amount: number;
  platformFee: number;
  creatorEarnings: number;
  status: 'Pending' | 'Completed' | 'Failed';
  tax: number;
}