import axios from 'axios';

// 가가온 API 설정
const GAGAON_API_URL = 'https://gagaon.com/api/external/items.php';
const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'X-Auth-Id': 'dongbang',
  'X-Auth-Key': 'dgm8gctb5c3xusmqtkevivs1cr82swru'
};

// 스크래핑 데이터 API 설정
const SCRAPED_API_URL = 'http://localhost:3001/api';

// 가가온 API 인스턴스
const gagaonApi = axios.create({
  baseURL: GAGAON_API_URL,
  headers: AUTH_HEADERS
});

// 스크래핑 데이터 API 인스턴스
const scrapedApi = axios.create({
  baseURL: SCRAPED_API_URL
});

// 기존 인터셉터 및 API 호출 함수 유지
gagaonApi.interceptors.request.use(request => {
  console.log('가가온 API 요청:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data,
    params: request.params
  });
  return request;
});

gagaonApi.interceptors.response.use(response => {
  console.log('가가온 API 응답:', {
    status: response.status,
    statusText: response.statusText,
    data: response.data
  });
  return response;
});

// 공통 API 호출 함수
const callGagaonApi = async (params) => {
  try {
    const response = await gagaonApi.post('', params);
    return response.data;
  } catch (error) {
    console.error('가가온 API 호출 실패:', error);
    throw error;
  }
};

// 기존 함수들 유지
export const fetchProducts = async (searchField = 'it_name', searchTerm = '', page = 1, limit = 10) => {
  try {
    const params = {
      page: page,
      limit: limit
    };
    
    if (searchField && searchTerm) {
      params.sfl = searchField;
      params.stx = searchTerm;
    }
    
    const data = await callGagaonApi(params);
    console.log('상품 목록 응답:', data);
    return data;
  } catch (error) {
    console.error('상품 데이터 가져오기 실패:', error);
    throw error;
  }
};

export const fetchProductDetail = async (productId) => {
  console.log('Fetching product with ID:', productId);
  
  try {
    const data = await callGagaonApi({
      sfl: 'it_id',
      stx: productId,
      page: 1,
      limit: 1
    });
    
    console.log('상품 상세 응답:', data);

    if (data.items && data.items.length > 0) {
      const exactMatch = data.items.find(item => item.it_id === String(productId));
      
      if (exactMatch) {
        return exactMatch;
      }
      
      return data.items[0];
    }
    
    throw new Error('상품을 찾을 수 없습니다.');
  } catch (error) {
    console.error('상품 상세 정보 가져오기 실패:', error);
    throw error;
  }
};

export const fetchCategoryProducts = async (categoryId, page = 1, limit = 10) => {
  try {
    const data = await callGagaonApi({
      sfl: "ca_id",
      stx: categoryId,
      page: page,
      limit: limit
    });
    console.log('카테고리 상품 응답:', data);
    return data;
  } catch (error) {
    console.error('카테고리 상품 가져오기 실패:', error);
    throw error;
  }
};

export const fetchExactProductDetail = async (productId) => {
  console.log('Fetching exact product with ID:', productId);
  
  try {
    const data = await callGagaonApi({
      sfl: 'it_id',
      stx: `^${productId}$`,
      page: 1,
      limit: 1
    });
    
    console.log('정확한 상품 상세 응답:', data);

    if (data.items && data.items.length > 0) {
      return data.items[0];
    }
    
    throw new Error('상품을 찾을 수 없습니다.');
  } catch (error) {
    console.error('정확한 상품 상세 정보 가져오기 실패:', error);
    throw error;
  }
};

// 스크래핑 데이터 API 함수 추가
export const fetchCategories = async () => {
  try {
    const response = await scrapedApi.get('/categories');
    return response.data;
  } catch (error) {
    console.error('카테고리 목록 가져오기 실패:', error);
    throw error;
  }
};

export const fetchScrapedCategoryProducts = async (categoryId, page = 1, limit = 10, orderBy = '') => {
  try {
    const response = await scrapedApi.get(`/categories/${categoryId}/items`, {
      params: { page, limit, orderBy }
    });
    return response.data;
  } catch (error) {
    console.error('스크래핑 카테고리 상품 가져오기 실패:', error);
    throw error;
  }
};

// MongoDB ObjectId 형식인지 확인하는 유틸리티 함수
export const isMongoObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export default {
  fetchProducts,
  fetchProductDetail,
  fetchCategoryProducts,
  fetchExactProductDetail,
  fetchCategories,
  fetchScrapedCategoryProducts,
  isMongoObjectId
};
