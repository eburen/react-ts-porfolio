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
  paymentInfo: PaymentInfo;
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
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<any> => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }
}; 