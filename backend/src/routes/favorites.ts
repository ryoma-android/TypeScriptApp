import express from 'express';
import Favorite from '../models/Favorite';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// お気に入り一覧取得
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user!._id })
      .populate('travelId')
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// お気に入り追加
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { travelId } = req.body;

    if (!travelId) {
      return res.status(400).json({ message: '旅行IDが必要です' });
    }

    // 既にお気に入りに追加されているかチェック
    const existingFavorite = await Favorite.findOne({
      userId: req.user!._id,
      travelId: travelId
    });

    if (existingFavorite) {
      return res.status(400).json({ message: '既にお気に入りに追加されています' });
    }

    const favorite = new Favorite({
      userId: req.user!._id,
      travelId: travelId
    });

    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// お気に入り削除
router.delete('/:travelId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.user!._id,
      travelId: req.params.travelId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'お気に入りが見つかりません' });
    }

    res.json({ message: 'お気に入りから削除されました' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default router;
