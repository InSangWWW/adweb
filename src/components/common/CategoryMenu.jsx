import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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
  
  const toggleCategory = (id) => {
    setOpenCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <CategoryContainer id="category-menu">
      <CategoryHead>
        <h3>카테고리</h3>
      </CategoryHead>
      <CategoryList>
        <li className="main">
          <Link to="/shop/list">전체</Link>
        </li>
        <li className={`main ${openCategories['10'] ? 'opened' : ''}`}>
          <Link to="/category/10">복지용구(구입)</Link>
          <button 
            type="button" 
            className="btn_toggle" 
            onClick={() => toggleCategory('10')}
          ></button>
          <ul className="sub depth2">
            <li><Link to="/category/10">전체</Link></li>
            <li><Link to="/category/1090">이동변기</Link></li>
            <li><Link to="/category/10b0">목욕의자</Link></li>
            <li><Link to="/category/1050">안전손잡이</Link></li>
            <li><Link to="/category/1020">미끄럼방지매트</Link></li>
            <li><Link to="/category/1030">미끄럼방지양말</Link></li>
            <li><Link to="/category/1010">간이변기</Link></li>
            <li><Link to="/category/10g0">지팡이</Link></li>
            <li><Link to="/category/1070">욕창예방매트리스</Link></li>
            <li><Link to="/category/1080">욕창예방방석</Link></li>
            <li><Link to="/category/10e0">자세변환용구</Link></li>
            <li><Link to="/category/1040">성인용보행기</Link></li>
            <li><Link to="/category/1060">요실금팬티</Link></li>
            <li><Link to="/category/10c0">경사로(실내)</Link></li>
          </ul>
        </li>
        <li className={`main ${openCategories['30'] ? 'opened' : ''}`}>
          <Link to="/category/30">복지용구(대여)</Link>
          <button 
            type="button" 
            className="btn_toggle" 
            onClick={() => toggleCategory('30')}
          ></button>
          <ul className="sub depth2">
            <li><Link to="/category/30">전체</Link></li>
            <li><Link to="/category/3010">수동휠체어</Link></li>
            <li><Link to="/category/3020">전동침대</Link></li>
            <li><Link to="/category/3040">욕창예방매트리스</Link></li>
            <li><Link to="/category/3050">이동욕조</Link></li>
          </ul>
        </li>
        <li className={`main ${openCategories['40'] ? 'opened' : ''}`}>
          <Link to="/category/40">비급여상품</Link>
          <button 
            type="button" 
            className="btn_toggle" 
            onClick={() => toggleCategory('40')}
          ></button>
          <ul className="sub depth2">
            <li><Link to="/category/40">전체</Link></li>
            <li><Link to="/category/40g0">환자식</Link></li>
            <li><Link to="/category/40f0">배변보조용품</Link></li>
            <li><Link to="/category/4020">보행보조용품</Link></li>
            <li><Link to="/category/4030">생활지원용품</Link></li>
            <li><Link to="/category/4050">의료용품</Link></li>
            <li><Link to="/category/4070">욕창용품</Link></li>
            <li><Link to="/category/4060">보장구</Link></li>
            <li><Link to="/category/40a0">기타</Link></li>
          </ul>
        </li>
      </CategoryList>
    </CategoryContainer>
  );
};

export default CategoryMenu;
