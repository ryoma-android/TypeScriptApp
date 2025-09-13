import express from 'express';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// ユーザープロフィール更新
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default router;
