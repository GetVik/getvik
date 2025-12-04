import { Types, HydratedDocument } from "mongoose";

export interface IFile {
    name: string;
    url: string;
    size?: number;
}

export interface IMedia {
    type: 'image' | 'video';
    url: string;
}


export interface IPopulatedCreator {
    _id: string;
    storeName: string;
    storeSlug: string;
    profileImageUrl?: string;
    avatarUrl: string,
}

export interface IProduct {
    _id: Types.ObjectId;
    creatorId: IPopulatedCreator;
    title: string;
    slug: string;
    summary?: string;
    description?: string;
    price: number;
    allowPayWhatYouWant?: boolean;
    suggestedPrice?: number;
    minPrice?: number;
    files: IFile[];
    media?: IMedia[];
    coverImageUrl?: string;
    thumbnailImageUrl?: string;
    category?: string;
    tags?: string[];
    status: 'Active' | 'Draft';
    isListed?: boolean;
    isArchived?: boolean;
    maxSales?: number;
    callToAction?: string;
    publishedAt?: Date;
    averageRating?: number;
    reviewCount?: number;
    totalSales?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductCreationData {
    title: string;
    description?: string;
    summary?: string;
    price: number;
    allowPayWhatYouWant?: boolean;
    suggestedPrice?: number;
    minPrice?: number;
    files: IFile[];
    coverImageUrl?: string;
    media?: IMedia[];
    thumbnailImageUrl?: string;
    category?: string;
    tags?: string[];
    status?: 'Active' | 'Draft';
    isListed?: boolean;
    isArchived?: boolean;
    maxSales?: number;
    callToAction?: string;
    customSlug?: string;
}

export interface ProductUpdateData {
    title?: string;
    slug?: string;
    summary?: string;
    description?: string;
    price?: number;
    allowPayWhatYouWant?: boolean;
    suggestedPrice?: number;
    minPrice?: number;
    files?: IFile[];
    media?: IMedia[];
    coverImageUrl?: string;
    thumbnailImageUrl?: string;
    category?: string;
    tags?: string[];
    status?: 'Active' | 'Draft';
    isListed?: boolean;
    isArchived?: boolean;
    maxSales?: number;
    callToAction?: string;
}



export type ProductDocument = HydratedDocument<IProduct>;