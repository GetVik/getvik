import { IProduct, IFile } from "@/types/product.interface";
import { mockProducts } from "@/data/mock";

export interface Product extends Omit<IProduct, 'creatorId' | 'files' | '_id'> {
  _id: string;
  files: IFile[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockProducts.map(p => ({
    ...p,
    files: [],
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: {
        _id: p.creatorId._id,
        storeName: p.creatorId.storeName,
        storeSlug: p.creatorId.storeSlug,
        avatarUrl: p.creatorId.profileImageUrl || "",
        profileImageUrl: p.creatorId.profileImageUrl
    }
  })) as unknown as Product[];
};

export const fetchProductById = async (productId: string): Promise<IProduct> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const product = mockProducts.find(p => p._id === productId);
  if (!product) throw new Error("Product not found");
  
  return {
      ...product,
      files: [],
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: {
          _id: product.creatorId._id,
          storeName: product.creatorId.storeName,
          storeSlug: product.creatorId.storeSlug,
          avatarUrl: product.creatorId.profileImageUrl || "",
          profileImageUrl: product.creatorId.profileImageUrl
      }
  } as unknown as IProduct;
};

export const updateProduct = async (productId: string, updateData: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Update product:", productId, updateData);
};

export const deleteProductById = async (productId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Delete product:", productId);
};

export const createProduct = async (productData: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Create product:", productData);
};

export const deleteProduct = async (productId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Delete product:", productId);
};