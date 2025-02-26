import api from './api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export const authService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (userData: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
  }
}; 