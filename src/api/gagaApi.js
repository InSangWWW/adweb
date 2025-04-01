import axios from 'axios';

const API_URL = 'https://gagaon.com/api/external/items.php';
const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'X-Auth-Id': process.env.REACT_APP_X_AUTH_ID,
  'X-Auth-Key': process.env.REACT_APP_X_AUTH_KEY
};

// API 호출을 위한 인스턴스 생성
const gagaonApi = axios.create({
  baseURL: API_URL,
  headers: AUTH_HEADERS
});

// 요청 인터셉터 추가 - 서버로 보내는 API 요청 데이터 확인용
gagaonApi.interceptors.request.use(request => {
  console.log('서버로 보내는 API 요청:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data,
    params: request.params
  });
  return request;
});

// 응답 인터셉터 추가 - 서버에서 받는 응답 데이터 확인용
gagaonApi.interceptors.response.use(response => {
  console.log('서버에서 받은 API 응답:', {
    status: response.status,
    statusText: response.statusText,
    data: response.data
  });
  return response;
});

// 공통 API 호출 함수
const callApi = async (params) => {
  try {
    // POST 요청으로 통일 - 서버가 body 데이터를 처리하는 방식
    const response = await gagaonApi.post('', params);
    return response.data;
  } catch (error) {
    console.error('API 호출 실패:', error);
    throw error;
  }
};

export const fetchProducts = async (searchField = 'it_name', searchTerm = '', page = 1, limit = 10) => {
  try {
    const params = {
      page: page,
      limit: limit
    };
    
    // 검색 필드와 검색어가 있는 경우에만 추가
    if (searchField && searchTerm) {
      params.sfl = searchField;
      params.stx = searchTerm;
    }
    
    const data = await callApi(params);
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
    const data = await callApi({
      sfl: 'it_id',
      stx: productId,
      page: 1,
      limit: 1
    });
    
    console.log('상품 상세 응답:', data);

    if (data.items && data.items.length > 0) {
      // 정확히 일치하는 상품 찾기
      const exactMatch = data.items.find(item => item.it_id === String(productId));
      
      if (exactMatch) {
        return exactMatch;
      }
      
      // 정확히 일치하는 상품이 없으면 첫 번째 상품 반환
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
    const data = await callApi({
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

// 정규식을 사용한 정확한 상품 검색 함수 추가
export const fetchExactProductDetail = async (productId) => {
  console.log('Fetching exact product with ID:', productId);
  
  try {
    const data = await callApi({
      sfl: 'it_id',
      stx: `^${productId}$`, // 정규식으로 정확히 일치하는 항목만 검색
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

export default {
  fetchProducts,
  fetchProductDetail,
  fetchCategoryProducts,
  fetchExactProductDetail
};
