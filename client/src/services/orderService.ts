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
    try {
      console.log('orderService.createOrder - sending data:', orderData);
      const response = await api.post('/orders', orderData);
      console.log('orderService.createOrder - response:', response.data);
      return response.data;
    } catch (error) {
      console.error('orderService.createOrder - error:', error);
      throw error;
    }
  },

  getOrderById: async (orderId: string): Promise<any> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  getUserOrders: async (): Promise<any> => {
    try {
      console.log('orderService.getUserOrders - starting API call');
      const response = await api.get('/orders');
      console.log('orderService.getUserOrders - API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('orderService.getUserOrders - API error:', error);
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