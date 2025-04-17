const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Express에서 JSON 사용 설정
app.use(express.json());

// MongoDB 연결 (옵션 제거)
mongoose.connect('mongodb://localhost:27017/test')
  .then(() => console.log('MongoDB에 연결되었습니다'))
  .catch((err) => console.log('MongoDB 연결 오류: ', err));

// 스키마 정의
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String
});

// 모델 생성
const User = mongoose.model('User', userSchema);

// 사용자 생성 API
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 모든 사용자 조회 API
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 서버 시작 (포트 변경)
const port = 3001; // 또는 4000, 5000 등 리액트와 충돌하지 않는 포트
app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
});
