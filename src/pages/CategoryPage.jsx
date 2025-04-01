import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ProductList from '../components/product/ProductList';

const CategoryContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding : 0px;
`;

// 카테고리 이름 매핑
const categoryNames = {
    '10': '복지용구(구입)',
    '30': '복지용구(대여)',
    '40': '비급여상품',
    '1090': '이동변기',
    '10b0': '목욕의자',
    '1050': '안전손잡이',
    '1020': '미끄럼방지매트',
    '1030': '미끄럼방지양말',
    '1010': '간이변기',
    '10g0': '지팡이',
    '1070': '욕창예방매트리스',
    '1080': '욕창예방방석',
    '10e0': '자세변환용구',
    '1040': '성인용보행기',
    '1060': '요실금팬티',
    '10c0': '경사로(실내)',
    '3010': '수동휠체어',
    '3020': '전동침대',
    '3040': '욕창예방매트리스',
    '3050': '이동욕조',
    '40g0': '환자식',
    '40f0': '배변보조용품',
    '4020': '보행보조용품',
    '4030': '생활지원용품',
    '4050': '의료용품',
    '4070': '욕창용품',
    '4060': '보장구',
    '40a0': '기타'
};

const CategoryPage = () => {
    const {categoryId} = useParams();
    const [categoryName, setCategoryName] = useState('');

    useEffect(()=>{
        // 카테고리 이름 설정
        setCategoryName(categoryNames[categoryId] || '상품 목록');
    }, [categoryId]);

    return(
        <CategoryContainer>
            <ProductList 
                categoryId={categoryId} 
                categoryName={categoryName} 
            />
        </CategoryContainer>
    )
}

export default CategoryPage;
