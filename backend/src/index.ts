import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import travelRoutes from './routes/travels';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB接続
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reiwa-travel';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDBに接続しました'))
  .catch((error) => console.error('MongoDB接続エラー:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/users', userRoutes);

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ message: '令和トラベル API が正常に動作しています' });
});

app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});
