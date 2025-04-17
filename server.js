const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// CORS 설정
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/welfare_db')
  .then(() => console.log('MongoDB에 연결되었습니다'))
  .catch(err => console.error('MongoDB 연결 오류:', err));

// 카테고리 스키마 정의
const welfareCategorySchema = new mongoose.Schema({
  name: String,
  caId: String,
  url: String,
  updatedAt: { type: Date, default: Date.now }
});

// 상품 스키마 정의
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
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'WelfareCategory' },
  updatedAt: { type: Date, default: Date.now }
});

// 모델 생성
const WelfareCategory = mongoose.model('WelfareCategory', welfareCategorySchema);
const WelfareItem = mongoose.model('WelfareItem', welfareItemSchema);

// 카테고리 목록 API
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await WelfareCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 카테고리의 상품 목록 API
app.get('/api/categories/:categoryId/items', async (req, res) => {
  try {
    const { page = 1, limit = 10, orderBy = '' } = req.query;
    const skip = (page - 1) * parseInt(limit);
    
    let sortOption = {};
    if (orderBy === 'high_price') sortOption = { price: -1 };
    else if (orderBy === 'row_price') sortOption = { price: 1 };
    else if (orderBy === 'enter_date') sortOption = { updatedAt: -1 };
    
    const items = await WelfareItem.find({ categoryId: req.params.categoryId })
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await WelfareItem.countDocuments({ categoryId: req.params.categoryId });
    
    res.json({
      items: items.map(item => ({






        
        it_id: item.productCode,
        name: item.name,
        price: item.price,
        images: [item.imageUrl],
        manufacturer: item.material,
        origin: item.size,
        durability: item.weight
      })),
      total_items: total,
      total_pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 서버 시작
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
