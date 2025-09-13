import express from 'express';
import Travel from '../models/Travel';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// すべての旅行を取得
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const travels = await Travel.find({ userId: req.user!._id })
      .sort({ createdAt: -1 });
    res.json(travels);
  } catch (error) {
    console.error('Get travels error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 特定の旅行を取得
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const travel = await Travel.findOne({ 
      _id: req.params.id, 
      userId: req.user!._id 
    });

    if (!travel) {
      return res.status(404).json({ message: '旅行が見つかりません' });
    }

    res.json(travel);
  } catch (error) {
    console.error('Get travel error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 新しい旅行を作成
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      destination,
      startDate,
      endDate,
      budget,
      participants,
      activities = [],
      accommodations = []
    } = req.body;

    // バリデーション
    if (!title || !destination || !startDate || !endDate || !budget || !participants) {
      return res.status(400).json({ message: '必須フィールドを入力してください' });
    }

    const travel = new Travel({
      title,
      description,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget,
      participants,
      userId: req.user!._id,
      activities,
      accommodations
    });

    await travel.save();
    res.status(201).json(travel);
  } catch (error) {
    console.error('Create travel error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 旅行を更新
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const travel = await Travel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!travel) {
      return res.status(404).json({ message: '旅行が見つかりません' });
    }

    res.json(travel);
  } catch (error) {
    console.error('Update travel error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 旅行を削除
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const travel = await Travel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!travel) {
      return res.status(404).json({ message: '旅行が見つかりません' });
    }

    res.json({ message: '旅行が削除されました' });
  } catch (error) {
    console.error('Delete travel error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// アクティビティを追加
router.post('/:id/activities', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const travel = await Travel.findOne({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!travel) {
      return res.status(404).json({ message: '旅行が見つかりません' });
    }

    travel.activities.push(req.body);
    await travel.save();

    res.json(travel);
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 宿泊施設を追加
router.post('/:id/accommodations', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const travel = await Travel.findOne({
      _id: req.params.id,
      userId: req.user!._id
    });

    if (!travel) {
      return res.status(404).json({ message: '旅行が見つかりません' });
    }

    travel.accommodations.push(req.body);
    await travel.save();

    res.json(travel);
  } catch (error) {
    console.error('Add accommodation error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default router;
