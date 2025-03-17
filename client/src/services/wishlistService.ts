import api from './api';

export const wishlistService = {
  getWishlist: async (): Promise<any> => {
    const response = await api.get('/users/wishlist');
    return response.data;
  },

  addToWishlist: async (productId: string): Promise<any> => {
    const response = await api.post('/users/wishlist', { productId });
    return response.data;
  },

  removeFromWishlist: async (productId: string): Promise<any> => {
    const response = await api.delete(`/users/wishlist/${productId}`);
    return response.data;
  }
}; 