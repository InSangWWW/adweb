import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { useProductDetailQuery } from '../../hooks/useProducts'; 
import { formatPrice } from '../../utils/formatters';

const ProductDetail = () => {
  const { productId } = useParams();
  const [selectedOption, setSelectedOption] = useState('');
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // productId를 useProductDetailQuery에 전달
  const { data: product, isLoading, error } = useProductDetailQuery(productId);
  
  // 화면 크기 변경 감지를 위한 useEffect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Swiper 업데이트를 위한 useEffect
  useEffect(() => {
    if (mainSwiper) {
      mainSwiper.update();
    }
    if (thumbsSwiper) {
      thumbsSwiper.update();
    }
  }, [mainSwiper, thumbsSwiper, product]);
  
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;
  
  return (
    <DetailContainer>
      <ProductHeader>
        <ImageGalleryWrapper>
          <ImageGallery>
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              thumbs={!isMobile ? { swiper: thumbsSwiper } : undefined}
              className="swiper-main"
              onSwiper={setMainSwiper}
              slidesPerView={1}
              observer={true}
              observeParents={true}
              resizeObserver={true}
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img src={image} alt={`${product.name} 이미지 ${index + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {!isMobile && (
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                watchSlidesProgress
                slidesPerView={4}
                spaceBetween={10}
                className="swiper-thumbnails"
                observer={true}
                observeParents={true}
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={image} alt={`${product.name} 썸네일 ${index + 1}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </ImageGallery>
        </ImageGalleryWrapper>
        
        <ProductInfo>
          <Title>{product.name}</Title>
          
          <PriceInfo>
            <span className="price">{formatPrice(product.price)}원</span>
            {product.is_rental && <span className="rental">(월대여료)</span>}
          </PriceInfo>
          
          <DeliveryInfo>
            <p>배송: {product.delivery}</p>
          </DeliveryInfo>
          
          {product.oop_rates && (
            <OopInfo>
              <h3>본인부담금</h3>
              <div className="rates">
                {product.oop_rates.map((rate, index) => (
                  <span key={index}>{rate.percent}%({formatPrice(rate.amount)}원)</span>
                ))}
              </div>
            </OopInfo>
          )}
          
          {product.options && product.options.length > 0 && (
            <OptionSelect>
              <h3>옵션 선택</h3>
              <select value={selectedOption} onChange={handleOptionChange}>
                <option value="">- 옵션을 선택하세요 -</option>
                {product.options.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name} {option.price > 0 ? `(+${formatPrice(option.price)}원)` : ''}
                  </option>
                ))}
              </select>
            </OptionSelect>
          )}
          <ExternalLinkButton 
            href={`https://gagaon.com/shop/item.php?it_id=${productId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            가가온 사이트에서 보기
          </ExternalLinkButton>
        </ProductInfo>
      </ProductHeader>
      
      <ProductDescription>
        <h2>상품 상세 정보</h2>
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </ProductDescription>
    </DetailContainer>
  );
};

const DetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  overflow-x: hidden; /* 가로 방향 오버플로우 방지 */
`;

const ProductHeader = styled.div`
  display: flex;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageGalleryWrapper = styled.div`
  width: 50%;
  margin-right: 40px;
  overflow: hidden; /* 중요: 이미지 갤러리가 넘치지 않도록 함 */
  
  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const ImageGallery = styled.div`
  width: 100%;
  
  .swiper-main {
    width: 100%;
    height: 400px;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      height: 300px; /* 모바일에서는 높이 줄임 */
      margin-bottom: 0; /* 썸네일이 없으므로 하단 여백 제거 */
    }
    
    .swiper-slide {
      width: 100% !important;
      display: flex;
      justify-content: center;
      align-items: center;
      
      img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
      }
    }
  }
  
  .swiper-thumbnails {
    height: 80px;
    
    .swiper-slide {
      opacity: 0.4;
      cursor: pointer;
      width: auto !important;
      
      &.swiper-slide-thumb-active {
        opacity: 1;
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    @media (max-width: 768px) {
      display: none; /* 모바일에서 썸네일 숨김 */
    }
  }
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const PriceInfo = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  
  .price {
    font-size: 24px;
    font-weight: bold;
    color: #702ffc;
  }
  
  .rental {
    font-size: 14px;
    color: #666;
    margin-left: 10px;
  }
`;

const DeliveryInfo = styled.div`
  margin-bottom: 20px;
  
  p {
    margin: 5px 0;
    font-size: 14px;
    color: #666;
  }
`;

const OopInfo = styled.div`
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .rates {
    display: flex;
    flex-wrap: wrap;
    
    span {
      margin-right: 15px;
      margin-bottom: 5px;
      font-size: 14px;
    }
  }
`;

const OptionSelect = styled.div`
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
  }
`;

const ProductDescription = styled.div`
  margin-top: 40px;
  
  h2 {
    font-size: 20px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
`;

const ExternalLinkButton = styled.a`
  display: inline-block;
  padding: 10px 15px;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export default ProductDetail;
