import api from './api';

interface ReviewData {
  productId: string;
  rating: number;
  comment: string;
}

export const reviewService = {
  getProductReviews: async (productId: string): Promise<any> => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },

  createReview: async (reviewData: ReviewData): Promise<any> => {
    const response = await api.post(`/products/${reviewData.productId}/reviews`, {
      rating: reviewData.rating,
      comment: reviewData.comment
    });
    return response.data;
  },

  updateReview: async (reviewId: string, reviewData: Partial<ReviewData>): Promise<any> => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  deleteReview: async (reviewId: string): Promise<any> => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
}; 