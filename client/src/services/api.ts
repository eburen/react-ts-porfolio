import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// APIのベースURLを環境に応じて設定
// 1. 環境変数VITE_API_URLが設定されている場合はそれを使用
// 2. 本番環境では相対パス '/api' を使用（同一ドメイン内のAPIを参照）
// 3. 開発環境ではlocalhost:5001を使用
const API_URL = import.meta.env.VITE_API_URL || 
               (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');

console.log('API URL:', API_URL); // デバッグ用

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Dispatch logout action to clear auth state
      store.dispatch(logout());
      
      // Only redirect to login if not already on login page
      if (!window.location.pathname.includes('/login')) {
        // Save the current location to redirect back after login
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api; 