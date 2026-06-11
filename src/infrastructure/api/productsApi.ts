import { ProductsResponse, Category } from '@/domain/models/product';

const BASE_URL = 'https://dummyjson.com';

export const productsApi = {
  getAllProducts: async (): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}/products?limit=0`);
    if (!res.ok) throw new Error('خطا در دریافت محصولات');
    return res.json();
  },

  searchProducts: async (query: string): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}/products/search?q=${query}&limit=0`);
    if (!res.ok) throw new Error('خطا در جستجوی محصولات');
    return res.json();
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${BASE_URL}/products/categories`);
    if (!res.ok) throw new Error('خطا در دریافت دسته‌بندی‌ها');
    return res.json();
  },
};