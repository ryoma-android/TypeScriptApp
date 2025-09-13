import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  cost: number;
  category: 'sightseeing' | 'food' | 'shopping' | 'entertainment' | 'transport' | 'other';
}

export interface IAccommodation extends Document {
  name: string;
  type: 'hotel' | 'ryokan' | 'guesthouse' | 'apartment' | 'other';
  address: string;
  checkIn: Date;
  checkOut: Date;
  cost: number;
  rating?: number;
}

export interface ITravel extends Document {
  title: string;
  description: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  participants: number;
  userId: mongoose.Types.ObjectId;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  activities: IActivity[];
  accommodations: IAccommodation[];
}

const ActivitySchema = new Schema<IActivity>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'shopping', 'entertainment', 'transport', 'other'],
    required: true
  }
});

const AccommodationSchema = new Schema<IAccommodation>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['hotel', 'ryokan', 'guesthouse', 'apartment', 'other'],
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

const TravelSchema = new Schema<ITravel>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  participants: {
    type: Number,
    required: true,
    min: 1
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'completed', 'cancelled'],
    default: 'planning'
  },
  activities: [ActivitySchema],
  accommodations: [AccommodationSchema]
}, {
  timestamps: true
});

export default mongoose.model<ITravel>('Travel', TravelSchema);
