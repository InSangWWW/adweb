import React from 'react';
import styled from 'styled-components';
import LeftSidebar from './LeftSidebar';

const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
`;

const MainContent = styled.div`
  flex: 1;
  padding-left: 20px;
`;

const MainLayout = ({ children }) => {
  return (
    <MainContainer>
      <LeftSidebar />
      <MainContent>{children}</MainContent>
    </MainContainer>
  );
};

export default MainLayout;
