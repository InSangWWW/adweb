import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.div`
  border-top: 1px solid #eee;
  background-color: #fff;
`;

const NavBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const MenuSwiper = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    position: relative;
    white-space: nowrap;
    
    a {
      display: block;
      padding: 15px 20px;
      text-decoration: none;
      color: #333;
      
      &:hover {
        color: #702ffc;
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
