import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useScrapedProducts'; // 새로 추가한 훅

const LeftSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: categories, isLoading, error } = useCategories(); // 스크래핑 데이터 사용

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 카테고리 데이터 로딩 중이거나 오류 발생 시 처리
  if (isLoading) return <div>카테고리 로딩 중...</div>;
  if (error) return <div>카테고리를 불러올 수 없습니다.</div>;

  return (
    <>
      {/* 햄버거 메뉴 버튼 (모바일 전용) */}
      <HamburgerMenu onClick={toggleSidebar}>
        <span />
        <span />
        <span />
      </HamburgerMenu>

      {/* 사이드바 */}
      <StyledSidebar isOpen={isSidebarOpen}>
        <CssMenu id="cssmenu">
          <ul>
            <li className="active_title">제품소개</li>
            <li className="active has-sub">
              <p className="on">
                <Link to="/category/3">복지용구</Link>
              </p>
              <ul className="submenu">
                {/* 스크래핑한 카테고리 데이터 사용 */}
                {categories.map(category => (
                  <li key={category._id} className="lmenu">
                    <Link to={`/category/${category._id}`}>
                      <span>{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </CssMenu>
      </StyledSidebar>

      {/* 배경 오버레이 (사이드바 열릴 때만 표시) */}
      {isSidebarOpen && <Overlay onClick={toggleSidebar} />}
    </>
  );
};


// Styled Components 정의
const StyledSidebar = styled.div`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-250px')}; /* 열릴 때는 0, 닫힐 때는 화면 밖으로 이동 */
  width: 250px;
  height: 100%;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease-in-out;
  z-index: 100;
  overflow-y: auto; /* 내용이 많을 경우 스크롤 가능하도록 */

  @media (min-width: 768px) {
    position: static;
    width: 200px;
    height: auto;
    box-shadow: none;
    transition: none;
    left: auto; /* 데스크톱에서는 항상 보임 */
    top: auto;
    z-index: auto;
    overflow-y: visible;
  }
`;

const CssMenu = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .active_title {
    background-color: #000;
    color: #fff;
    padding: 15px;
    font-weight: bold;
    text-align: center;
  }

  p.on {
    background-color: #f5f5f5;
    padding: 10px;
    margin: 0;
    border: 1px solid #ddd;

    a {
      text-decoration: none;
      color: #333;
      font-weight: bold;
      display: block;
    }
  }

  .submenu {
    border-bottom: 1px solid #ddd;
    padding: 0;

    .lmenu {
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;

      a {
        display: block;
        padding: 10px 15px;
        text-decoration: none;
        color: #333;

        &:hover {
          background-color: #f9f9f9;
        }
      }
    }
  }
`;

const HamburgerMenu = styled.div`
  display: none; /* 기본적으로 햄버거 메뉴 숨김 */
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 101;

  @media (max-width: 767px) {
    display: flex; /* 모바일에서만 햄버거 메뉴 표시 */
  }

  span {
    display: block;
    height: 3px;
    background-color: #333;
    border-radius: 2px;

    &:nth-child(2) {
      width: calc(100% - 6px);
      margin-left: auto;
    }

    &:nth-child(3) {
      width: calc(100% - 12px);
      margin-left: auto;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: none;

  @media (max-width: 767px) {
    display: block;
  }
`;

export default LeftSidebar;
