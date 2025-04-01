import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useProductsQuery } from '../hooks/useProducts';
import { formatPrice } from '../utils/formatters';
import ProductList from '../components/product/ProductList';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px;
`;

const Section = styled.div`
  margin-bottom: 60px;
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Section>
        <ProductList categoryName="전체 상품" isHomePage={true} />
      </Section>
    </HomeContainer>
  );
};

export default HomePage;
