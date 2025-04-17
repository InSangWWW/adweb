// hooks/useProducts.js
import { useQuery } from "@tanstack/react-query";
import { fetchCategoryProducts, fetchProductDetail, fetchProducts } from "../api/gagaApi";
import { useScrapedProductsQuery } from "./useScrapedProducts";

export const useProductsQuery = (categoryId = '', searchTerm = '', page = 1, limit = 10, orderBy = '') => {
  // MongoDB ObjectId 형식인지 확인 (24자리 16진수)
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(categoryId);
  
  // 스크래핑 데이터 사용 (MongoDB ObjectId인 경우)
  const scrapedQuery = useScrapedProductsQuery(
    isMongoId ? categoryId : null, 
    page, 
    limit, 
    orderBy
  );
  
  // API 데이터 사용 (MongoDB ObjectId가 아닌 경우)
  const apiQuery = useQuery({
    queryKey: ['products', categoryId, searchTerm, page, limit, orderBy],
    queryFn: () => {
      if (!isMongoId && categoryId) {
        // 가가온 카테고리 ID로 API 호출
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
    cacheTime: 5 * 60 * 1000,
    enabled: !isMongoId || !categoryId
  });
  
  // MongoDB ObjectId인 경우 스크래핑 데이터 반환, 아니면 API 데이터 반환
  return isMongoId ? scrapedQuery : apiQuery;
};

// 상품 상세 정보는 기존 API 그대로 사용
export const useProductDetailQuery = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await fetchProductDetail(productId);
      console.log('Product Detail Response:', response);
      return response;
    },
    enabled: !!productId
  });
};
