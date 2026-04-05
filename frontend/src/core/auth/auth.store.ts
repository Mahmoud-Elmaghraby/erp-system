import api from '../api/axios.config';

export const authStore = {
  getToken: () => localStorage.getItem('access_token'),
  setToken: (token: string) => localStorage.setItem('access_token', token),
  removeToken: () => localStorage.removeItem('access_token'),
  isAuthenticated: () => !!localStorage.getItem('access_token'),
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
    }
  },
};