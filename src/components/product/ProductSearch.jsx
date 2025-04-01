import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductList from './ProductList';

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const SearchHeader = styled.div`
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
  }
`;

const ProductSearch = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const categoryId = searchParams.get('ca_id') || '';
  
  return (
    <SearchContainer>
      <SearchHeader>
        <h1>검색 결과: "{query}"</h1>
        <p>검색어와 관련된 상품을 확인하세요</p>
      </SearchHeader>
      
      <ProductList searchTerm={query} categoryId={categoryId} />
    </SearchContainer>
  );
};

export default ProductSearch;
