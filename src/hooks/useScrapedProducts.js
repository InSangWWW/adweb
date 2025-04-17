// hooks/useScrapedProducts.js
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // 백엔드 API URL

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    }
  });
};

export const useScrapedProductsQuery = (categoryId, page = 1, limit = 10, orderBy = '') => {
  return useQuery({
    queryKey: ['scrapedProducts', categoryId, page, limit, orderBy],
    queryFn: async () => {
      if (!categoryId) return { items: [], total_pages: 0, total_items: 0 };
      
      const response = await axios.get(
        `${API_BASE_URL}/categories/${categoryId}/items`,
        { params: { page, limit, orderBy } }
      );
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
    enabled: !!categoryId
  });
};
