import api from './api';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PaymentInfo {
  paymentMethod: string;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

interface OrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export const orderService = {
  createOrder: async (orderData: OrderData): Promise<any> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<any> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  getUserOrders: async (): Promise<any> => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error in getUserOrders service:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId: string): Promise<any> => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Admin functions
  getAllOrders: async (page = 1, limit = 10): Promise<any> => {
    const response = await api.get(`/orders/admin/all?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<any> => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  updatePaymentStatus: async (orderId: string, paymentStatus: string): Promise<any> => {
    const response = await api.put(`/orders/${orderId}/payment`, { paymentStatus });
    return response.data;
  }
}; 