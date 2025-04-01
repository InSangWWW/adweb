import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: #f8f8f8;
  padding: 30px 20px;
  margin-top: 50px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const BtnWrap = styled.div`
  margin-bottom: 20px;
  
  a {
    margin-right: 15px;
    color: #333;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Info = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
  
  span {
    margin-right: 10px;
  }
  
  .divider {
    margin: 0 5px;
  }
  
  @media (max-width: 768px) {
    .pc_only {
      display: none;
    }
  }
`;

const Contact = styled.div`
  margin-bottom: 20px;
  
  p {
    margin: 5px 0;
    font-size: 14px;
    
    a {
      color: #666;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const Other = styled.div`
  font-size: 13px;
  color: #888;
  
  p {
    margin: 3px 0;
  }
`;

const Copyright = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 20px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Content>
        <Logo>복지용품 편집샵</Logo>
        <BtnWrap>
          <Link to="/privacy">개인정보처리방침</Link>
          <Link to="/terms">이용약관</Link>
        </BtnWrap>
        <Info>
          <span>(주)회사회사사</span>
          <span className="divider">/</span>
          <span>대표이사. 홍길동</span>
          <span className="divider pc_only">/</span>
          <span>주소. 서울특별시 관악구 구디대로 123 4층 567호</span>
          <span className="divider pc_only">/</span><br />
          <span>물류센터. 경기도 김포시 양촌읍 황금산단4로 15</span>
        </Info>
        <Contact>
          <p>EMAIL. <a href="mailto:info@example.com">info@example.com</a></p>
          <p>TEL. <a href="tel:02-123-4567">02-123-4567</a></p>
        </Contact>
        <Other>
          <p>사업자등록번호: 123-45-67890</p>
          <p>통신판매업신고번호: 제2025-서울서초-1234호</p>
          <p>개인정보관리자: 홍길동</p>
          <p>호스팅제공자: (주)회사회사</p>
        </Other>
        <Copyright>Copyright © 2025 LTC 돌봄봄 All Right Reserved.</Copyright>
      </Content>
    </FooterContainer>
  );
};

export default Footer;
