import api from './api';

export interface Favorite {
  _id: string;
  userId: string;
  travelId: string;
  createdAt: string;
}

export const favoriteService = {
  async getFavorites(): Promise<Favorite[]> {
    const response = await api.get<Favorite[]>('/favorites');
    return response.data;
  },

  async addFavorite(travelId: string): Promise<Favorite> {
    const response = await api.post<Favorite>('/favorites', { travelId });
    return response.data;
  },

  async removeFavorite(travelId: string): Promise<void> {
    await api.delete(`/favorites/${travelId}`);
  },

  async isFavorite(travelId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.travelId === travelId);
    } catch {
      return false;
    }
  },
};
