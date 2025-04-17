const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// MongoDB 모델 정의 - 상품 정보용
const welfareItemSchema = new mongoose.Schema({
  productCode: String,
  name: String,
  price: Number,
  discountRates: {
    rate15: Number,
    rate9: Number,
    rate6: Number
  },
  imageUrl: String,
  material: String,
  size: String,
  weight: String,
  boxQuantity: String,
  shippingInfo: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'WelfareCategory' }, // 카테고리 참조
  updatedAt: { type: Date, default: Date.now }
});

// MongoDB 모델 정의 - 카테고리 정보용
const welfareCategorySchema = new mongoose.Schema({
  name: String,
  caId: String,
  url: String,
  updatedAt: { type: Date, default: Date.now }
});

const WelfareItem = mongoose.model('WelfareItem', welfareItemSchema);
const WelfareCategory = mongoose.model('WelfareCategory', welfareCategorySchema);

// 서브 카테고리만 추출하는 함수
async function getSubCategories() {
  try {
    console.log('서브 카테고리 정보 추출 시작...');
    
    const response = await axios.get('https://gagaon.com/shop/list.php', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const subCategories = [];
    
    // 모든 서브 카테고리 추출 (전체 항목 제외)
    $('.shop_category .pc .list .main .sub.depth2 > li').each((index, element) => {
      const name = $(element).find('> a').text().trim();
      const url = $(element).find('> a').attr('href');
      
      // '전체' 항목 제외
      if (name !== '전체' && url) {
        // URL에서 ca_id 추출
        const match = url.match(/ca_id=([^&]+)/);
        const caId = match ? match[1] : null;
        
        subCategories.push({
          name: name,
          url: url.startsWith('http') ? url : `https://gagaon.com${url.startsWith('/') ? '' : '/'}${url}`,
          caId: caId
        });
      }
    });
    
    console.log(`${subCategories.length}개의 서브 카테고리 정보 추출 완료`);
    
    // MongoDB에 카테고리 정보 저장
    for (const category of subCategories) {
      // 이미 존재하는 카테고리인지 확인
      const existingCategory = await WelfareCategory.findOne({ caId: category.caId });
      
      if (existingCategory) {
        // 업데이트
        await WelfareCategory.updateOne(
          { caId: category.caId }, 
          { 
            name: category.name, 
            url: category.url, 
            updatedAt: new Date() 
          }
        );
        console.log(`카테고리 '${category.name}' 정보가 업데이트되었습니다.`);
        // 기존 카테고리 ID 설정
        category._id = existingCategory._id;
      } else {
        // 새로 저장
        const newCategory = new WelfareCategory({
          name: category.name,
          caId: category.caId,
          url: category.url,
          updatedAt: new Date()
        });
        const savedCategory = await newCategory.save();
        console.log(`카테고리 '${category.name}' 정보가 저장되었습니다.`);
        // 새 카테고리 ID 설정
        category._id = savedCategory._id;
      }
    }
    
    return subCategories;
  } catch (error) {
    console.error('서브 카테고리 정보 추출 오류:', error.message);
    return [];
  }
}

// 카테고리 페이지에서 상품 URL 추출 함수
async function getProductUrlsFromCategory(categoryUrl) {
  try {
    console.log(`카테고리 페이지 스크래핑 시작: ${categoryUrl}`);
    
    const response = await axios.get(categoryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const productUrls = [];
    
    // 상품 링크 추출
    $('.card .image a').each((index, element) => {
      const href = $(element).attr('href');
      if (href && href.includes('item.php?it_id=')) {
        // 상대 경로를 절대 경로로 변환
        const fullUrl = href.startsWith('http') ? href : `https://gagaon.com${href.startsWith('/') ? '' : '/'}${href}`;
        if (!productUrls.includes(fullUrl)) {
          productUrls.push(fullUrl);
        }
      }
    });
    
    console.log(`카테고리에서 ${productUrls.length}개 상품 URL 추출 완료`);
    return productUrls;
  } catch (error) {
    console.error('카테고리 페이지 스크래핑 오류:', error.message);
    return [];
  }
}

// 개별 상품 상세 정보 스크래핑 함수
async function scrapeProductDetail(url, categoryId) {
  try {
    console.log(`${url} 스크래핑 시작...`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // 상품 정보 추출 (수정된 선택자)
    const productName = $('h1.title').text().trim();
    const priceText = $('.price_wrap strong').text().trim().replace(/[^0-9]/g, '');
    
    // 할인율 추출
    const discountRates = {};
    $('.oop span').each((index, element) => {
      const text = $(element).text().trim();
      if (text.includes('15%')) {
        discountRates.rate15 = parseInt(text.match(/\(([0-9,]+)원\)/)[1].replace(/,/g, ''));
      } else if (text.includes('9%')) {
        discountRates.rate9 = parseInt(text.match(/\(([0-9,]+)원\)/)[1].replace(/,/g, ''));
      } else if (text.includes('6%')) {
        discountRates.rate6 = parseInt(text.match(/\(([0-9,]+)원\)/)[1].replace(/,/g, ''));
      }
    });
    
    // 이미지 URL 추출
    const imageUrl = $('.item_image img').attr('src') || $('img').first().attr('src');
    
    // 상세 정보 추출
    const material = $('.info .div:contains("재질") div:last-child').text().trim();
    const size = $('.info .div:contains("사이즈") div:last-child').text().trim();
    const weight = $('.info .div:contains("중량") div:last-child').text().trim();
    const boxQuantity = $('.info .div:contains("박스수량") div:last-child').text().trim();
    const shippingInfo = $('.info .div:contains("배송정보") div:last-child').text().trim();
    const productCode = $('.info .div:contains("급여코드") div:last-child').text().trim();
    
    // 상품 정보 객체 생성
    const item = {
      productCode: productCode,
      name: productName,
      price: parseInt(priceText),
      discountRates: {
        rate15: discountRates.rate15 || null,
        rate9: discountRates.rate9 || null,
        rate6: discountRates.rate6 || null
      },
      imageUrl: imageUrl,
      material: material,
      size: size,
      weight: weight,
      boxQuantity: boxQuantity,
      shippingInfo: shippingInfo,
      categoryId: categoryId, // 카테고리 ID 참조
      updatedAt: new Date()
    };
    
    console.log('스크래핑된 항목:', item);
    
    // MongoDB에 저장
    const existingItem = await WelfareItem.findOne({ productCode: item.productCode });
    
    if (existingItem) {
      // 업데이트
      await WelfareItem.updateOne({ productCode: item.productCode }, item);
      console.log(`상품 '${item.name}' 정보가 업데이트되었습니다.`);
    } else {
      // 새로 저장
      const newItem = new WelfareItem(item);
      await newItem.save();
      console.log(`상품 '${item.name}' 정보가 저장되었습니다.`);
    }
    
    return item;
  } catch (error) {
    console.error('스크래핑 중 오류 발생:', error.message);
    throw error;
  }
}

// 서브 카테고리의 모든 상품 스크래핑
async function scrapeSubCategory(subCategory) {
  try {
    // 1. 카테고리 페이지에서 모든 상품 URL 가져오기
    const productUrls = await getProductUrlsFromCategory(subCategory.url);
    
    if (productUrls.length === 0) {
      console.log('추출된 상품 URL이 없습니다.');
      return [];
    }
    
    // 2. 각 상품 URL에 대해 상세 정보 스크래핑
    console.log(`총 ${productUrls.length}개 상품 스크래핑 시작...`);
    
    const products = [];
    for (let i = 0; i < productUrls.length; i++) {
      const url = productUrls[i];
      console.log(`(${i+1}/${productUrls.length}) 상품 스크래핑: ${url}`);
      
      try {
        const product = await scrapeProductDetail(url, subCategory._id);
        products.push(product);
        
        // 서버 부하 방지를 위한 지연
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`상품 스크래핑 오류 (${url}):`, error.message);
      }
    }
    
    console.log(`카테고리 '${subCategory.name}' 스크래핑 완료: ${products.length}개 상품`);
    return products;
  } catch (error) {
    console.error('카테고리 스크래핑 오류:', error.message);
    throw error;
  }
}

// 실행 함수
async function main() {
  try {
    // MongoDB 연결
    await mongoose.connect('mongodb://localhost:27017/welfare_db');
    console.log('MongoDB에 연결되었습니다');
    
    // 1. 서브 카테고리 목록 가져오기
    const subCategories = await getSubCategories();
    console.log(`${subCategories.length}개의 서브 카테고리를 찾았습니다`);
    
    // 2. 특정 서브 카테고리 선택 (예: 이동변기)
    const targetSubCategory = subCategories.find(cat => cat.name.includes('목욕의자'));
    
    if (targetSubCategory) {
      console.log(`'${targetSubCategory.name}' 서브 카테고리 선택됨`);
      
      // 3. 선택한 서브 카테고리의 상품 스크래핑
      const products = await scrapeSubCategory(targetSubCategory);
      console.log(`${products.length}개 상품 스크래핑 및 저장 완료`);
    } else {
      console.log('대상 서브 카테고리를 찾을 수 없습니다');
    }
    
  } catch (error) {
    console.error('프로그램 실행 오류:', error);
  } finally {
    // MongoDB 연결 종료
    await mongoose.connection.close();
    console.log('MongoDB 연결이 종료되었습니다');
  }
}

// 프로그램 실행
main();
