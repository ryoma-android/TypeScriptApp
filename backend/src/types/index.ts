export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Travel {
  _id: string;
  title: string;
  description: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  participants: number;
  userId: string;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  activities: Activity[];
  accommodations: Accommodation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  _id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  cost: number;
  category: 'sightseeing' | 'food' | 'shopping' | 'entertainment' | 'transport' | 'other';
}

export interface Accommodation {
  _id: string;
  name: string;
  type: 'hotel' | 'ryokan' | 'guesthouse' | 'apartment' | 'other';
  address: string;
  checkIn: Date;
  checkOut: Date;
  cost: number;
  rating?: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}
