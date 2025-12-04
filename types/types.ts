export interface IMedia {
  type: 'image' | 'video';
  url: string;
  isNew?: boolean;
}

export interface IStoreCreator {
  _id: string;
  storeName: string;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  socials?: {
    x?: string;
    instagram?: string;
    website?: string;
  };
  storeSlug: string;
}

export interface IStoreProduct {
  _id: string;
  title: string;
  price: number;
  slug: string;

  media: IMedia[];
  files?: IFile[];

  creatorId: IStoreCreator;
  description?: string;
  summary?: string;
  allowPayWhatYouWant?: boolean;
  category?: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface IFile {
  name: string;
  url: string;
  size?: number;
}

export interface IReview {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profileImageUrl?: string;
  };
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFullProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;

  media: IMedia[];

  files: IFile[];
  creatorId: IStoreCreator;
  allowPayWhatYouWant?: boolean;
  category: string;
  averageRating?: number;
  reviewCount?: number;
}


export interface ICreatorOrder {
  _id: string;
  productId: {
    _id: string;
    title: string;
  } | null;
  buyerId: {
    _id: string;
    name?: string | null;
    email: string;
  } | null;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  createdAt: string;
}

export interface IPlan {
  _id: string;
  planCode: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  isDisabled: boolean;
  trialDays: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  status: 'active' | 'inactive' | 'archived';
  planType: 'standard' | 'beta';
}

export interface ICartItem {
  product: IFullProduct;
  quantity: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  createdAt: string;
  updatedAt: string;
}