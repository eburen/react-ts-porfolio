import api from './api';

interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const userService = {
  getProfile: async (): Promise<any> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData: UpdateProfileData): Promise<any> => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  getAddresses: async (): Promise<any> => {
    try {
      console.log('userService.getAddresses: Making API call');
      const response = await api.get('/users/addresses');
      console.log('userService.getAddresses: Success', response.data);
      return response.data;
    } catch (error) {
      console.error('userService.getAddresses: Error', error);
      throw error;
    }
  },

  addAddress: async (address: Address): Promise<any> => {
    const response = await api.post('/users/addresses', address);
    return response.data;
  },

  updateAddress: async (id: string, address: Address): Promise<any> => {
    const response = await api.put(`/users/addresses/${id}`, address);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<any> => {
    const response = await api.delete(`/users/addresses/${id}`);
    return response.data;
  },

  getOrders: async (): Promise<any> => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderDetails: async (id: string): Promise<any> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
}; 