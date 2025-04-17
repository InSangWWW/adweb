const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/welfare_db')
  .then(() => console.log('MongoDB에 연결되었습니다'))
  .catch((err) => console.log('MongoDB 연결 오류: ', err));

// 복지용구 스키마 정의
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
  updatedAt: { type: Date, default: Date.now }
});

// 모델 생성
const WelfareItem = mongoose.model('WelfareItem', welfareItemSchema);

// 테스트 스크래핑 함수
async function testScraping() {
  try {
    // 복지용구 판매 사이트 URL 
    const url = 'https://gagaon.com/shop/item.php?it_id=1694664811';
    
    console.log(`${url} 스크래핑 시작...`);
    
    // 웹페이지 HTML 가져오기
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // HTML 파싱
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
      updatedAt: new Date()
    };
    
    console.log('스크래핑된 항목:', item);
    
    // MongoDB에 저장
    try {
      // 이미 존재하는 제품인지 확인
      const existingItem = await WelfareItem.findOne({ productCode: item.productCode });
      
      if (existingItem) {
        // 업데이트
        await WelfareItem.updateOne({ productCode: item.productCode }, item);
        console.log('기존 상품 정보가 업데이트되었습니다.');
      } else {
        // 새 제품 추가
        const newItem = new WelfareItem(item);
        await newItem.save();
        console.log('새 상품 정보가 저장되었습니다.');
      }
    } catch (dbError) {
      console.error('데이터베이스 저장 오류:', dbError);
    }
    
    return item;
    
  } catch (error) {
    console.error('스크래핑 중 오류 발생:', error.message);
    if (error.response) {
      console.error('상태 코드:', error.response.status);
    }
    throw error;
  }
}

// 함수 실행
testScraping()
  .then(item => {
    console.log('스크래핑 및 DB 저장 완료!');
    // 프로세스 종료 (MongoDB 연결 종료를 위해)
    setTimeout(() => {
      mongoose.connection.close();
      console.log('MongoDB 연결이 종료되었습니다.');
    }, 2000);
  })
  .catch(err => {
    console.error('프로그램 실행 중 오류:', err);
    mongoose.connection.close();
  });
