import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.div`
  border-top: 1px solid #eee;
  background-color: #fff;
  width: 100%;
  overflow: hidden;
`;

const NavBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  
  @media (max-width: 768px) {
    justify-content: flex-start; // 모바일에서는 왼쪽 정렬로 변경
    padding: 0 10px; // 모바일에서 좌우 패딩 추가
  }
`;

const MenuSwiper = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch; // 모바일에서 부드러운 스크롤 지원
  width: 100%; // 전체 너비 사용
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    
    @media (max-width: 768px) {
      width: 100%; // 모바일에서 전체 너비 사용
      justify-content: flex-start; // 모바일에서는 왼쪽 정렬
    }
  }
  
  li {
    position: relative;
    white-space: nowrap;
    flex-shrink: 0; // 항목이 축소되지 않도록 설정
    
    a {
      display: block;
      padding: 15px 20px;
      text-decoration: none;
      color: #333;
      
      &:hover {
        color: #702ffc;
      }
      
      @media (max-width: 480px) {
        padding: 15px 15px; // 모바일에서 좌우 패딩 약간 줄임
      }
    }
  }
`;

const Navigation = () => {
  return (
    <NavContainer>
      <NavBottom>
        <MenuSwiper>
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/category/10">복지용구(구입)</Link>
            </li>
            <li>
              <Link to="/category/30">복지용구(대여)</Link>
            </li>
            <li>
              <Link to="/category/40">비급여상품</Link>
            </li>
          </ul>
        </MenuSwiper>
      </NavBottom>
    </NavContainer>
  );
};

export default Navigation;
