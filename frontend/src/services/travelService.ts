import api from './api';
import { Travel, Activity, Accommodation } from '../types';

export interface CreateTravelData {
  title: string;
  description?: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  participants: number;
  activities?: Activity[];
  accommodations?: Accommodation[];
}

export interface UpdateTravelData extends Partial<CreateTravelData> {
  status?: 'planning' | 'confirmed' | 'completed' | 'cancelled';
}

export const travelService = {
  async getTravels(): Promise<Travel[]> {
    const response = await api.get<Travel[]>('/travels');
    return response.data;
  },

  async getTravel(id: string): Promise<Travel> {
    const response = await api.get<Travel>(`/travels/${id}`);
    return response.data;
  },

  async createTravel(data: CreateTravelData): Promise<Travel> {
    const response = await api.post<Travel>('/travels', data);
    return response.data;
  },

  async updateTravel(id: string, data: UpdateTravelData): Promise<Travel> {
    const response = await api.put<Travel>(`/travels/${id}`, data);
    return response.data;
  },

  async deleteTravel(id: string): Promise<void> {
    await api.delete(`/travels/${id}`);
  },

  async addActivity(travelId: string, activity: Omit<Activity, '_id'>): Promise<Travel> {
    const response = await api.post<Travel>(`/travels/${travelId}/activities`, activity);
    return response.data;
  },

  async addAccommodation(travelId: string, accommodation: Omit<Accommodation, '_id'>): Promise<Travel> {
    const response = await api.post<Travel>(`/travels/${travelId}/accommodations`, accommodation);
    return response.data;
  },
};
