import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Noto Sans KR', sans-serif;
    color: #333;
    line-height: 1.6;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  button {
    cursor: pointer;
  }
  
  ul, ol {
    list-style: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #000000; /* 보라색에서 검정색으로 변경 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      background-color: #333333; /* 호버 색상도 어두운 회색으로 변경 */
    }
  }
  
  .hidden {
    display: none;
  }
`;

export default GlobalStyles;
