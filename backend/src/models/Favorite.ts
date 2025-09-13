import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  travelId: mongoose.Types.ObjectId;
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  travelId: {
    type: Schema.Types.ObjectId,
    ref: 'Travel',
    required: true
  }
}, {
  timestamps: true
});

// ユーザーと旅行の組み合わせは一意
FavoriteSchema.index({ userId: 1, travelId: 1 }, { unique: true });

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema);
