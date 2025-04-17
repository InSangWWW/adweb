const puppeteer = require('puppeteer');
const mongoose = require('mongoose');

// MongoDB 모델 정의 (기존 모델 활용 또는 새로 정의)
const seniorSchema = new mongoose.Schema({
  name: String,
  gender: String,
  birthYear: String,
  manager: String,
  status: String,
  certNumber: String,
  grade: String,
  phone: String,
  birthDate: String,
  remainingAmount: String,
  validPeriod: String,
  applicationPeriod: String,
  lastUpdated: String
});

const Senior = mongoose.model('Senior', seniorSchema);

async function loginAndScrapeSeniorInfo() {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1366, height: 768 }
    });
  
    try {
      const page = await browser.newPage();
      
      // 로그인 페이지로 이동
      await page.goto('https://gagaon.com/bbs/login.php', { waitUntil: 'networkidle2' });

    // 사용자가 직접 로그인할 수 있도록 대기
    console.log('브라우저에서 직접 로그인해주세요...');
// 현재 URL 저장
const loginPageUrl = page.url();

// URL이 변경될 때까지 대기 (로그인 성공 시 다른 페이지로 리디렉션됨)
await page.waitForFunction(
  (originalUrl) => window.location.href !== originalUrl,
  { timeout: 60000 },
  loginPageUrl
);

console.log('페이지 변경 감지! 스크래핑을 시작합니다...');

    
    // 복지인증번호 등록 페이지로 이동
    await page.goto('https://gagaon.com/biz/senior.php', { waitUntil: 'networkidle2' });
    
    // 페이지 로딩 확인
    await page.waitForSelector('.list_wrap');
    
    // 복지인증 정보 스크래핑
    const seniorInfoList = await page.evaluate(() => {
      const seniors = [];
      const items = document.querySelectorAll('.list_wrap .item');
      
      items.forEach(item => {
        // 이름과 성별, 출생년도 추출
        const nameText = item.querySelector('.name label').textContent.trim();
        const nameMatch = nameText.match(/(.*) \((남|여), (\d+)년생\)/);
        const name = nameMatch ? nameMatch[1].trim() : nameText;
        const gender = nameMatch ? nameMatch[2] : '';
        const birthYear = nameMatch ? nameMatch[3] : '';
        
        // 담당자 정보
        const manager = item.querySelector('.name .desc') ? 
          item.querySelector('.name .desc').textContent.trim() : '';
        
        // 상태 정보
        const status = item.querySelector('.btn_category span') ? 
          item.querySelector('.btn_category span').textContent.trim() : '';
        
        // 인증번호 및 등급 정보
        const certNumber = item.querySelector('.bottom .head strong') ? 
          item.querySelector('.bottom .head strong').textContent.trim() : '';
        
        const grade = item.querySelector('.bottom .head .desc') ? 
          item.querySelector('.bottom .head .desc').textContent.trim() : '';
        
        // 전화번호
        const phone = item.querySelector('.public_tel') ? 
          item.querySelector('.public_tel').textContent.trim() : '';
        
        // 정보 목록에서 데이터 추출
        const infoLists = item.querySelectorAll('.info_wrap .info_list');
        let birthDate = '', remainingAmount = '', validPeriod = '', applicationPeriod = '';
        
        infoLists.forEach(infoList => {
          const subject = infoList.querySelector('.subject').textContent.trim();
          const info = infoList.querySelector('.info').textContent.trim();
          
          if (subject === '생년월일.') birthDate = info;
          else if (subject === '남은금액.') remainingAmount = info;
          else if (subject === '유효기간.') validPeriod = info;
          else if (subject === '적용기간.') applicationPeriod = info;
        });
        
        // 마지막 업데이트 정보
        const lastUpdated = item.querySelector('.btn_refresh') ? 
          item.querySelector('.btn_refresh').textContent.trim() : '';
        
        seniors.push({
          name,
          gender,
          birthYear,
          manager,
          status,
          certNumber,
          grade,
          phone,
          birthDate,
          remainingAmount,
          validPeriod,
          applicationPeriod,
          lastUpdated
        });
      });
      
      return seniors;
    });
    
    console.log(`${seniorInfoList.length}명의 복지인증 정보를 스크래핑했습니다.`);
    console.log(seniorInfoList);
    
    // MongoDB에 저장
    await mongoose.connect('mongodb://localhost:27017/welfare_db');
    
    for (const seniorInfo of seniorInfoList) {
      // 기존 데이터가 있는지 확인
      const existingSenior = await Senior.findOne({ certNumber: seniorInfo.certNumber });
      
      if (existingSenior) {
        // 업데이트
        await Senior.updateOne({ certNumber: seniorInfo.certNumber }, seniorInfo);
        console.log(`${seniorInfo.name}님의 정보가 업데이트되었습니다.`);
      } else {
        // 새로 저장
        const senior = new Senior(seniorInfo);
        await senior.save();
        console.log(`${seniorInfo.name}님의 정보가 저장되었습니다.`);
      }
    }
    
    return seniorInfoList;
    
  } catch (error) {
    console.error('스크래핑 오류:', error);
    throw error;
  } finally {
    await browser.close();
    await mongoose.connection.close();
  }
}

// 함수 실행
const username = '아이디입력';
const password = '비밀번호입력';

loginAndScrapeSeniorInfo(username, password)
  .then(result => {
    console.log('스크래핑 완료!');
  })
  .catch(err => {
    console.error('프로그램 실행 오류:', err);
  });
