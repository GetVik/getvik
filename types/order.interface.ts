import { IStoreCreator, IMedia } from "./types";

export interface IUserOrder {
    _id: string;
    productId: {
        _id: string;
        title: string;
        slug: string;
        price: number;
        media?: IMedia[];
        creatorId: IStoreCreator;
        files?: { name: string; url: string; size?: number }[]; // For digital delivery
    } | null;
    creatorId?: IStoreCreator
    amount: number;
    status: 'Pending' | 'Completed' | 'Failed';
    createdAt: string;
    invoiceId?: string; // Optional, if we have a separate invoice ID
}