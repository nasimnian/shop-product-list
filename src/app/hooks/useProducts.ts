import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts, searchProducts, fetchCategories, Product } from '@/app/api/products';

export const useProducts = (searchQuery: string) => {
  return useQuery({
    queryKey: ['products', searchQuery],
    queryFn: () => searchProducts(searchQuery),
    staleTime: 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 60 * 1000,
  });
};