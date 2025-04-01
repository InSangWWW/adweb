import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  border-bottom: 1px solid #eee;
  width: 100%;
  
  .top_border {
    height: 3px;
    background-color: #000000;
  }
  
  /* 스크롤 시 고정 기능 제거 */
`;

const NavTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const LogoWrap = styled.div`
  margin-bottom: 15px;
  text-align: center;
  
  .logo {
    font-size: 28px;
    font-weight: bold;
    color: #000000;
    text-decoration: none;
  }
  
  @media (max-width: 768px) {
    .logo {
      font-size: 24px;
    }
  }
`;

const SearchWrap = styled.form`
  display: flex;
  width: 60%;
  margin-bottom: 15px;
  
  select, input, button {
    padding: 10px 12px;
    border: 1px solid #ddd;
  }
  
  select {
    @media (max-width: 480px) {
      display: none; /* 모바일에서는 카테고리 선택 숨김 */
    }
  }
  
  input {
    flex-grow: 1;
    margin: 0 10px;
    
    @media (max-width: 480px) {
      margin: 0 5px 0 0;
    }
  }
  
  button {
    background-color: #000000;
    color: white;
    border: none;
    cursor: pointer;
    
    @media (max-width: 480px) {
      padding: 10px;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;


const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert('검색어를 입력해 주세요.');
      return;
    }
    
    if (category) {
      navigate(`/search?ca_id=${category}&q=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  return (
    <HeaderContainer id="header">
      <div className="top_border"></div>
      <div className="nav">
        <NavTop>
          <LogoWrap>
            <Link to="/" className="logo">LTC 돌봄</Link>
          </LogoWrap>
          
          <SearchWrap onSubmit={handleSearch}>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">전체 카테고리</option>
              <option value="10">복지용구(구입)</option>
              <option value="30">복지용구(대여)</option>
              <option value="40">비급여상품</option>
            </select>
            <input 
              type="text" 
              placeholder="키워드 입력하기.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">검색</button>
          </SearchWrap>
          
      
        </NavTop>
      </div>
    </HeaderContainer>
  );
};

export default Header;
