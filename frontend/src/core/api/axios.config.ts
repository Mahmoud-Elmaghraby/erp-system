import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('erp_user');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      console.warn('Access denied:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;