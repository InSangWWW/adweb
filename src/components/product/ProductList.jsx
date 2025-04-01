import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useProductsQuery } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/formatters';

const ProductListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    
    & > * {
      margin-bottom: 10px;
    }
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 768px) {
    font-size: 20px;
    width: 100%;
  }
`;

const TitleWrapper = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SortSelect = styled.select`
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 8px 10px;
  }
`;

// 데스크톱용 테이블
const DesktopTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    display: none; // 모바일에서는 숨김
  }
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

// 모바일용 리스트
const MobileList = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileProductItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const MobileProductHeader = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const MobileProductImage = styled.div`
  width: 80px;
  height: 80px;
  margin-right: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const MobileProductTitle = styled.div`
  flex: 1;
  
  h3 {
    margin: 0 0 5px 0;
    font-size: 16px;
    
    a {
      color: #333;
      text-decoration: none;
      
      &:hover {
        color: #702ffc;
      }
    }
  }
  
  p.price {
    margin: 5px 0;
    font-weight: bold;
    color: #702ffc;
    font-size: 16px;
  }
`;

const MobileProductDetails = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 15px;
  font-size: 14px;
  
  .label {
    color: #666;
    font-weight: 500;
  }
  
  .value {
    color: #333;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
`;

const ProductText = styled.div`
  p {
    margin: 0;
    font-size: 14px;
  }
  
  a {
    color: #333;
    text-decoration: none;
    
    &:hover {
      color: #702ffc;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  button {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      padding: 10px 15px; // 모바일에서 더 큰 터치 영역
    }
  }
  
  span {
    display: flex;
    align-items: center;
    margin: 0 10px;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
  color: #e53935;
`;//

const ProductList = ({ 
  categoryId = '', 
  categoryName = '상품 목록', 
  searchTerm = '',
}) => {
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState('');
  const { data, isLoading, error } = useProductsQuery(categoryId, searchTerm, page, 10, orderBy);

  const products = React.useMemo(() => data?.items || [], [data?.items]);
  const totalPages = React.useMemo(() => data?.total_pages || 1, [data?.total_pages]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo(0, 0);
  };

  const handleSortChange = (e) => {
    setOrderBy(e.target.value);
    setPage(1);
  };

  if (isLoading) return <LoadingSpinner>로딩 중...</LoadingSpinner>;
  if (error) return <ErrorMessage>에러 발생: {error.message}</ErrorMessage>;
  if (!products || products.length === 0) return <div>상품이 없습니다.</div>;

  return (
    <ProductListContainer>
      <ListHeader>
        <TitleWrapper>
          <Title>{categoryName}</Title>
        </TitleWrapper>
        <SortSelect value={orderBy} onChange={handleSortChange}>
          <option value="">기본</option>
          <option value="enter_date">신상품</option>
          <option value="high_price">높은가격순</option>
          <option value="row_price">낮은가격순</option>
        </SortSelect>
      </ListHeader>
      
      {/* 데스크톱용 테이블 */}
      <DesktopTable>
        <colgroup>
          <col style={{ width: '10%' }} />
          <col style={{ width: '15%' }} />
          <col />
          <col style={{ width: '12%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
        </colgroup>
        <thead>
          <tr>
            <TableHeader>제품사진</TableHeader>
            <TableHeader>제품코드</TableHeader>
            <TableHeader>제품명</TableHeader>
            <TableHeader>제공업체</TableHeader>
            <TableHeader>제조원</TableHeader>
            <TableHeader>제조구분</TableHeader>
            <TableHeader>판매가격</TableHeader>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.it_id} className="list">
              <TableCell>
                <Link to={`/product/${product.it_id}`}>
                  {product.images && product.images.length > 0 ? (
                    <ProductImage src={product.images[0]} alt={product.name} />
                  ) : (
                    <div>이미지 없음</div>
                  )}
                </Link>
              </TableCell>
              <TableCell>
                <ProductText>
                  <p><Link to={`/product/${product.it_id}`}>{product.it_id}</Link></p>
                </ProductText>
              </TableCell>
              <TableCell>
                <ProductText>
                  <p><Link to={`/product/${product.it_id}`}>{product.name}</Link></p>
                </ProductText>
              </TableCell>
              <TableCell>
                <ProductText>
                  <p>{product.durability || '가가온'}</p>
                </ProductText>
              </TableCell>
              <TableCell>
                <ProductText>
                  <p>{product.manufacturer || '제조사 정보 없음'}</p>
                </ProductText>
              </TableCell>
              <TableCell>
                <ProductText>
                  <p>{product.origin || (product.is_direct ? '국내' : '수입')}</p>
                </ProductText>
              </TableCell>
              <TableCell>
                <ProductText>
                  <p>{formatPrice(product.price)}원</p>
                </ProductText>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </DesktopTable>
      
      {/* 모바일용 리스트 */}
      <MobileList>
        {products.map((product) => (
          <MobileProductItem key={product.it_id}>
            <MobileProductHeader>
              <MobileProductImage>
                <Link to={`/product/${product.it_id}`}>
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <img src="https://via.placeholder.com/80" alt="이미지 없음" />
                  )}
                </Link>
              </MobileProductImage>
              <MobileProductTitle>
                <h3>
                  <Link to={`/product/${product.it_id}`}>{product.name}</Link>
                </h3>
                <p className="price">{formatPrice(product.price)}원</p>
              </MobileProductTitle>
            </MobileProductHeader>
            <MobileProductDetails>
              <div className="label">제품코드</div>
              <div className="value">{product.it_id}</div>
              
              <div className="label">제공업체</div>
              <div className="value">{product.durability || '가가온'}</div>
              
              <div className="label">제조원</div>
              <div className="value">{product.manufacturer || '제조사 정보 없음'}</div>
              
              <div className="label">제조구분</div>
              <div className="value">{product.origin || (product.is_direct ? '국내' : '수입')}</div>
            </MobileProductDetails>
          </MobileProductItem>
        ))}
      </MobileList>
      
      <Pagination>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          이전
        </button>
        <span>{page} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          다음
        </button>
      </Pagination>
    </ProductListContainer>
  );
};

export default ProductList;
