import { useQuery } from "@tanstack/react-query";
import { fetchCategoryProducts, fetchProductDetail, fetchProducts } from "../api/gagaApi";

export const useProductsQuery = (categoryId = '', searchTerm = '', page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['products', categoryId, searchTerm, page, limit],
    queryFn: () => {
      console.log('Query function called with:', { categoryId, searchTerm, page, limit });
      
      if (categoryId) {
        // 카테고리 ID가 있으면 카테고리별 상품 조회
        return fetchCategoryProducts(categoryId, page, limit);
      } else if (searchTerm) {
        // 검색어가 있으면 검색 결과 조회
        return fetchProducts('it_name', searchTerm, page, limit);
      } else {
        // 둘 다 없으면 전체 상품 조회
        return fetchProducts('', '', page, limit);
      }
    },
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 5 * 60 * 1000
  });
};

export const useProductDetailQuery = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetchProductDetail(productId);
      console.log('Product Detail Response:', response); // 응답 로깅
      return response;
    },
    enabled: !!productId
  });
};
