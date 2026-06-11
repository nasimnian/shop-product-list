const BASE_URL = 'https://dummyjson.com';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${BASE_URL}/products?limit=100`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data: ProductsResponse = await res.json();
  return data.products;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query) return fetchAllProducts();
  const res = await fetch(`${BASE_URL}/products/search?q=${query}&limit=100`);
  if (!res.ok) throw new Error('Failed to search products');
  const data: ProductsResponse = await res.json();
  return data.products;
};

export const fetchCategories = async (): Promise<string[]> => {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};