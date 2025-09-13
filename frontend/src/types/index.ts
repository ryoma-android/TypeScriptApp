export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Travel {
  _id: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  participants: number;
  userId: string;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  activities: Activity[];
  accommodations: Accommodation[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  cost: number;
  category: 'sightseeing' | 'food' | 'shopping' | 'entertainment' | 'transport' | 'other';
}

export interface Accommodation {
  _id: string;
  name: string;
  type: 'hotel' | 'ryokan' | 'guesthouse' | 'apartment' | 'other';
  address: string;
  checkIn: string;
  checkOut: string;
  cost: number;
  rating?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
