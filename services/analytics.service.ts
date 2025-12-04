import { TopProduct, ITrafficAnalytics, ICustomerAnalytics, KpiData, MonthlyRevenue, ISalesData, ProductViewSummary } from "@/types/analytics.interface";
import { ICreatorOrder } from "@/types/types";
import { mockOrders, mockRevenueData, mockProducts } from "@/data/mock";

export const fetchRecentOrders = async (): Promise<ICreatorOrder[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders.slice(0, 4);
};

export const fetchTopProducts = async (): Promise<TopProduct[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProducts.slice(0, 5).map(p => ({
    _id: p._id,
    salesCount: Math.floor(Math.random() * 100) + 10,
    productDetails: {
      _id: p._id,
      title: p.title,
      slug: p.slug
    }
  }));
};

export const fetchTrafficAnalytics = async (): Promise<ITrafficAnalytics> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    totalViews: 1200,
    totalSales: 50,
    conversionRate: 4.2,
    trafficSources: [
      { source: "Direct", views: 400 },
      { source: "Social", views: 300 },
      { source: "Organic", views: 500 }
    ]
  };
};

export const fetchCustomerList = async (): Promise<ICustomerAnalytics[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { _id: "user-1", name: "John Doe", email: "john@example.com", totalSpent: 150, orderCount: 3 },
    { _id: "user-2", name: "Alice Smith", email: "alice@example.com", totalSpent: 200, orderCount: 2 }
  ];
};

export const fetchProductViews = async (productId: string): Promise<ProductViewSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    productId,
    totalViews: 500,
    viewsLastNDays: 100,
    viewsBySource: { "Direct": 200, "Social": 150, "Organic": 150 },
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      views: Math.floor(Math.random() * 50) + 10
    }))
  };
};

export const downloadSalesReport = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Mock download sales report");
};

export const fetchKPIs = async (): Promise<KpiData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    totalRevenue: mockRevenueData.totalRevenue,
    availableBalance: mockRevenueData.availableBalance,
    pendingBalance: 1200,
    totalRevenueChange: 12,
    pendingBalanceChange: 5
  };
};

export const fetchMonthlyRevenue = async (): Promise<MonthlyRevenue[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Array.from({ length: 6 }, (_, i) => ({
    month: new Date(Date.now() - (5 - i) * 30 * 86400000).toLocaleString('default', { month: 'short' }),
    year: new Date().getFullYear(),
    amount: Math.floor(Math.random() * 5000) + 1000
  }));
};

export const fetchSalesList = async (): Promise<ISalesData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders.map(o => ({
    orderId: o._id,
    orderDate: o.createdAt,
    customerName: o.buyerId?.name || "Unknown",
    customerEmail: o.buyerId?.email || "unknown@example.com",
    productName: o.productId?.title || "Unknown Product",
    amount: o.amount,
    platformFee: o.amount * 0.05,
    creatorEarnings: o.amount * 0.95,
    status: (o.status === "Completed" || o.status === "Pending" || o.status === "Failed") ? o.status : "Completed",
    tax: 0
  }));
};

export const fetchTransactions = async (): Promise<ICreatorOrder[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders;
};
