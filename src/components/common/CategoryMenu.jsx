import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCategories } from '../hooks/useScrapedProducts'; // 새로 추가한 훅

const CategoryContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 100;
  width: 250px;
  border: 1px solid #eee;
`;

const CategoryHead = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
    font-size: 16px;
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    border-bottom: 1px solid #f5f5f5;
    
    &.main {
      position: relative;
      
      > a {
        padding: 12px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-decoration: none;
        color: #333;
        
        &:hover {
          background-color: #f9f9f9;
          color: #702ffc;
        }
      }
      
      .btn_toggle {
        position: absolute;
        right: 15px;
        top: 12px;
        width: 20px;
        height: 20px;
        border: none;
        background: none;
        cursor: pointer;
        
        &::before {
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          border-right: 1px solid #999;
          border-bottom: 1px solid #999;
          transform: rotate(-45deg);
        }
      }
      
      &.opened {
        > .btn_toggle::before {
          transform: rotate(45deg);
        }
        
        > ul {
          display: block;
        }
      }
    }
    
    &.on > a {
      color: #702ffc;
      font-weight: bold;
    }
    
    ul.sub {
      display: none;
      padding: 0;
      margin: 0;
      background-color: #f9f9f9;
      
      li a {
        padding: 10px 15px 10px 30px;
        display: block;
        text-decoration: none;
        color: #333;
        
        &:hover {
          color: #702ffc;
        }
      }
    }
  }
`;

const CategoryMenu = () => {
  const [openCategories, setOpenCategories] = useState({});
  const { data: categories, isLoading, error } = useCategories(); // 스크래핑 데이터 사용
  
  // 메인 카테고리 그룹화 (caId 기준)
  const groupedCategories = React.useMemo(() => {
    if (!categories) return {};
    
    // 카테고리 ID 앞 두 자리로 그룹화
    return categories.reduce((acc, category) => {
      const mainId = category.caId.substring(0, 2);
      if (!acc[mainId]) {
        acc[mainId] = [];
      }
      acc[mainId].push(category);
      return acc;
    }, {});
  }, [categories]);
  
  const toggleCategory = (id) => {
    setOpenCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>카테고리를 불러올 수 없습니다.</div>;
  
  return (
    <CategoryContainer id="category-menu">
      <CategoryHead>
        <h3>카테고리</h3>
      </CategoryHead>
      <CategoryList>
        <li className="main">
          <Link to="/shop/list">전체</Link>
        </li>
        
        {/* 복지용구(구입) */}
        <li className={`main ${openCategories['10'] ? 'opened' : ''}`}>
          <Link to="/category/10">복지용구(구입)</Link>
          <button 
            type="button" 
            className="btn_toggle" 
            onClick={() => toggleCategory('10')}
          ></button>
          <ul className="sub depth2">
            <li><Link to="/category/10">전체</Link></li>
            {groupedCategories['10']?.map(category => (
              <li key={category._id}>
                <Link to={`/category/${category._id}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </li>
        
        {/* 복지용구(대여) */}
        <li className={`main ${openCategories['30'] ? 'opened' : ''}`}>
          <Link to="/category/30">복지용구(대여)</Link>
          <button 
            type="button" 
            className="btn_toggle" 
            onClick={() => toggleCategory('30')}
          ></button>
          <ul className="sub depth2">
            <li><Link to="/category/30">전체</Link></li>
            {groupedCategories['30']?.map(category => (
              <li key={category._id}>
                <Link to={`/category/${category._id}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </li>
        
        {/* 비급여상품 */}
        <li className={`main ${openCategories['40'] ? 'opened' : ''}`}>
          <Link to="/category/40">비급여상품</Link>
          <button 
            type="button" 
            className="btn_toggle" 
            onClick={() => toggleCategory('40')}
          ></button>
          <ul className="sub depth2">
            <li><Link to="/category/40">전체</Link></li>
            {groupedCategories['40']?.map(category => (
              <li key={category._id}>
                <Link to={`/category/${category._id}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </li>
      </CategoryList>
    </CategoryContainer>
  );
};

export default CategoryMenu;
