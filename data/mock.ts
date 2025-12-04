import { IStoreProduct, IStoreCreator, ICreatorOrder, IPlan, ICart, IReview } from "@/types/types";
import { ISubscription, IInvoice } from "@/types/billing";
import { IPayout, PayoutStatus } from "@/types/payout.interface";

export const mockRevenueData = {
  totalRevenue: 12500,
  revenueLast30Days: 3200,
  revenuePrev30Days: 2800,
  availableBalance: 4500,
};

export const mockCreator: IStoreCreator = {
  _id: "mock-creator-id",
  storeName: "GetVik Demo Store",
  bio: "Welcome to the official demo store of GetVik. We sell high-quality digital products.",
  profileImageUrl: "https://ui-avatars.com/api/?name=GetVik&background=random",
  coverImageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  socials: {
    x: "https://twitter.com/getvik",
    instagram: "https://instagram.com/getvik",
    website: "https://getvik.com",
  },
  storeSlug: "getvik-demo",
};

export const mockCreator2: IStoreCreator = {
  _id: "mock-creator-id-2",
  storeName: "Creative Studio",
  bio: "Premium design assets for creative professionals.",
  profileImageUrl: "https://ui-avatars.com/api/?name=Creative+Studio&background=0D8ABC&color=fff",
  coverImageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
  socials: {
    instagram: "https://instagram.com/creativestudio",
  },
  storeSlug: "creative-studio",
};

export const mockProducts: IStoreProduct[] = [
  {
    _id: "prod-1",
    title: "Ultimate Notion Dashboard",
    price: 49,
    slug: "ultimate-notion-dashboard",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      },
    ],
    creatorId: mockCreator,
    description: "Organize your entire life with this comprehensive Notion dashboard.",
    summary: "The best Notion template for productivity.",
    category: "Templates",
    averageRating: 4.8,
    reviewCount: 124,
    files: [{ name: "dashboard.zip", url: "#" }]
  },
  {
    _id: "prod-2",
    title: "SaaS Starter Kit",
    price: 199,
    slug: "saas-starter-kit",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      },
    ],
    creatorId: mockCreator,
    description: "Launch your SaaS in days, not months. Includes auth, payments, and more.",
    summary: "Complete Next.js boilerplate for SaaS.",
    category: "Software",
    averageRating: 5.0,
    reviewCount: 89,
    files: [{ name: "saas-kit.zip", url: "#" }]
  },
  {
    _id: "prod-3",
    title: "Digital Marketing E-book",
    price: 29,
    slug: "digital-marketing-ebook",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      },
    ],
    creatorId: mockCreator2,
    description: "Master the art of digital marketing with this 100-page guide.",
    summary: "Learn SEO, social media, and email marketing.",
    category: "E-books",
    averageRating: 4.5,
    reviewCount: 56,
    files: [{ name: "ebook.pdf", url: "#" }]
  },
  {
    _id: "prod-4",
    title: "Finance Tracker",
    price: 19,
    slug: "finance-tracker",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1111&q=80",
      },
    ],
    creatorId: mockCreator2,
    description: "Keep track of your income and expenses easily.",
    summary: "Simple and effective finance tracking spreadsheet.",
    category: "Templates",
    averageRating: 4.7,
    reviewCount: 42,
    files: [{ name: "tracker.xlsx", url: "#" }]
  },
];

export const mockCategories = ["All", "Templates", "Software", "E-books", "Courses"];

