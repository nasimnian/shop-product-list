import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/infrastructure/api/productsApi';

export const useProducts = (searchQuery: string = '') => {
  return useQuery({
    queryKey: ['products', searchQuery],
    queryFn: () => searchQuery 
      ? productsApi.searchProducts(searchQuery) 
      : productsApi.getAllProducts(),
    select: (data) => data.products,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });
};