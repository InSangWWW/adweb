// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './components/product/ProductDetail';
import ProductSearch from './components/product/ProductSearch';
import styled from 'styled-components';
import LeftSidebar from './components/common/LeftSidebar';

const MainLayout = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
`;

const MainContent = styled.div`
  flex: 1;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyles />
        <Header />
        <Navigation />
        <MainLayout>
          <LeftSidebar />
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/search" element={<ProductSearch />} />
            </Routes>
          </MainContent>
        </MainLayout>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
