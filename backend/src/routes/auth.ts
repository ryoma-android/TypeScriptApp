import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ユーザー登録
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // バリデーション
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'すべてのフィールドを入力してください' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'パスワードは6文字以上である必要があります' });
    }

    // 既存ユーザーチェック
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'このメールアドレスは既に使用されています' });
    }

    // ユーザー作成
    const user = new User({ email, name, password });
    await user.save();

    // JWTトークン生成
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'ユーザー登録が完了しました',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ログイン
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // バリデーション
    if (!email || !password) {
      return res.status(400).json({ message: 'メールアドレスとパスワードを入力してください' });
    }

    // ユーザー検索
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // パスワード検証
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // JWTトークン生成
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'ログインに成功しました',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザー情報取得
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user!._id,
        email: req.user!.email,
        name: req.user!.name
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default router;