export const mockOrders: ICreatorOrder[] = [
  {
    _id: "order-1",
    productId: { _id: "prod-1", title: "Ultimate Notion Dashboard" },
    buyerId: { _id: "user-1", email: "buyer@example.com", name: "John Doe" },
    amount: 49,
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "order-2",
    productId: { _id: "prod-2", title: "SaaS Starter Kit" },
    buyerId: { _id: "user-2", email: "alice@example.com", name: "Alice Smith" },
    amount: 199,
    status: "Completed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "order-3",
    productId: { _id: "prod-3", title: "Digital Marketing E-book" },
    buyerId: { _id: "user-3", email: "bob@example.com", name: "Bob Jones" },
    amount: 29,
    status: "Completed",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const mockActivity = [
  {
    id: "act-1",
    type: "sale",
    message: "New sale: Ultimate Notion Dashboard",
    amount: 49,
    timestamp: new Date().toISOString(),
  },
  {
    id: "act-2",
    type: "payout",
    message: "Payout processed",
    amount: -1500,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "act-3",
    type: "review",
    message: "New 5-star review received",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const mockPlans: IPlan[] = [
  {
    _id: "plan-free",
    planCode: "free",
    name: "Free Tier",
    description: "For getting started",
    price: 0,
    currency: "INR",
    isDisabled: false,
    trialDays: 0,
    billingCycle: "monthly",
    features: ["10% platform fee on all sales"],
    status: "active",
    planType: "standard",
  },
  {
    _id: "plan-plus-monthly",
    planCode: "plus-monthly",
    name: "Plus Tier",
    description: "For growing creators",
    price: 499,
    currency: "INR",
    isDisabled: false,
    trialDays: 14,
    billingCycle: "monthly",
    features: ["7% platform fee on all sales"],
    status: "active",
    planType: "standard",
  },
  {
    _id: "plan-pro-monthly",
    planCode: "pro-monthly",
    name: "Pro Tier",
    description: "For serious creators",
    price: 999,
    currency: "INR",
    isDisabled: false,
    trialDays: 14,
    billingCycle: "monthly",
    features: ["2.5% platform fee on all sales"],
    status: "active",
    planType: "standard",
  },
];

export const mockSubscription: ISubscription = {
  _id: "sub-1",
  status: "active",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  billingCycle: "monthly",
  planId: {
    _id: "plan-pro-monthly",
    name: "Pro Tier",
    planCode: "pro-monthly",
    price: 999,
    currency: "INR",
    features: ["Advanced Analytics", "Unlimited Products"],
  },
};

export const mockCart: ICart = {
  _id: "cart-1",
  user: "user-1",
  items: [
    {
      product: {
        ...mockProducts[0],
        files: [{ name: "dashboard.zip", url: "https://example.com/dashboard.zip" }],
        slug: mockProducts[0].slug,
        description: mockProducts[0].description || "",
        price: mockProducts[0].price,
        media: mockProducts[0].media,
        creatorId: mockCreator,
        category: "Templates",
      } as any, // Casting for simplicity in mock
      quantity: 1,
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockCheckoutSession = {
  payment_session_id: "session_123456",
  order_id: "order_123456",
  environment: "sandbox" as const,
};

export const mockReviews: IReview[] = [
  {
    _id: "review-1",
    productId: "prod-1",
    userId: {
      _id: "user-1",
      name: "John Doe",
      profileImageUrl: "https://ui-avatars.com/api/?name=John+Doe"
    },
    rating: 5,
    comment: "Amazing product! Highly recommended.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "review-2",
    productId: "prod-1",
    userId: {
      _id: "user-2",
      name: "Alice Smith",
      profileImageUrl: "https://ui-avatars.com/api/?name=Alice+Smith"
    },
    rating: 4,
    comment: "Good value for money.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const mockInvoices: IInvoice[] = [
  {
    _id: "inv-1",
    invoiceNumber: "INV-001",
    amount: 2999,
    currency: "INR",
    status: "paid",
    createdAt: new Date().toISOString(),
    pdfUrl: "#",
    downloadUrl: "#"
  },
  {
    _id: "inv-2",
    invoiceNumber: "INV-002",
    amount: 2999,
    currency: "INR",
    status: "paid",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    pdfUrl: "#",
    downloadUrl: "#"
  }
];

export const mockPayouts: IPayout[] = [
  {
    _id: "payout-1",
    creatorId: "creator-1",
    amount: 12500,
    mode: "BANK",
    status: PayoutStatus.PROCESSED,
    requestedAt: new Date(),
    processedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    bankDetails: {
      accountNumber: "1234567890",
      ifscCode: "SBIN0001234",
      accountHolderName: "John Doe",
      accountType: "Savings"
    }
  },
  {
    _id: "payout-2",
    creatorId: "creator-1",
    amount: 8000,
    mode: "BANK",
    status: PayoutStatus.PROCESSED,
    requestedAt: new Date(Date.now() - 7 * 86400000),
    processedAt: new Date(Date.now() - 7 * 86400000),
    createdAt: new Date(Date.now() - 7 * 86400000),
    updatedAt: new Date(Date.now() - 7 * 86400000),
    bankDetails: {
      accountNumber: "1234567890",
      ifscCode: "SBIN0001234",
      accountHolderName: "John Doe",
      accountType: "Savings"
    }
  }
];
