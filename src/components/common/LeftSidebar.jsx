import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
                <li className="lmenu"><Link to="/category/3020"><span>전동침대</span></Link></li>
                <li className="lmenu"><Link to="/category/3010"><span>수동휠체어</span></Link></li>
                <li className="lmenu"><Link to="/category/3040"><span>욕창예방매트리스</span></Link></li>
                <li className="lmenu"><Link to="/category/1080"><span>욕창예방방석</span></Link></li>
                <li className="lmenu"><Link to="/category/1040"><span>성인용보행기</span></Link></li>
                <li className="lmenu"><Link to="/category/1090"><span>이동변기</span></Link></li>
                <li className="lmenu"><Link to="/category/10b0"><span>목욕의자</span></Link></li>
                <li className="lmenu"><Link to="/category/3050"><span>이동욕조</span></Link></li>
                <li className="lmenu"><Link to="/category/10g0"><span>지팡이</span></Link></li>
                <li className="lmenu"><Link to="/category/1010"><span>간이변기</span></Link></li>
                <li className="lmenu"><Link to="/category/10e0"><span>자세변환용구</span></Link></li>
                <li className="lmenu"><Link to="/category/1050"><span>안전손잡이</span></Link></li>
                <li className="lmenu"><Link to="/category/1020"><span>미끄럼방지매트</span></Link></li>
                <li className="lmenu"><Link to="/category/1060"><span>요실금팬티</span></Link></li>
                <li className="lmenu"><Link to="/category/1030"><span>미끄럼방지양말</span></Link></li>
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
